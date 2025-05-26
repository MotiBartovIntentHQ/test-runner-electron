import { stat } from "fs"
import { formatMessage } from "./utils"

export interface EventEmitter {
    formattedLog(message: string): void
     log(message: string) : void
     error(message: string) : void
     formattedError(message: string) : void
     testResult(status: string): void
     start() : void
     testStart(index: number) : void
     testStop(index: number, status: string) : void 
}

export class EventEmitterImpl implements EventEmitter {
    private static instance: EventEmitter;

    private constructor() {}

    public static getInstance(): EventEmitter {
        if (!EventEmitterImpl.instance) {
            EventEmitterImpl.instance = new EventEmitterImpl();
        }
        return EventEmitterImpl.instance;
    }

    formattedLog(message: string) : void {
        this.log(formatMessage(message))
    }

    log(message: string): void {
        this.emit({type: "log", content: message})
    }

    error(message: string): void {
        this.emit({type: "error", content: message})
    }

    formattedError(message: string): void {
        this.error(formatMessage(message))
    }

    start(): void {
        this.emit({type: "start"})
    }

    testStart(index: number): void {
        this.emit({type: "test-start", index: index})
    }
    testStop(index: number, status: string): void {
        this.emit({type: "test-stop", index: index, status: status})
    }


    testResult(status: string): void {
        this.emit({type: 'test-result', status: status})    ;
    }

    emit(message: object) {
        process.stdout.write(`${JSON.stringify(message)}\\n`);
    }
}

