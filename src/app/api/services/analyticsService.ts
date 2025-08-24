// services/analyticsService.ts
import eventBus from "../lib/eventBus";
import { AnalyticsEvent } from "../types/event";

const events: AnalyticsEvent[] = []; // You can replace with DB later

export const emitAnalyticsEvent = (event: AnalyticsEvent) => {
  events.unshift(event); // add to history
  if (events.length > 50) events.pop(); // keep last 50 only
  eventBus.emit("analytics_event", event);
};

export const getRecentAnalyticsEvents = () => {
  return events;
};
