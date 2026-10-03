import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import ts from "typescript";

const LOCAL_MODULE_EXTENSIONS = [".vue", ".ts", ".tsx"];
const componentModuleCache = new Map();

const toPosix = (value) => value.split(sep).join("/");
const isLocalSpecifier = (value) => value.startsWith(".");
const hasExportModifier = (node) =>
  Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));

const humanize = (value) =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const unwrapExpression = (expression) => {
  let current = expression;
  while (
    ts.isAsExpression(current) ||
    ts.isTypeAssertionExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isNonNullExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return current;
};

const getPropertyName = (name) => {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
};

export const resolveLocalModule = (fromFile, specifier) => {
  if (!isLocalSpecifier(specifier)) return null;

  const basePath = resolve(dirname(fromFile), specifier);
  const candidates = extname(basePath)
    ? [basePath]
    : [
        ...LOCAL_MODULE_EXTENSIONS.map((extension) => `${basePath}${extension}`),
        join(basePath, "index.ts"),
      ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
};

const parseSourceFile = (filePath) =>
  ts.createSourceFile(
    filePath,
    readFileSync(filePath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

export const isVueComponentModule = (filePath) => {
  if (filePath.endsWith(".vue")) return true;
  if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return false;
  if (componentModuleCache.has(filePath)) return componentModuleCache.get(filePath);

  let isComponent = false;
  const sourceFile = parseSourceFile(filePath);
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "defineComponent"
    ) {
      isComponent = true;
      return;
    }
    if (!isComponent) ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  componentModuleCache.set(filePath, isComponent);
  return isComponent;
};

const createIndexResolver = (indexPath, sourceFile) => {
  const imports = new Map();
  const declarations = new Map();

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const resolvedModule = resolveLocalModule(indexPath, statement.moduleSpecifier.text);
      if (!resolvedModule || !statement.importClause) continue;

      const importInfo = {
        isComponent: isVueComponentModule(resolvedModule),
        sourceFile: resolvedModule,
      };
      if (statement.importClause.name) imports.set(statement.importClause.name.text, importInfo);

      const bindings = statement.importClause.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) imports.set(element.name.text, importInfo);
      }
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          declarations.set(declaration.name.text, declaration.initializer);
        }
      }
    }
  }

  const resolveIdentifier = (name, seen = new Set()) => {
    if (seen.has(name)) return null;
    const imported = imports.get(name);
    if (imported) return imported.isComponent ? imported.sourceFile : null;

    const initializer = declarations.get(name);
    if (!initializer) return null;
    seen.add(name);
    return resolveExpression(initializer, seen);
  };

  const resolveExpression = (rawExpression, seen = new Set()) => {
    const expression = unwrapExpression(rawExpression);
    if (ts.isIdentifier(expression)) return resolveIdentifier(expression.text, seen);

    if (ts.isCallExpression(expression)) {
      if (ts.isIdentifier(expression.expression) && expression.expression.text === "defineComponent") {
        return indexPath;
      }
      if (
        ts.isPropertyAccessExpression(expression.expression) &&
        ts.isIdentifier(expression.expression.expression) &&
        expression.expression.expression.text === "Object" &&
        expression.expression.name.text === "assign"
      ) {
        return expression.arguments[0] ? resolveExpression(expression.arguments[0], seen) : null;
      }
    }

    return null;
  };

  const getCompoundParts = (rawExpression) => {
    const expression = unwrapExpression(rawExpression);
    if (
      !ts.isCallExpression(expression) ||
      !ts.isPropertyAccessExpression(expression.expression) ||
      !ts.isIdentifier(expression.expression.expression) ||
      expression.expression.expression.text !== "Object" ||
      expression.expression.name.text !== "assign"
    ) {
      return [];
    }

    const partsObject = expression.arguments[1];
    if (!partsObject || !ts.isObjectLiteralExpression(partsObject)) return [];

    return partsObject.properties.flatMap((property) => {
      if (ts.isPropertyAssignment(property)) {
        const name = getPropertyName(property.name);
        return name && resolveExpression(property.initializer) ? [name] : [];
      }
      if (ts.isShorthandPropertyAssignment(property)) {
        return resolveIdentifier(property.name.text) ? [property.name.text] : [];
      }
      return [];
    });
  };

  return { getCompoundParts, resolveExpression, resolveIdentifier };
};

