// lib/eventBus.ts
import { EventEmitter } from "events";

class EventBus extends EventEmitter {}
const eventBus = new EventBus();

eventBus.setMaxListeners(50);

export default eventBus;