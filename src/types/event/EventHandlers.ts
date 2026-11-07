import { DefaultEventAction } from "./EventAction";
import { DefaultEventElement } from "./EventElement";
import { EventMetadata } from "./EventMetadata";

export type ActionHandler = (eventMetadata?: EventMetadata) => void;

export type EventHandler<
  Element extends string = DefaultEventElement,
  Action extends string = DefaultEventAction,
> = {
  [element in Element]: {
    [action in Action]: ActionHandler;
  };
};
