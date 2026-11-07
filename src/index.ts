import { eventCreator } from "./features/eventCreator/index";
import { defineEvents, field } from "./features/eventSchema/index";
import { eventActions as defaultEventActions } from "./utils/constants/eventActions";
import { eventElements as defaultEventElements } from "./utils/constants/eventElements";

export {
  eventCreator,
  defineEvents,
  field,
  defaultEventActions,
  defaultEventElements,
};

export type { AnalyticsEvent } from "./types/event/AnalyticsEvent";
export type { DefaultEventAction } from "./types/event/EventAction";
export type {
  EventCreatorOptions,
  EventCreatorParams,
  LabelOptions,
  SchemaEventCreatorOptions,
  SchemaEventCreatorParams,
  StringCase,
  StringFormat,
} from "./types/event/EventCreatorParams";
export type { DefaultEventElement } from "./types/event/EventElement";
export type { ActionHandler, EventHandler } from "./types/event/EventHandlers";
export type { EventMetadata } from "./types/event/EventMetadata";
export type {
  EventFields,
  EventSchema,
  Field,
  FieldKind,
  SchemaActionHandler,
  SchemaEventHandler,
  SchemaMetadata,
} from "./types/event/EventSchema";
export type { InvalidEventIssue } from "./types/event/InvalidEventIssue";
