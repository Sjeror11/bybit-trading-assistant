export type LogParams = null | any;
export declare const DefaultLogger: {
    /** Ping/pong events and other raw messages that might be noisy. Enable this while troubleshooting. */
    trace: (..._params: LogParams) => void;
    info: (...params: LogParams) => void;
    error: (...params: LogParams) => void;
};
