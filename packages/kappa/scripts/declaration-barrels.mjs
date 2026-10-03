import ts from "typescript";

const parse = (content) => ts.createSourceFile("index.ts", content, ts.ScriptTarget.Latest, true);
const isExported = (statement) => statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
const isReference = (node) => ts.isIdentifier(node) || ts.isPropertyAccessExpression(node);

/** Preserve Vue component identities instead of expanding their instance types. */
export const preserveCompoundDeclarations = (source, declaration) => {
  const sourceFile = parse(source);
  const declarationFile = parse(declaration);
  const compounds = new Map();
  const references = new Set();
  const factory = ts.factory;
  const query = (expression) => {
    references.add(expression.getText(sourceFile).split(".")[0]);
    return factory.createTypeQueryNode(expression);
  };

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const variable of statement.declarationList.declarations) {
      const call = variable.initializer;
      if (ts.isIdentifier(variable.name) && call && isReference(call) && !variable.type) {
        compounds.set(variable.name.text, query(call));
        continue;
      }
      if (!isExported(statement)) continue;
      if (!ts.isIdentifier(variable.name) || !call || !ts.isCallExpression(call)) continue;
      if (call.expression.getText(sourceFile) !== "Object.assign" || call.arguments.length !== 2) continue;
      const [root, parts] = call.arguments;
      if (!isReference(root) || !ts.isObjectLiteralExpression(parts)) continue;
      if (!parts.properties.every((part) => ts.isPropertyAssignment(part) && isReference(part.initializer))) continue;

      compounds.set(variable.name.text, factory.createIntersectionTypeNode([
        query(root),
        factory.createTypeLiteralNode(parts.properties.map((part) => factory.createPropertySignature(
          undefined, part.name, undefined, query(part.initializer),
        ))),
      ]));
    }
  }
  if (compounds.size === 0) return declaration;

  const statements = declarationFile.statements.map((statement) => {
    if (!ts.isVariableStatement(statement)) return statement;
    return factory.updateVariableStatement(statement, statement.modifiers, factory.updateVariableDeclarationList(
      statement.declarationList,
      statement.declarationList.declarations.map((variable) => {
        const type = ts.isIdentifier(variable.name) && compounds.get(variable.name.text);
        return type ? factory.updateVariableDeclaration(variable, variable.name, undefined, type, undefined) : variable;
      }),
    ));
  });

  const bound = new Set();
  for (const statement of declarationFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) continue;
    const clause = statement.importClause;
    if (clause.name) bound.add(clause.name.text);
    if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) bound.add(clause.namedBindings.name.text);
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const binding of clause.namedBindings.elements) bound.add(binding.name.text);
    }
  }

  const imports = sourceFile.statements.flatMap((statement) => {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) return [];
    const clause = statement.importClause;
    const name = clause.name && references.has(clause.name.text) && !bound.has(clause.name.text) ? clause.name : undefined;
    let bindings;
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      const elements = clause.namedBindings.elements.filter((binding) => references.has(binding.name.text) && !bound.has(binding.name.text));
      if (elements.length) bindings = factory.createNamedImports(elements);
    } else if (clause.namedBindings && references.has(clause.namedBindings.name.text) && !bound.has(clause.namedBindings.name.text)) {
      bindings = clause.namedBindings;
    }
    return name || bindings ? [factory.createImportDeclaration(
      undefined, factory.createImportClause(true, name, bindings), factory.createStringLiteral(statement.moduleSpecifier.text),
    )] : [];
  });

  const output = factory.updateSourceFile(declarationFile, [...imports, ...statements]);
  return ts.createPrinter().printFile(output);
};
