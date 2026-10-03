import { inject, provide, type ComputedRef, type InjectionKey } from "vue";
import type { BannerActionSize } from "./banner";

export type BannerContext = {
  actionSize: ComputedRef<BannerActionSize>;
};

const bannerContextKey: InjectionKey<BannerContext> = Symbol("kappa-banner-context");

export const provideBannerContext = (context: BannerContext) => {
  provide(bannerContextKey, context);
};

export const useBannerContext = () => inject(bannerContextKey, null);
