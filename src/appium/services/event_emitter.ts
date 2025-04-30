import { stat } from "fs"

export interface EventEmitter {
     log(message: string) : void
     error(message: string) : void
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

    log(message: string): void {
        this.emit({type: "log", content: message})
    }

    error(message: string): void {
        this.emit({type: "error", content: message})
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


    emit(message: object) {
        process.stdout.write(JSON.stringify(message) + "\\n");
    }
}

