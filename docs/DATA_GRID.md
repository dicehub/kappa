---
read_when:
  - Changing Data Grid behavior, performance, public state, columns, or dependencies
---

# Data Grid

## Scope

Data Grid is the reusable interactive table for Kappa consumers. Use it where
grouping, pivoting, aggregation, and spreadsheet range editing are not required.

Use the native `Table` component for static semantic tables. Use Data Grid for
sorting, filtering, paging, selection, resizing, pinned columns, rich cells, or
large flat data sets.

## Architecture

- Kappa owns all public props, events, columns, slots, and state types.
- TanStack Table is a private row-model and column-state engine.
- TanStack Virtual is a private fixed-row windowing engine.
- Standard mode keeps native table flow and supports natural row height.
- Virtual mode uses fixed row height, absolute rows, and a bounded viewport.
- Virtual scrolling shows transient visual feedback anchored to the viewport.
- Client and manual modes use the same one-based Kappa state contract.
- Consumers replace the rows array when data changes. Changing a field or one
  array element in place is outside the contract because the row engine caches
  accessor values.

The public API must not export TanStack types. This boundary permits an engine
upgrade or replacement without an application migration.

## Performance contract

The initial target is 100,000 flat rows and about 20 simple columns. Virtual
mode must keep the rendered row count bounded by the visible range plus
overscan. Scrolling must not rebuild the source data or column definitions.

Run the repeatable CPU benchmark with:

```bash
pnpm --filter @dicehub/kappa benchmark:data-grid
```

Use the focused browser test for DOM bounds, scrolling, focus, and interaction.
Do not use variable-height rows in virtual mode.

## Deferred features

The first release does not include grouping, aggregation, pivoting, export,
clipboard ranges, row drag, tree data, variable-height virtualization, column
virtualization, or a built-in editing engine. Application-owned inputs can be
placed in named cell slots.
