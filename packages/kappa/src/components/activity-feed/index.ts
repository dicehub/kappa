import ActivityFeedRoot from "./ActivityFeed.vue";
import ActivityFeedActions from "./ActivityFeedActions.vue";
import ActivityFeedContent from "./ActivityFeedContent.vue";
import ActivityFeedDescription from "./ActivityFeedDescription.vue";
import ActivityFeedGroup from "./ActivityFeedGroup.vue";
import ActivityFeedGroupLabel from "./ActivityFeedGroupLabel.vue";
import ActivityFeedHeader from "./ActivityFeedHeader.vue";
import ActivityFeedItem from "./ActivityFeedItem.vue";
import ActivityFeedList from "./ActivityFeedList.vue";
import ActivityFeedMarker from "./ActivityFeedMarker.vue";
import ActivityFeedTime from "./ActivityFeedTime.vue";
import ActivityFeedTitle from "./ActivityFeedTitle.vue";

export const ActivityFeed = Object.assign(ActivityFeedRoot, {
  Root: ActivityFeedRoot,
  Group: ActivityFeedGroup,
  GroupLabel: ActivityFeedGroupLabel,
  List: ActivityFeedList,
  Item: ActivityFeedItem,
  Marker: ActivityFeedMarker,
  Content: ActivityFeedContent,
  Header: ActivityFeedHeader,
  Title: ActivityFeedTitle,
  Description: ActivityFeedDescription,
  Time: ActivityFeedTime,
  Actions: ActivityFeedActions,
});

export {
  ActivityFeedActions,
  ActivityFeedContent,
  ActivityFeedDescription,
  ActivityFeedGroup,
  ActivityFeedGroupLabel,
  ActivityFeedHeader,
  ActivityFeedItem,
  ActivityFeedList,
  ActivityFeedMarker,
  ActivityFeedRoot,
  ActivityFeedTime,
  ActivityFeedTitle,
};

export * from "./activity-feed";
