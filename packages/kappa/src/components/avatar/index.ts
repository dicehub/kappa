import AvatarRoot from "./Avatar.vue";
import AvatarBadge from "./AvatarBadge.vue";
import AvatarFallback from "./AvatarFallback.vue";
import AvatarGroup from "./AvatarGroup.vue";
import AvatarGroupCount from "./AvatarGroupCount.vue";
import AvatarImage from "./AvatarImage.vue";

export const Avatar = Object.assign(AvatarRoot, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Badge: AvatarBadge,
  Group: AvatarGroup,
  GroupCount: AvatarGroupCount,
});

export {
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  AvatarRoot,
};

export {
  AVATAR_DEFAULT_SIZE,
  AVATAR_SIZES,
  isAvatarSize,
  resolveAvatarSize,
  type AvatarBadgeProps,
  type AvatarBadgeSlots,
  type AvatarDirection,
  type AvatarEmits,
  type AvatarFallbackProps,
  type AvatarFallbackSlots,
  type AvatarGroupCountProps,
  type AvatarGroupCountSlots,
  type AvatarGroupProps,
  type AvatarGroupSlots,
  type AvatarImageProps,
  type AvatarImageSlots,
  type AvatarProps,
  type AvatarRootProps,
  type AvatarRootSlots,
  type AvatarSize,
  type AvatarSlots,
  type AvatarStatusChangeDetails,
} from "./avatar";
