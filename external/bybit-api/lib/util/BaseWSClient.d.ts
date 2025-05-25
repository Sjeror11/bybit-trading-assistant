import EventEmitter from 'events';
import WebSocket from 'isomorphic-ws';
import { DefaultLogger } from './logger';
import { MessageEventLike, WSClientConfigurableOptions, WebsocketClientOptions, WsMarket } from '../types';
import { WsStore } from './websockets/WsStore';
import { WSConnectedResult, WsTopicRequest, WsTopicRequestOrStringTopic } from './websockets';
import { WsOperation } from '../types/websockets/ws-api';
type UseTheExceptionEventInstead = never;
interface WSClientEventMap<WsKey extends string> {
    /** Connection opened. If this connection was previously opened and reconnected, expect the reconnected event instead */
    open: (evt: {
        wsKey: WsKey;
        event: any;
    }) => void;
    /** Reconnecting a dropped connection */
    reconnect: (evt: {
        wsKey: WsKey;
        event: any;
    }) => void;
    /** Successfully reconnected a connection that dropped */
    reconnected: (evt: {
        wsKey: WsKey;
        event: any;
    }) => void;
    /** Connection closed */
    close: (evt: {
        wsKey: WsKey;
        event: any;
    }) => void;
    /** Received reply to websocket command (e.g. after subscribing to topics) */
    response: (response: any & {
        wsKey: WsKey;
        isWSAPIResponse?: boolean;
    }) => void;
    /** Received data for topic */
    update: (response: any & {
        wsKey: WsKey;
    }) => void;
    /**
     * See for more information: https://github.com/tiagosiebler/bybit-api/issues/413
     * @deprecated Use the 'exception' event instead. The 'error' event had the unintended consequence of throwing an unhandled promise rejection.
     */
    error: UseTheExceptionEventInstead;
    /**
     * Exception from ws client OR custom listeners (e.g. if you throw inside your event handler)
     */
    exception: (response: any & {
        wsKey: WsKey;
        isWSAPIResponse?: boolean;
    }) => void;
    /** Confirmation that a connection successfully authenticated */
    authenticated: (event: {
        wsKey: WsKey;
        event: any;
        isWSAPIResponse?: boolean;
    }) => void;
}
export interface BaseWebsocketClient<TWSKey extends string, TWSRequestEvent extends object> {
    on<U extends keyof WSClientEventMap<TWSKey>>(event: U, listener: WSClientEventMap<TWSKey>[U]): this;
    emit<U extends keyof WSClientEventMap<TWSKey>>(event: U, ...args: Parameters<WSClientEventMap<TWSKey>[U]>): boolean;
}
export interface EmittableEvent<TEvent = any> {
    eventType: 'response' | 'update' | 'exception' | 'authenticated';
    event: TEvent;
    isWSAPIResponse?: boolean;
}
/**
 * A midflight WS request event (e.g. subscribe to these topics).
 *
 * - requestKey: unique identifier for this request, if available. Can be anything as a string.
 * - requestEvent: the raw request, as an object, that will be sent on the ws connection. This may contain multiple topics/requests in one object, if the exchange supports it.
 */
export interface MidflightWsRequestEvent<TEvent = object> {
    requestKey: string;
    requestEvent: TEvent;
}
/**
 * Base WebSocket abstraction layer. Handles connections, tracking each connection as a unique "WS Key"
 */
export declare abstract class BaseWebsocketClient<
/**
 * The WS connections supported by the client, each identified by a unique primary key
 */