const discoverBarrel = ({ indexPath, packageName, packageRoot, type }) => {
  const sourceFile = parseSourceFile(indexPath);
  const resolver = createIndexResolver(indexPath, sourceFile);
  const sourceRoot = join(packageRoot, "src");
  const group = dirname(indexPath).split(sep).at(-1);
  const importPath =
    type === "component"
      ? `${packageName}/components/${group}`
      : `${packageName}/blocks/${group}`;
  const entries = new Map();

  const addEntry = (name, componentSource, parts = []) => {
    if (!name || !componentSource || !/^[A-Z]/.test(name)) return;
    const entry = {
      name,
      type,
      group,
      importPath,
      sourceFile: toPosix(relative(sourceRoot, componentSource)),
      description: `${name} ${type} exported by the ${humanize(group)} module.`,
      ...(parts.length ? { parts } : {}),
    };
    entries.set(name, entry);
  };

  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement) && hasExportModifier(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
        addEntry(
          declaration.name.text,
          resolver.resolveExpression(declaration.initializer),
          resolver.getCompoundParts(declaration.initializer),
        );
      }
      continue;
    }

    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) continue;
    if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue;

    const moduleSpecifier =
      statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
        ? statement.moduleSpecifier.text
        : null;
    const resolvedModule = moduleSpecifier ? resolveLocalModule(indexPath, moduleSpecifier) : null;
    const moduleIsComponent = resolvedModule ? isVueComponentModule(resolvedModule) : false;

    for (const element of statement.exportClause.elements) {
      if (element.isTypeOnly) continue;
      const exportedName = element.name.text;
      if (moduleSpecifier) {
        if (moduleIsComponent) addEntry(exportedName, resolvedModule);
        continue;
      }

      const localName = element.propertyName?.text ?? exportedName;
      addEntry(exportedName, resolver.resolveIdentifier(localName));
    }
  }

  return [...entries.values()];
};

const discoverArea = ({ area, packageName, packageRoot, type }) => {
  const areaRoot = join(packageRoot, "src", area);
  if (!existsSync(areaRoot)) return [];

  return readdirSync(areaRoot, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) return [];
    const indexPath = join(areaRoot, entry.name, "index.ts");
    if (!existsSync(indexPath)) return [];
    return discoverBarrel({ indexPath, packageName, packageRoot, type });
  });
};

export const discoverRegistryEntries = ({ packageName, packageRoot }) => {
  componentModuleCache.clear();
  const entries = [
    ...discoverArea({ area: "components", packageName, packageRoot, type: "component" }),
    ...discoverArea({ area: "blocks", packageName, packageRoot, type: "block" }),
  ].sort((left, right) => left.name.localeCompare(right.name));

  const duplicateNames = entries
    .filter((entry, index) => entries.findIndex((candidate) => candidate.name === entry.name) !== index)
    .map((entry) => entry.name);
  if (duplicateNames.length) {
    throw new Error(`Duplicate registry exports: ${[...new Set(duplicateNames)].join(", ")}`);
  }

  return entries;
};

export const createComponentRegistry = ({ packageName, packageRoot, packageVersion }) => {
  const entries = discoverRegistryEntries({ packageName, packageRoot });
  const components = Object.fromEntries(entries.map((entry) => [entry.name, entry]));
  const byGroup = {};
  const byType = { block: [], component: [] };

  for (const entry of entries) {
    (byGroup[entry.group] ??= []).push(entry.name);
    byType[entry.type].push(entry.name);
  }

  return {
    schemaVersion: 1,
    package: { name: packageName, version: packageVersion },
    components,
    search: {
      byGroup: Object.fromEntries(
        Object.entries(byGroup)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([group, names]) => [group, names.sort((left, right) => left.localeCompare(right))]),
      ),
      byName: entries.map((entry) => entry.name),
      byType,
    },
  };
};
