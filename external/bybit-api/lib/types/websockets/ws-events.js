"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMessageEvent = isMessageEvent;
function isMessageEvent(msg) {
    if (typeof msg !== 'object' || !msg) {
        return false;
    }
    const message = msg;
    return message['type'] === 'message' && typeof message['data'] === 'string';
}
//# sourceMappingURL=ws-events.js.map