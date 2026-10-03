import { inject, type ComputedRef, type InjectionKey } from "vue";

interface SlidingContext { activeKey: ComputedRef<string>; direction: ComputedRef<"left" | "right"> }
export const sidebarSlidingKey: InjectionKey<SlidingContext> = Symbol("KappaSidebarSlidingViews");
export function useSidebarSlidingContext() {
  const context = inject(sidebarSlidingKey);
  if (!context) throw new Error("[Kappa Sidebar] SlidingView must be inside Sidebar.SlidingViews.");
  return context;
}
