export interface VirtualTreeEngineOptions<T> {
  isNodeDisabled: (node: T) => boolean;
  nodeToChildren: (node: T) => readonly T[] | undefined;
  nodeToChildrenCount: (node: T) => number | undefined;
  nodeToString: (node: T) => string;
  nodeToValue: (node: T) => string;
}

export interface IndexedVirtualTreeNode<T> {
  children?: string[];
  depth: number;
  disabled: boolean;
  hasChildren: boolean;
  label: string;
  node: T;
  parentValue?: string;
  position: number;
  setSize: number;
  value: string;
}

interface PendingNode<T> {
  depth: number;
  node: T;
  parentValue?: string;
  position: number;
  setSize: number;
}

/**
 * Non-reactive tree index for VirtualTree. Vue observes the small rendered window,
 * not every source node.
 */
export class VirtualTreeEngine<T> {
  private readonly nodes = new Map<string, IndexedVirtualTreeNode<T>>();
  private readonly options: VirtualTreeEngineOptions<T>;
  private rootValues: string[] = [];

  constructor(items: readonly T[], options: VirtualTreeEngineOptions<T>) {
    this.options = options;
    this.replace(items);
  }

  replace(items: readonly T[]) {
    const nextNodes = new Map<string, IndexedVirtualTreeNode<T>>();
    this.rootValues = this.indexNodes(items, undefined, 1, nextNodes);
    this.nodes.clear();
    for (const [value, record] of nextNodes) this.nodes.set(value, record);
  }

  get size() {
    return this.nodes.size;
  }

  get(value: string) {
    return this.nodes.get(value);
  }

  getNode(value: string) {
    return this.nodes.get(value)?.node;
  }

  getAncestors(value: string) {
    const ancestors: IndexedVirtualTreeNode<T>[] = [];
    let parentValue = this.nodes.get(value)?.parentValue;
    while (parentValue !== undefined) {
      const parent = this.nodes.get(parentValue);
      if (!parent) break;
      ancestors.push(parent);
      parentValue = parent.parentValue;
    }
    ancestors.reverse();
    return ancestors;
  }

  getSiblings(value: string) {
    const record = this.nodes.get(value);
    if (!record) return [];
    const values = record.parentValue
      ? this.nodes.get(record.parentValue)?.children
      : this.rootValues;
    return (values ?? []).flatMap((itemValue) => {
      const item = this.nodes.get(itemValue);
      return item ? [item] : [];
    });
  }

  getVisible(expanded: ReadonlySet<string>) {
    return this.collect(this.rootValues, expanded);
  }

  getVisibleDescendants(value: string, expanded: ReadonlySet<string>) {
    const children = this.nodes.get(value)?.children;
    return children ? this.collect(children, expanded) : [];
  }

  getDescendantValues(value: string) {
    const result: string[] = [];
    const stack = [...(this.nodes.get(value)?.children ?? [])].reverse();
    while (stack.length > 0) {
      const currentValue = stack.pop();
      if (currentValue === undefined) continue;
      const current = this.nodes.get(currentValue);
      if (!current) continue;
      result.push(currentValue);
      if (current.children) {
        for (let index = current.children.length - 1; index >= 0; index -= 1) {
          stack.push(current.children[index]!);
        }
      }
    }
    return result;
  }

  insertChildren(parentValue: string, children: readonly T[]) {
    const parent = this.nodes.get(parentValue);
    if (!parent) throw new Error(`VirtualTree node "${parentValue}" was not found.`);
    if (parent.children?.length) return parent.children;

    const nextNodes = new Map<string, IndexedVirtualTreeNode<T>>();
    const childValues = this.indexNodes(children, parentValue, parent.depth + 1, nextNodes);
    for (const value of nextNodes.keys()) {
      if (this.nodes.has(value)) {
        throw new Error(`VirtualTree node values must be unique. Duplicate: "${value}".`);
      }
    }
    for (const [value, record] of nextNodes) this.nodes.set(value, record);
    parent.children = childValues;
    parent.hasChildren = childValues.length > 0;
    return childValues;
  }

  private collect(values: readonly string[], expanded: ReadonlySet<string>) {
    const result: IndexedVirtualTreeNode<T>[] = [];
    const stack = [...values].reverse();
    while (stack.length > 0) {
      const value = stack.pop();
      if (value === undefined) continue;
      const record = this.nodes.get(value);
      if (!record) continue;
      result.push(record);
      if (record.children && expanded.has(value)) {
        for (let index = record.children.length - 1; index >= 0; index -= 1) {
          stack.push(record.children[index]!);
        }
      }
    }
    return result;
  }

  private indexNodes(
    items: readonly T[],
    parentValue: string | undefined,
    depth: number,
    target: Map<string, IndexedVirtualTreeNode<T>>,
  ) {
    const values = items.map((node) => this.options.nodeToValue(node));
    const stack: PendingNode<T>[] = [];
    for (let index = items.length - 1; index >= 0; index -= 1) {
      stack.push({
        depth,
        node: items[index]!,
        parentValue,
        position: index + 1,
        setSize: items.length,
      });
    }

    while (stack.length > 0) {
      const pending = stack.pop()!;
      const value = this.options.nodeToValue(pending.node);
      if (target.has(value)) {
        throw new Error(`VirtualTree node values must be unique. Duplicate: "${value}".`);
      }
      const sourceChildren = this.options.nodeToChildren(pending.node) ?? [];
      const children = sourceChildren.map((node) => this.options.nodeToValue(node));
      const childrenCount = this.options.nodeToChildrenCount(pending.node);
      target.set(value, {
        children: children.length > 0 ? children : undefined,
        depth: pending.depth,
        disabled: this.options.isNodeDisabled(pending.node),
        hasChildren: children.length > 0 || (childrenCount ?? 0) > 0,
        label: this.options.nodeToString(pending.node),
        node: pending.node,
        parentValue: pending.parentValue,
        position: pending.position,
        setSize: pending.setSize,
        value,
      });

      for (let index = sourceChildren.length - 1; index >= 0; index -= 1) {
        stack.push({
          depth: pending.depth + 1,
          node: sourceChildren[index]!,
          parentValue: value,
          position: index + 1,
          setSize: sourceChildren.length,
        });
      }
    }
    return values;
  }
}
