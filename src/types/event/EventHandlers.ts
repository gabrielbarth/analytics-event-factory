import { eventActions } from "../../utils/constants/eventActions";
import { eventElements } from "../../utils/constants/eventElements";
import { EventMetadata } from "./EventMetadata";

type Element = (typeof eventElements)[number];
type Action = (typeof eventActions)[number];
type ActionHandler = (eventMetadata: EventMetadata) => void;

export type EventHandler = {
  [key in Element]: {
    [action in Action]?: ActionHandler;
  };
};
