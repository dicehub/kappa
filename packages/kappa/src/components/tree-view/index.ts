import TreeViewRoot from "./TreeView.vue";
import TreeViewBranch from "./TreeViewBranch.vue";
import TreeViewBranchContent from "./TreeViewBranchContent.vue";
import TreeViewBranchControl from "./TreeViewBranchControl.vue";
import TreeViewBranchIndentGuide from "./TreeViewBranchIndentGuide.vue";
import TreeViewBranchIndicator from "./TreeViewBranchIndicator.vue";
import TreeViewBranchText from "./TreeViewBranchText.vue";
import TreeViewBranchTrigger from "./TreeViewBranchTrigger.vue";
import TreeViewContext from "./TreeViewContext.vue";
import TreeViewItem from "./TreeViewItem.vue";
import TreeViewItemIndicator from "./TreeViewItemIndicator.vue";
import TreeViewItemText from "./TreeViewItemText.vue";
import TreeViewLabel from "./TreeViewLabel.vue";
import TreeViewNodeCheckbox from "./TreeViewNodeCheckbox.vue";
import TreeViewNodeCheckboxIndicator from "./TreeViewNodeCheckboxIndicator.vue";
import TreeViewNodeContext from "./TreeViewNodeContext.vue";
import TreeViewNodeProvider from "./TreeViewNodeProvider.vue";
import TreeViewNodeRenameInput from "./TreeViewNodeRenameInput.vue";
import TreeViewRootProvider from "./TreeViewRootProvider.vue";
import TreeViewTree from "./TreeViewTree.vue";

export const TreeView = Object.assign(TreeViewRoot, {
  Root: TreeViewRoot,
  RootProvider: TreeViewRootProvider,
  Label: TreeViewLabel,
  Tree: TreeViewTree,
  NodeProvider: TreeViewNodeProvider,
  Branch: TreeViewBranch,
  BranchControl: TreeViewBranchControl,
  BranchTrigger: TreeViewBranchTrigger,
  BranchIndicator: TreeViewBranchIndicator,
  BranchText: TreeViewBranchText,
  BranchContent: TreeViewBranchContent,
  BranchIndentGuide: TreeViewBranchIndentGuide,
  Item: TreeViewItem,
  ItemIndicator: TreeViewItemIndicator,
  ItemText: TreeViewItemText,
  NodeCheckbox: TreeViewNodeCheckbox,
  NodeCheckboxIndicator: TreeViewNodeCheckboxIndicator,
  NodeRenameInput: TreeViewNodeRenameInput,
  Context: TreeViewContext,
  NodeContext: TreeViewNodeContext,
});

export {
  TreeViewBranch,
  TreeViewBranchContent,
  TreeViewBranchControl,
  TreeViewBranchIndentGuide,
  TreeViewBranchIndicator,
  TreeViewBranchText,
  TreeViewBranchTrigger,
  TreeViewContext,
  TreeViewItem,
  TreeViewItemIndicator,
  TreeViewItemText,
  TreeViewLabel,
  TreeViewNodeCheckbox,
  TreeViewNodeCheckboxIndicator,
  TreeViewNodeContext,
  TreeViewNodeProvider,
  TreeViewNodeRenameInput,
  TreeViewRoot,
  TreeViewRootProvider,
  TreeViewTree,
};

export * from "./tree-view";

export {
  createFileTreeCollection,
  createTreeCollection,
  treeViewAnatomy,
  useTreeView,
  useTreeViewContext,
  useTreeViewNodeContext,
} from "@ark-ui/vue/tree-view";
