import { componentRegistry } from "./generated";
import type { RegistryComponent } from "./types";

export { componentRegistry, registryComponentNames } from "./generated";
export type { RegistryComponentName } from "./generated";
export type {
  ComponentRegistry,
  RegistryComponent,
  RegistryComponentType,
  RegistrySearchIndex,
} from "./types";

const registryEntries: Readonly<Record<string, RegistryComponent>> = componentRegistry.components;

export const getRegistryComponent = (name: string): RegistryComponent | undefined => registryEntries[name];
