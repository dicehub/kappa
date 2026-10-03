import TableRoot from "./Table.vue";
import TableBody from "./TableBody.vue";
import TableCaption from "./TableCaption.vue";
import TableCell from "./TableCell.vue";
import TableCheckCell from "./TableCheckCell.vue";
import TableCheckHead from "./TableCheckHead.vue";
import TableFooter from "./TableFooter.vue";
import TableHead from "./TableHead.vue";
import TableHeader from "./TableHeader.vue";
import TableResizeHandle from "./TableResizeHandle.vue";
import TableRow from "./TableRow.vue";

export const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Caption: TableCaption,
  Header: TableHeader,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Footer: TableFooter,
  CheckHead: TableCheckHead,
  CheckCell: TableCheckCell,
  ResizeHandle: TableResizeHandle,
});

export {
  TableRoot,
  TableBody,
  TableCaption,
  TableCell,
  TableCheckCell,
  TableCheckHead,
  TableFooter,
  TableHead,
  TableHeader,
  TableResizeHandle,
  TableRow,
};

export type {
  TableBodyProps,
  TableBodySlots,
  TableCaptionProps,
  TableCaptionSlots,
  TableCellProps,
  TableCellSlots,
  TableCheckCellProps,
  TableCheckCellSlots,
  TableCheckHeadProps,
  TableCheckHeadSlots,
  TableFooterProps,
  TableFooterSlots,
  TableHeadProps,
  TableHeadSlots,
  TableHeaderProps,
  TableHeaderSlots,
  TablePartSlots,
  TableProps,
  TableResizeHandleProps,
  TableResizeHandleSlots,
  TableRootProps,
  TableRootSlots,
  TableRowProps,
  TableRowSlots,
  TableSlots,
  TableCheckboxChangeDetails,
  TableCheckboxEmits,
  TableHeaderVariant,
  TableLayout,
  TableRowVariant,
  TableStickyColumn,
} from "./table";

export {
  TABLE_DEFAULT_HEADER_VARIANT,
  TABLE_DEFAULT_VARIANTS,
  TABLE_HEADER_VARIANTS,
  TABLE_LAYOUTS,
  TABLE_ROW_VARIANTS,
  TABLE_STICKY_COLUMNS,
  TABLE_VARIANTS,
  isTableHeaderVariant,
  isTableLayout,
  isTableRowVariant,
  isTableStickyColumn,
  resolveTableHeaderVariant,
  resolveTableLayout,
  resolveTableRowVariant,
  resolveTableStickyColumn,
} from "./table";

export type TableRootComponentProps = InstanceType<typeof TableRoot>["$props"];
export type TableBodyComponentProps = InstanceType<typeof TableBody>["$props"];
export type TableCaptionComponentProps = InstanceType<typeof TableCaption>["$props"];
export type TableCellComponentProps = InstanceType<typeof TableCell>["$props"];
export type TableCheckCellComponentProps = InstanceType<typeof TableCheckCell>["$props"];
export type TableCheckHeadComponentProps = InstanceType<typeof TableCheckHead>["$props"];
export type TableFooterComponentProps = InstanceType<typeof TableFooter>["$props"];
export type TableHeadComponentProps = InstanceType<typeof TableHead>["$props"];
export type TableHeaderComponentProps = InstanceType<typeof TableHeader>["$props"];
export type TableResizeHandleComponentProps = InstanceType<typeof TableResizeHandle>["$props"];
export type TableRowComponentProps = InstanceType<typeof TableRow>["$props"];
