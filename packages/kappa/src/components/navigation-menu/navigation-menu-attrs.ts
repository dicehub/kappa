/** Keep untyped attributes from enabling unsupported render strategies. */
export function getNavigationMenuAttrs(attrs: Record<string, unknown>) {
  const {
    lazyMount,
    unmountOnExit,
    "lazy-mount": lazyMountAttribute,
    "unmount-on-exit": unmountOnExitAttribute,
    ...rest
  } = attrs;
  return rest;
}
