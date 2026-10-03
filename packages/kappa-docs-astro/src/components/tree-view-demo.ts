export interface TreeDemoNode {
  children?: TreeDemoNode[];
  childrenCount?: number;
  kind?: "case" | "file" | "folder" | "result";
  label: string;
  meta?: string;
  value: string;
}
