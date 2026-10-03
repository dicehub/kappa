import CardRoot from "./Card.vue";
import CardAction from "./CardAction.vue";
import CardContent from "./CardContent.vue";
import CardDescription from "./CardDescription.vue";
import CardFooter from "./CardFooter.vue";
import CardHeader from "./CardHeader.vue";
import CardPrimary from "./CardPrimary.vue";
import CardSecondary from "./CardSecondary.vue";
import CardTitle from "./CardTitle.vue";

export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Content: CardContent,
  Footer: CardFooter,
  Primary: CardPrimary,
  Secondary: CardSecondary,
});

export {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPrimary,
  CardRoot,
  CardSecondary,
  CardTitle,
};

export * from "./card";
