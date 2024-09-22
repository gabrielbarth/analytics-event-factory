import { EventAction } from "../../types/event/EventAction";

export const eventActions = [
  EventAction.View,
  EventAction.Click,
  EventAction.Navigate,
  EventAction.PullToRefresh,
] as const;
