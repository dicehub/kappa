import RatingRoot from "./Rating.vue";
import RatingContext from "./RatingContext.vue";
import RatingControl from "./RatingControl.vue";
import RatingItem from "./RatingItem.vue";
import RatingItemContext from "./RatingItemContext.vue";
import RatingLabel from "./RatingLabel.vue";
import RatingRootProvider from "./RatingRootProvider.vue";

export const Rating = Object.assign(RatingRoot, {
  Root: RatingRoot,
  RootProvider: RatingRootProvider,
  Label: RatingLabel,
  Control: RatingControl,
  Item: RatingItem,
  Context: RatingContext,
  ItemContext: RatingItemContext,
});

export {
  RatingContext,
  RatingControl,
  RatingItem,
  RatingItemContext,
  RatingLabel,
  RatingRoot,
  RatingRootProvider,
};

export type {
  RatingApi,
  RatingContextSlots,
  RatingContextValue,
  RatingControlProps,
  RatingControlSlots,
  RatingDirection,
  RatingEmits,
  RatingHoverChangeDetails,
  RatingItemContextSlots,
  RatingItemContextValue,
  RatingItemProps,
  RatingItemSlots,
  RatingLabelProps,
  RatingLabelSlots,
  RatingProps,
  RatingRootProps,
  RatingRootProviderProps,
  RatingRootProviderSlots,
  RatingRootSlots,
  RatingSize,
  RatingSlots,
  RatingValueChangeDetails,
  UseRatingContext,
  UseRatingItemContext,
  UseRatingReturn,
} from "./rating";

export {
  RATING_DEFAULT_SIZE,
  RATING_SIZES,
  isRatingSize,
  resolveRatingSize,
} from "./rating";

export {
  ratingGroupAnatomy as ratingAnatomy,
  useRatingGroup as useRating,
  useRatingGroupContext as useRatingContext,
  useRatingGroupItemContext as useRatingItemContext,
  type UseRatingGroupProps as UseRatingProps,
} from "@ark-ui/vue/rating-group";
