import GridRoot from "./Grid.vue";
import GridItem from "./GridItem.vue";

export const Grid = Object.assign(GridRoot, {
  Root: GridRoot,
  Item: GridItem,
});

export { GridItem, GridRoot };

export {
  GRID_DEFAULT_GAP,
  GRID_GAPS,
  GRID_ITEM_DEFAULT_ELEMENT,
  GRID_ITEM_ELEMENTS,
  GRID_ROOT_DEFAULT_ELEMENT,
  GRID_ROOT_ELEMENTS,
  GRID_VARIANTS,
  isGridGap,
  isGridItemElement,
  isGridRootElement,
  isGridVariant,
  resolveGridGap,
  resolveGridItemElement,
  resolveGridRootElement,
  resolveGridVariant,
  type GridGap,
  type GridItemElement,
  type GridItemProps,
  type GridItemSlots,
  type GridProps,
  type GridRootElement,
  type GridRootProps,
  type GridRootSlots,
  type GridSlots,
  type GridVariant,
} from "./grid";
