/**
 * Use type guards to narrow down types with minimal efforts.
 */
import { WebsocketSucceededTopicSubscriptionConfirmationEvent, WebsocketTopicSubscriptionConfirmationEvent } from '../types';
import { WSAPIResponse } from '../types/websockets/ws-api';
import { WSAccountOrderEventV5, WSExecutionEventV5, WSOrderbookEventV5, WSPositionEventV5 } from '../types/websockets/ws-events';
export interface BybitEventV5<TData = unknown> {
    topic: string;
    type: string;
    ts: number;
    data: TData;
    wsKey: string;
}
export declare function isWsEventV5<TEventData = unknown>(event: unknown): event is BybitEventV5<TEventData>;
/**
 * Type guard to detect a V5 orderbook event (delta & snapshots)
 *
 * @param event
 * @returns
 */
export declare function isWsOrderbookEventV5(event: unknown): event is WSOrderbookEventV5;
/**
 * Type guard to detect a V5 position event.
 *
 * @param event
 * @returns
 */
export declare function isWsPositionEventV5(event: unknown): event is WSPositionEventV5;
/**
 * Type guard to detect a V5 order event.
 *
 * @param event
 * @returns
 */
export declare function isWsAccountOrderEventV5(event: unknown): event is WSAccountOrderEventV5;
/**
 * Type guard to detect a V5 execution event.
 *
 * @param event
 * @returns
 */
export declare function isWsExecutionEventV5(event: unknown): event is WSExecutionEventV5;
export declare function neverGuard(x: never, msg: string): Error;
export declare function isWSAPIResponse(msg: unknown): msg is Omit<WSAPIResponse, 'wsKey'>;
export declare function isTopicSubscriptionSuccess(msg: unknown): msg is WebsocketSucceededTopicSubscriptionConfirmationEvent;
export declare function isTopicSubscriptionConfirmation(msg: unknown): msg is WebsocketTopicSubscriptionConfirmationEvent;
export declare function isWsAllLiquidationEvent(event: unknown): event is BybitEventV5<any[]>;
