export type RegistryComponentType = "block" | "component";

export interface RegistryComponent {
  name: string;
  type: RegistryComponentType;
  group: string;
  importPath: string;
  sourceFile: string;
  description: string;
  parts?: readonly string[];
}

export interface RegistrySearchIndex {
  byGroup: Readonly<Record<string, readonly string[]>>;
  byName: readonly string[];
  byType: Readonly<Record<RegistryComponentType, readonly string[]>>;
}

export interface ComponentRegistry {
  schemaVersion: 1;
  package: {
    name: string;
    version: string;
  };
  components: Readonly<Record<string, RegistryComponent>>;
  search: RegistrySearchIndex;
}
