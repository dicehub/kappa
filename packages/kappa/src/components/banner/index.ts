import BannerAction from "./BannerAction.vue";
import BannerRoot from "./Banner.vue";

export const Banner = Object.assign(BannerRoot, {
  Action: BannerAction,
});

export { BannerAction, BannerRoot };
export {
  BANNER_ACTION_DEFAULT_SIZE,
  BANNER_ACTION_DEFAULT_TYPE,
  BANNER_ACTION_DEFAULT_VARIANT,
  BANNER_ACTION_SIZE_BY_BANNER,
  BANNER_ACTION_TYPES,
  BANNER_ACTION_VARIANTS,
  BANNER_DEFAULT_SIZE,
  BANNER_DEFAULT_VARIANT,
  BANNER_SIZES,
  BANNER_VARIANTS,
  isBannerActionType,
  isBannerActionVariant,
  isBannerSize,
  isBannerVariant,
  resolveBannerActionType,
  resolveBannerActionVariant,
  resolveBannerSize,
  resolveBannerVariant,
  type BannerActionProps,
  type BannerActionSize,
  type BannerActionSlots,
  type BannerActionType,
  type BannerActionVariant,
  type BannerProps,
  type BannerSize,
  type BannerSlots,
  type BannerVariant,
} from "./banner";
