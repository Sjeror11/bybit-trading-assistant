"use strict";
/**
 * Use type guards to narrow down types with minimal efforts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWsEventV5 = isWsEventV5;
exports.isWsOrderbookEventV5 = isWsOrderbookEventV5;
exports.isWsPositionEventV5 = isWsPositionEventV5;
exports.isWsAccountOrderEventV5 = isWsAccountOrderEventV5;
exports.isWsExecutionEventV5 = isWsExecutionEventV5;
exports.neverGuard = neverGuard;
exports.isWSAPIResponse = isWSAPIResponse;
exports.isTopicSubscriptionSuccess = isTopicSubscriptionSuccess;
exports.isTopicSubscriptionConfirmation = isTopicSubscriptionConfirmation;
exports.isWsAllLiquidationEvent = isWsAllLiquidationEvent;
const ws_api_1 = require("../types/websockets/ws-api");
function isWsEventV5(event) {
    if (typeof event !== 'object' ||
        !event ||
        typeof event['topic'] !== 'string' ||
        typeof event['type'] !== 'string') {
        return false;
    }
    return true;
}
/**
 * Type guard to detect a V5 orderbook event (delta & snapshots)
 *
 * @param event
 * @returns
 */
function isWsOrderbookEventV5(event) {
    if (typeof event !== 'object' ||
        !event ||
        typeof event['topic'] !== 'string' ||
        typeof event['type'] !== 'string') {
        return false;
    }
    return (['delta', 'snapshot'].includes(event['type']) &&
        event['topic'].startsWith('orderbook'));
}
/**
 * Type guard to detect a V5 position event.
 *
 * @param event
 * @returns
 */
function isWsPositionEventV5(event) {
    if (typeof event !== 'object' ||
        !event ||
        typeof event['topic'] !== 'string') {
        return false;
    }
    return event['topic'] === 'position';
}
/**
 * Type guard to detect a V5 order event.
 *
 * @param event
 * @returns
 */
function isWsAccountOrderEventV5(event) {
    if (typeof event !== 'object' ||
        !event ||
        typeof event['topic'] !== 'string') {
        return false;
    }
    return event['topic'] === 'order';
}
/**
 * Type guard to detect a V5 execution event.
 *
 * @param event
 * @returns
 */
function isWsExecutionEventV5(event) {
    if (typeof event !== 'object' ||
        !event ||
        typeof event['topic'] !== 'string') {
        return false;
    }
    return event['topic'] === 'execution';
}
function neverGuard(x, msg) {
    return new Error(`Unhandled value exception "${x}", ${msg}`);
}
function isWSAPIResponse(msg) {
    if (typeof msg !== 'object' || !msg) {
        return false;
    }
    if (typeof msg['op'] !== 'string') {
        return false;
    }
    return ws_api_1.WS_API_Operations.includes(msg['op']);
}
function isTopicSubscriptionSuccess(msg) {
    if (!isTopicSubscriptionConfirmation(msg))
        return false;
    return msg.success === true;
}
function isTopicSubscriptionConfirmation(msg) {
    if (typeof msg !== 'object') {
        return false;
    }
    if (!msg) {
        return false;
    }
    if (typeof msg['op'] !== 'string') {
        return false;
    }
    if (msg['op'] !== 'subscribe') {
        return false;
    }
    return true;
}
function isWsAllLiquidationEvent(event) {
    if (!isWsEventV5(event)) {
        return false;
    }
    if (event['topic'].startsWith('allLiquidation')) {
        return true;
    }
    return false;
}
//# sourceMappingURL=typeGuards.js.map