import LinkRoot from "./Link.vue";
import LinkExternalIcon from "./LinkExternalIcon.vue";

export const Link = Object.assign(LinkRoot, {
  ExternalIcon: LinkExternalIcon,
});

export { LinkExternalIcon, LinkRoot };

export {
  LINK_DEFAULT_VARIANT,
  LINK_VARIANTS,
  isLinkVariant,
  resolveLinkRel,
  resolveLinkTarget,
  resolveLinkVariant,
  type LinkProps,
  type LinkSlots,
  type LinkVariant,
} from "./link";
