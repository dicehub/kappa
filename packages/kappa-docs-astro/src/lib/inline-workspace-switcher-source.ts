// read_when: Change workspace-switcher data used by copyable Application Shell examples.
export function inlineWorkspaceSwitcherSource(source: string, sharedSource: string): string {
  const helperImport = /^import \{[^\n]+\} from "\.\.\/data\/workspace-switcher-demo";\n/m;
  if (!helperImport.test(source)) return source;
  let result = source.replace(helperImport, "");
  const iconImport = /^import \{([^\n]+)\} from "@lucide\/vue";/m;
  const originalIcons = result.match(iconImport);
  const sharedIcons = sharedSource.match(iconImport);
  if (!originalIcons || !sharedIcons) throw new Error("Workspace examples need a named Lucide import.");
  const names = [...new Set([...originalIcons[1].split(","), ...sharedIcons[1].split(",")].map(name => name.trim()))];
  result = result.replace(iconImport, `import { ${names.join(", ")} } from "@lucide/vue";`);
  const publicTypeImport = sharedSource.match(/^import type [^\n]+;/m)?.[0] ?? "";
  const declarations = sharedSource.replace(/^import [^\n]+;\n/gm, "").replace(/^export /gm, "").trim();
  const imports = [...result.matchAll(/^import [^\n]+;/gm)];
  const lastImport = imports.at(-1)!;
  const end = lastImport.index! + lastImport[0].length;
  return `${result.slice(0, end)}${publicTypeImport ? `\n${publicTypeImport}` : ""}\n\n${declarations}\n\n${result.slice(end).trimStart()}`;
}
