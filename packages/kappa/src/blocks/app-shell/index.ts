import AppShellRoot from "./AppShell.vue";
import AppShellPanels from "./AppShellPanels.vue";
import AppShellPage from "./AppShellPage.vue";
import AppShellToolbar from "./AppShellToolbar.vue";
import AppShellActions from "./AppShellActions.vue";
import AppShellSearchTrigger from "./AppShellSearchTrigger.vue";
import AppShellSearchDialog from "./AppShellSearchDialog.vue";
export const AppShell = Object.assign(AppShellRoot, {
  Root: AppShellRoot, SearchDialog: AppShellSearchDialog, Panels: AppShellPanels, Page: AppShellPage,
  Toolbar: AppShellToolbar, Actions: AppShellActions, SearchTrigger: AppShellSearchTrigger,
});
export { AppShellSearchDialog, AppShellRoot, AppShellPanels, AppShellPage, AppShellToolbar, AppShellActions, AppShellSearchTrigger };
export { APP_SHELL_APPEARANCES } from "./app-shell";
export type { AppShellAppearance, AppShellProps, AppShellSlots, AppShellPanelsProps, AppShellPanelsEmits, AppShellPanelsSlots, AppShellPageProps, AppShellSearchTriggerProps } from "./app-shell";
