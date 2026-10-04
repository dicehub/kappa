import ts from "typescript";
import { resolve } from "node:path";

export const checkConsumerDeclarations = (consumerRoot) => {
  const configPath = resolve(consumerRoot, "tsconfig.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, consumerRoot);
  const program = ts.createProgram(parsed.fileNames, { ...parsed.options, skipLibCheck: false });
  const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
  if (diagnostics.length) {
    throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (file) => file,
      getCurrentDirectory: () => consumerRoot,
      getNewLine: () => "\n",
    }));
  }
};
