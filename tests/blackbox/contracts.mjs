import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { optionalEntrypoints } from "./optional-entrypoints.mjs";

export async function writeContracts(consumer, baselinePath, compoundPath, full) {
  const compounds = (await readFile(compoundPath, "utf8")).trim().split("\n").map(line => JSON.parse(line));
  const records = (await readFile(baselinePath, "utf8")).trim().split("\n").map(line => JSON.parse(line))
    .filter(record => full || !optionalEntrypoints.has(record.module))
    .map(record => ({ ...record, declaredCompoundParts: compounds.find(item => item.module === record.module).declaredCompoundParts }));
  const directory = join(consumer, "blackbox-contracts");
  await mkdir(directory, { recursive: true });
  for (const [index, record] of records.entries()) {
    const { module: specifier, requiredValueExports: values, requiredTypeExports: types, declaredCompoundParts } = record;
    const valueImports = values.map((name, id) => `${name} as value${id}`).join(", ");
    const typeImports = types.map((name, id) => `${name} as RequiredType${id}`).join(", ");
    const declarations = [];
    if (values.length) declarations.push(`import { ${valueImports} } from ${JSON.stringify(specifier)};`);
    if (types.length) declarations.push(`import type { ${typeImports} } from ${JSON.stringify(specifier)};`);
    let count = 0;
    for (const [compound, parts] of Object.entries(declaredCompoundParts)) {
      for (const [part, named] of Object.entries(parts)) {
        const root = `value${values.indexOf(compound)}`;
        const target = typeof named === "string" ? `value${values.indexOf(named)}` : `external${count}`;
        if (typeof named !== "string") declarations.push(`import { ${named.name} as ${target} } from ${JSON.stringify(named.module)};`);
        if (target === "value-1") throw new Error(`Missing frozen named target for ${specifier} ${compound}.${part}`);
        declarations.push(`const part${count}: typeof ${target} = ${root}[${JSON.stringify(part)}];`);
        declarations.push(`const named${count}: typeof ${root}[${JSON.stringify(part)}] = ${target};`);
        count++;
      }
    }
    await writeFile(join(directory, `${index}.ts`), declarations.join("\n") + "\n");
    if (values.length) {
      await writeFile(join(directory, `${index}.mjs`), [
        `import { ${valueImports} } from ${JSON.stringify(specifier)};`,
        `export default { ${values.map((name, id) => `${JSON.stringify(name)}: value${id}`).join(", ")} };`,
      ].join("\n"));
    }
  }
  await writeFile(join(directory, "baseline.json"), JSON.stringify(records));
  await writeFile(join(consumer, "tsconfig.blackbox.json"), JSON.stringify({
    compilerOptions: {
      target: "ES2022", module: "ESNext", moduleResolution: "Bundler", strict: true,
      noEmit: true, skipLibCheck: false, resolveJsonModule: true, types: [], lib: ["ES2022", "DOM", "DOM.Iterable"],
    },
    include: ["blackbox-contracts/**/*.ts", "src/snippets/**/*.vue", "src/components/blackbox/**/*.vue", "blackbox-consumer-types.ts"],
  }, null, 2));
}
