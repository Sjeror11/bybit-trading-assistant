"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLogger = void 0;
exports.DefaultLogger = {
    /** Ping/pong events and other raw messages that might be noisy. Enable this while troubleshooting. */
    trace: (..._params) => {
        // console.log(_params);
    },
    info: (...params) => {
        console.info(params);
    },
    error: (...params) => {
        console.error(params);
    },
};
//# sourceMappingURL=logger.js.map