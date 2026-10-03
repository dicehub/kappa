import { cloneVNode, Comment, defineComponent, Fragment, isVNode, mergeProps, type VNode } from "vue";

function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap(node => node.type === Fragment && Array.isArray(node.children)
    ? flatten(node.children.filter(isVNode)) : [node]);
}

// Ark's asChild lets child props win. Enforce disabled link semantics after that merge.
export default defineComponent({
  name: "SidebarMenuChild",
  inheritAttrs: false,
  props: { disabled: Boolean },
  setup(props, { attrs, slots }) {
    return () => {
      const nodes = flatten(slots.default?.() ?? []);
      const index = nodes.findIndex(node => node.type !== Comment);
      if (index < 0) return nodes;
      const child = nodes[index];
      const disabled = props.disabled ? {
        href: null,
        tabindex: -1,
        "aria-disabled": true,
        ...(child.type === "a" ? { role: "link" } : {}),
        ...(child.type === "button" ? { disabled: true } : {}),
      } : {};
      nodes[index] = cloneVNode({ ...child, props: {} }, mergeProps(attrs, child.props ?? {}, disabled));
      return nodes;
    };
  },
});
