import type {
  TreeViewCheckedChangeDetails,
  TreeViewExpandedChangeDetails,
  TreeViewFocusChangeDetails,
  TreeViewLoadChildrenCompleteDetails,
  TreeViewLoadChildrenErrorDetails,
  TreeViewRenameCompleteDetails,
  TreeViewRenameStartDetails,
  TreeViewSelectionChangeDetails,
  TreeCollection,
  TreeNode,
  TreeViewBranchContentProps as ArkTreeViewBranchContentProps,
  TreeViewBranchControlProps as ArkTreeViewBranchControlProps,
  TreeViewBranchIndentGuideProps as ArkTreeViewBranchIndentGuideProps,
  TreeViewBranchIndicatorProps as ArkTreeViewBranchIndicatorProps,
  TreeViewBranchProps as ArkTreeViewBranchProps,
  TreeViewBranchTextProps as ArkTreeViewBranchTextProps,
  TreeViewBranchTriggerProps as ArkTreeViewBranchTriggerProps,
  TreeViewContextProps as ArkTreeViewContextProps,
  TreeViewItemIndicatorProps as ArkTreeViewItemIndicatorProps,
  TreeViewItemProps as ArkTreeViewItemProps,
  TreeViewItemTextProps as ArkTreeViewItemTextProps,
  TreeViewLabelProps as ArkTreeViewLabelProps,
  TreeViewNodeCheckboxIndicatorProps as ArkTreeViewNodeCheckboxIndicatorProps,
  TreeViewNodeCheckboxProps as ArkTreeViewNodeCheckboxProps,
  TreeViewNodeContextProps as ArkTreeViewNodeContextProps,
  TreeViewNodeProviderProps as ArkTreeViewNodeProviderProps,
  TreeViewNodeRenameInputProps as ArkTreeViewNodeRenameInputProps,
  TreeViewRootProps as ArkTreeViewRootProps,
  TreeViewRootProviderProps as ArkTreeViewRootProviderProps,
  TreeViewTreeProps as ArkTreeViewTreeProps,
  UseTreeViewContext,
  UseTreeViewNodeContext,
  UseTreeViewReturn,
} from "@ark-ui/vue/tree-view";
import type { UnwrapRef, VNodeChild } from "vue";

export type TreeViewCollection<T extends TreeNode = TreeNode> = TreeCollection<T>;
export type TreeViewApi<T extends TreeNode = TreeNode> = UnwrapRef<UseTreeViewReturn<T>>;
export type TreeViewContextValue<T extends TreeNode = TreeNode> = UnwrapRef<
  UseTreeViewContext<T>
>;
export type TreeViewNodeContextValue<T extends TreeNode = TreeNode> = UnwrapRef<
  UseTreeViewNodeContext
>;

export type TreeViewProps<T extends TreeNode = TreeNode> = ArkTreeViewRootProps<T>;
export type TreeViewRootProps<T extends TreeNode = TreeNode> = TreeViewProps<T>;
export type TreeViewRootProviderProps<T extends TreeNode = TreeNode> = Omit<
  ArkTreeViewRootProviderProps<T>,
  "value"
> & {
  value: TreeViewApi<T>;
};

export type TreeViewEmits<T extends TreeNode = TreeNode> = {
  beforeRename: [details: TreeViewRenameCompleteDetails];
  checkedChange: [details: TreeViewCheckedChangeDetails];
  expandedChange: [details: TreeViewExpandedChangeDetails<T>];
  focusChange: [details: TreeViewFocusChangeDetails<T>];
  loadChildrenComplete: [details: TreeViewLoadChildrenCompleteDetails<T>];
  loadChildrenError: [details: TreeViewLoadChildrenErrorDetails<T>];
  renameComplete: [details: TreeViewRenameCompleteDetails];
  renameStart: [details: TreeViewRenameStartDetails<T>];
  selectionChange: [details: TreeViewSelectionChangeDetails<T>];
  "update:checkedValue": [value: string[]];
  "update:expandedValue": [value: string[]];
  "update:focusedValue": [value: string | null];
  "update:selectedValue": [value: string[]];
};

export interface TreeViewSlots {
  default?: () => VNodeChild;
}

export type TreeViewRootSlots = TreeViewSlots;
export type TreeViewRootProviderSlots = TreeViewSlots;
export type TreeViewLabelProps = ArkTreeViewLabelProps;
export type TreeViewTreeProps = ArkTreeViewTreeProps;
export type TreeViewNodeProviderProps<T extends TreeNode = TreeNode> =
  ArkTreeViewNodeProviderProps<T>;
export type TreeViewBranchProps = ArkTreeViewBranchProps;
export type TreeViewBranchControlProps = ArkTreeViewBranchControlProps;
export type TreeViewBranchTriggerProps = ArkTreeViewBranchTriggerProps;
export type TreeViewBranchIndicatorProps = ArkTreeViewBranchIndicatorProps;
export type TreeViewBranchTextProps = ArkTreeViewBranchTextProps;
export type TreeViewBranchContentProps = ArkTreeViewBranchContentProps;
export type TreeViewBranchIndentGuideProps = ArkTreeViewBranchIndentGuideProps;
export type TreeViewItemProps = ArkTreeViewItemProps;
export type TreeViewItemIndicatorProps = ArkTreeViewItemIndicatorProps;
export type TreeViewItemTextProps = ArkTreeViewItemTextProps;
export type TreeViewNodeCheckboxProps = ArkTreeViewNodeCheckboxProps;
export type TreeViewNodeCheckboxIndicatorProps = ArkTreeViewNodeCheckboxIndicatorProps;
export type TreeViewNodeRenameInputProps = ArkTreeViewNodeRenameInputProps;
export type TreeViewContextProps<T extends TreeNode = TreeNode> = ArkTreeViewContextProps<T>;
export type TreeViewNodeContextProps = ArkTreeViewNodeContextProps;

export interface TreeViewContextSlots<T extends TreeNode = TreeNode> {
  default?: (context: TreeViewContextValue<T>) => VNodeChild;
}

export interface TreeViewNodeContextSlots<T extends TreeNode = TreeNode> {
  default?: (context: TreeViewNodeContextValue<T>) => VNodeChild;
}

export type {
  TreeNode,
  TreeViewCheckedChangeDetails,
  TreeViewExpandedChangeDetails,
  TreeViewFocusChangeDetails,
  TreeViewLoadChildrenCompleteDetails,
  TreeViewLoadChildrenErrorDetails,
  TreeViewRenameCompleteDetails,
  TreeViewRenameStartDetails,
  TreeViewSelectionChangeDetails,
  UseTreeViewContext,
  UseTreeViewNodeContext,
  UseTreeViewReturn,
};