TWSKey extends string, TWSRequestEvent extends object> extends EventEmitter {
    /**
     * State store to track a list of topics (topic requests) we are expected to be subscribed to if reconnected
     */
    private wsStore;
    protected logger: typeof DefaultLogger;
    protected options: WebsocketClientOptions;
    private wsApiRequestId;
    private timeOffsetMs;
    /**
     * A nested wsKey->request key store.
     * pendingTopicSubscriptionRequests[wsKey][requestKey] = WsKeyPendingTopicSubscriptions<TWSRequestEvent>
     */
    private pendingTopicSubscriptionRequests;
    constructor(options?: WSClientConfigurableOptions, logger?: typeof DefaultLogger);
    /**
     * Return true if this wsKey connection should automatically authenticate immediately after connecting
     */
    protected abstract isAuthOnConnectWsKey(wsKey: TWSKey): boolean;
    protected abstract sendPingEvent(wsKey: TWSKey, ws: WebSocket): void;
    protected abstract sendPongEvent(wsKey: TWSKey, ws: WebSocket): void;
    protected abstract isWsPing(data: any): boolean;
    protected abstract isWsPong(data: any): boolean;
    protected abstract getWsAuthRequestEvent(wsKey: TWSKey): Promise<object>;
    protected abstract isPrivateTopicRequest(request: WsTopicRequest<string>, wsKey: TWSKey): boolean;
    protected abstract getPrivateWSKeys(): TWSKey[];
    protected abstract getWsUrl(wsKey: TWSKey): Promise<string>;
    protected abstract getMaxTopicsPerSubscribeEvent(wsKey: TWSKey): number | null;
    /**
     * @returns one or more correctly structured request events for performing a operations over WS. This can vary per exchange spec.
     */
    protected abstract getWsRequestEvents(market: WsMarket, operation: WsOperation, requests: WsTopicRequest<string>[], wsKey: TWSKey): Promise<MidflightWsRequestEvent<TWSRequestEvent>[]>;
    /**
     * Abstraction called to sort ws events into emittable event types (response to a request, data update, etc)
     */
    protected abstract resolveEmittableEvents(wsKey: TWSKey, event: MessageEventLike): EmittableEvent[];
    /**
     * Request connection of all dependent (public & private) websockets, instead of waiting for automatic connection by library
     */
    protected abstract connectAll(): Promise<WSConnectedResult | undefined>[];
    protected isPrivateWsKey(wsKey: TWSKey): boolean;
    /** Returns auto-incrementing request ID, used to track promise references for async requests */
    protected getNewRequestId(): string;
    protected abstract sendWSAPIRequest(wsKey: TWSKey, channel: string, params?: any): Promise<unknown>;
    protected abstract sendWSAPIRequest(wsKey: TWSKey, channel: string, params: any): Promise<unknown>;
    getTimeOffsetMs(): number;
    setTimeOffsetMs(newOffset: number): void;
    private getWsKeyPendingSubscriptionStore;
    protected upsertPendingTopicSubscribeRequests(wsKey: TWSKey, requestData: MidflightWsRequestEvent<TWSRequestEvent>): Promise<TWSRequestEvent>;
    protected removeTopicPendingSubscription(wsKey: TWSKey, requestKey: string): void;
    private clearTopicsPendingSubscriptions;
    /**
     * Resolve/reject the promise for a midflight request.
     *
     * This will typically execute before the event is emitted.
     */
    protected updatePendingTopicSubscriptionStatus(wsKey: TWSKey, requestKey: string, msg: object, isTopicSubscriptionSuccessEvent: boolean): void;
    /**
     * Don't call directly! Use subscribe() instead!
     *
     * Subscribe to one or more topics on a WS connection (identified by WS Key).
     *
     * - Topics are automatically cached
     * - Connections are automatically opened, if not yet connected
     * - Authentication is automatically handled
     * - Topics are automatically resubscribed to, if something happens to the connection, unless you call unsubsribeTopicsForWsKey(topics, key).
     *
     * @param wsRequests array of topics to subscribe to
     * @param wsKey ws key referring to the ws connection these topics should be subscribed on
     */
    protected subscribeTopicsForWsKey(wsTopicRequests: WsTopicRequestOrStringTopic<string>[], wsKey: TWSKey): Promise<false | WSConnectedResult | Awaited<TWSRequestEvent>[] | undefined>;
    protected unsubscribeTopicsForWsKey(wsTopicRequests: WsTopicRequestOrStringTopic<string>[], wsKey: TWSKey): Promise<unknown>;
    /**
     * Splits topic requests into two groups, public & private topic requests
     */
    private sortTopicRequestsIntoPublicPrivate;
    /** Get the WsStore that tracks websockets & topics */
    getWsStore(): WsStore<TWSKey, WsTopicRequest<string>>;
    close(wsKey: TWSKey, force?: boolean): void;
    closeAll(force?: boolean): void;
    isConnected(wsKey: TWSKey): boolean;
    /**
     * Request connection to a specific websocket, instead of waiting for automatic connection.
     */
    connect(wsKey: TWSKey): Promise<WSConnectedResult | undefined>;
    private connectToWsUrl;
    private parseWsError;
    /** Get a signature, build the auth request and send it */
    private sendAuthRequest;
    private reconnectWithDelay;
    private ping;
    /**
     * Closes a connection, if it's even open. If open, this will trigger a reconnect asynchronously.
     * If closed, trigger a reconnect immediately
     */
    private executeReconnectableClose;
    private clearTimers;
    private clearPingTimer;
    private clearPongTimer;
    private clearReconnectTimer;
    /**
     * Returns a list of string events that can be individually sent upstream to complete subscribing/unsubscribing/etc to these topics
     *
     * If events are an object, these should be stringified (`return JSON.stringify(event);`)
     * Each event returned by this will be sent one at a time
     *
     * Events are automatically split into smaller batches, by this method, if needed.
     */
    protected getWsOperationEventsForTopics(topics: WsTopicRequest<string>[], wsKey: TWSKey, operation: WsOperation): Promise<MidflightWsRequestEvent<TWSRequestEvent>[]>;
    /**
     * Simply builds and sends subscribe events for a list of topics for a ws key
     *
     * @private Use the `subscribe(topics)` or `subscribeTopicsForWsKey(topics, wsKey)` method to subscribe to topics.
     */
    private requestSubscribeTopics;
    /**
     * Simply builds and sends unsubscribe events for a list of topics for a ws key
     *
     * @private Use the `unsubscribe(topics)` method to unsubscribe from topics. Send WS message to unsubscribe from topics.
     */
    private requestUnsubscribeTopics;
    /**
     * Try sending a string event on a WS connection (identified by the WS Key)
     */
    tryWsSend(wsKey: TWSKey, wsMessage: string, throwExceptions?: boolean): void;
    private onWsOpen;
    /**
     * Handle subscription to private topics _after_ authentication successfully completes asynchronously.
     *
     * Only used for exchanges that require auth before sending private topic subscription requests
     */
    private onWsAuthenticated;
    private onWsMessage;
    private onWsClose;
    private getWs;
    private setWsState;
    /**
     * Promise-driven method to assert that a ws has successfully connected (will await until connection is open)
     */
    assertIsConnected(wsKey: TWSKey): Promise<unknown>;
    /**
     * Promise-driven method to assert that a ws has been successfully authenticated (will await until auth is confirmed)
     */
    assertIsAuthenticated(wsKey: TWSKey): Promise<unknown>;
}
export {};
