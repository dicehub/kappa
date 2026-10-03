import PropertyListRoot from "./PropertyList.vue";
import PropertyListItem from "./PropertyListItem.vue";
import PropertyListTerm from "./PropertyListTerm.vue";
import PropertyListValue from "./PropertyListValue.vue";

export const PropertyList = Object.assign(PropertyListRoot, {
  Root: PropertyListRoot,
  Item: PropertyListItem,
  Term: PropertyListTerm,
  Value: PropertyListValue,
});
export { PropertyListRoot, PropertyListItem, PropertyListTerm, PropertyListValue };
export * from "./property-list";
