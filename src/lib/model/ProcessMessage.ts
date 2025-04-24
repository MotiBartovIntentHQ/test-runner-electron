import {MessageType} from "./MessageType.js"

export type Message =
  | { type: MessageType.Start; index: number }
  | { type: MessageType.Log; content: string }
  | { type: MessageType.TaskStart;  index: number }
  | { type: MessageType.TaskComplete; index: number, status: string}
  | { type: MessageType.Done }
  | { type: MessageType.Error; error: string }
  | { type: MessageType.Exit, code: number };