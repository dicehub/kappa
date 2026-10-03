import LayerCardRoot from "./LayerCard.vue";
import LayerCardPrimary from "./LayerCardPrimary.vue";
import LayerCardSecondary from "./LayerCardSecondary.vue";

export const LayerCard = Object.assign(LayerCardRoot, {
  Root: LayerCardRoot,
  Primary: LayerCardPrimary,
  Secondary: LayerCardSecondary,
});

export { LayerCardPrimary, LayerCardRoot, LayerCardSecondary };

export * from "./layer-card";
