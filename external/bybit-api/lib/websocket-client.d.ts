import WebSocket from 'isomorphic-ws';
import { CategoryV5, MessageEventLike, WsKey, WsMarket, WsTopic } from './types';
import { WSConnectedResult, WS_KEY_MAP, WsTopicRequest } from './util';
import { BaseWebsocketClient, EmittableEvent, MidflightWsRequestEvent } from './util/BaseWSClient';
import { Exact, WSAPIOperation, WsAPIOperationResponseMap, WsAPITopicRequestParamMap, WsAPIWsKeyTopicMap, WsOperation, WsRequestOperationBybit } from './types/websockets/ws-api';
export declare class WebsocketClient extends BaseWebsocketClient<WsKey, WsRequestOperationBybit<WsTopic>> {
    /**
     * Request connection of all dependent (public & private) websockets, instead of waiting
     * for automatic connection by SDK.
     */
    connectAll(): Promise<WSConnectedResult | undefined>[];
    /**
     * Ensures the WS API connection is active and ready.
     *
     * You do not need to call this, but if you call this before making any WS API requests,
     * it can accelerate the first request (by preparing the connection in advance).
     */
    connectWSAPI(): Promise<unknown>;
    connectPublic(): Promise<WSConnectedResult | undefined>[];
    connectPrivate(): Promise<WebSocket | undefined>;
    /**
     * Subscribe to V5 topics & track/persist them.
     * @param wsTopics - topic or list of topics
     * @param category - the API category this topic is for (e.g. "linear").
     * The value is only important when connecting to public topics and will be ignored for private topics.
     * @param isPrivateTopic - optional - the library will try to detect private topics, you can use this
     * to mark a topic as private (if the topic isn't recognised yet)
     */
    subscribeV5(wsTopics: WsTopic[] | WsTopic, category: CategoryV5, isPrivateTopic?: boolean): Promise<unknown>[];
    /**
     * Unsubscribe from V5 topics & remove them from memory. They won't be re-subscribed to if the
     * connection reconnects.
     *
     * @param wsTopics - topic or list of topics
     * @param category - the API category this topic is for (e.g. "linear"). The value is only
     * important when connecting to public topics and will be ignored for private topics.
     * @param isPrivateTopic - optional - the library will try to detect private topics, you can
     * use this to mark a topic as private (if the topic isn't recognised yet)
     */
    unsubscribeV5(wsTopics: WsTopic[] | WsTopic, category: CategoryV5, isPrivateTopic?: boolean): Promise<unknown>[];
    /**
     * Note: subscribeV5() might be simpler to use. The end result is the same.
     *
     * Request subscription to one or more topics. Pass topics as either an array of strings,
     * or array of objects (if the topic has parameters).
     *
     * Objects should be formatted as {topic: string, params: object, category: CategoryV5}.
     *
     * - Subscriptions are automatically routed to the correct websocket connection.
     * - Authentication/connection is automatic.
     * - Resubscribe after network issues is automatic.
     *
     * Call `unsubscribe(topics)` to remove topics
     */
    subscribe(requests: (WsTopicRequest<WsTopic> | WsTopic) | (WsTopicRequest<WsTopic> | WsTopic)[], wsKey?: WsKey): void;
    /**
     * Note: unsubscribe() might be simpler to use. The end result is the same.
     * Unsubscribe from one or more topics. Similar to subscribe() but in reverse.
     *
     * - Requests are automatically routed to the correct websocket connection.
     * - These topics will be removed from the topic cache, so they won't be subscribed to again.
     */
    unsubscribe(requests: (WsTopicRequest<WsTopic> | WsTopic) | (WsTopicRequest<WsTopic> | WsTopic)[], wsKey?: WsKey): void;
    /**
     *
     *
     *
     * WS API Methods - similar to the REST API, but via WebSockets
     * https://bybit-exchange.github.io/docs/v5/websocket/trade/guideline
     *
     *
     *
     */
    /**
     * Send a Websocket API command/request on a connection. Returns a promise that resolves on reply.
     *
     * WS API Documentation for list of operations and parameters:
     * https://bybit-exchange.github.io/docs/v5/websocket/trade/guideline
     *
     * Returned promise is rejected if:
     * - an exception is detected in the reply, OR
     * - the connection disconnects for any reason (even if automatic reconnect will happen).
     *
     * Authentication is automatic. If you didn't request authentication yourself, there might
     * be a small delay after your first request, while the SDK automatically authenticates.
     *
     * @param wsKey - The connection this event is for. Currently only "v5PrivateTrade" is supported
     * for Bybit, since that is the dedicated WS API connection.
     * @param operation - The command being sent, e.g. "order.create" to submit a new order.
     * @param params - Any request parameters for the command. E.g. `OrderParamsV5` to submit a new
     * order. Only send parameters for the request body. Everything else is automatically handled.
     * @returns Promise - tries to resolve with async WS API response. Rejects if disconnected or exception is seen in async WS API response
     */
    sendWSAPIRequest<TWSKey extends keyof WsAPIWsKeyTopicMap, TWSOperation extends WsAPIWsKeyTopicMap[TWSKey], TWSParams extends Exact<WsAPITopicRequestParamMap[TWSOperation]>>(wsKey: TWSKey, operation: TWSOperation, ...params: TWSParams extends undefined ? [] : [TWSParams]): Promise<WsAPIOperationResponseMap[TWSOperation]>;
    sendWSAPIRequest<TWSOpreation extends WSAPIOperation = 'order.create'>(wsKey: typeof WS_KEY_MAP.v5PrivateTrade, operation: TWSOpreation, params: WsAPITopicRequestParamMap[TWSOpreation]): Promise<WsAPIOperationResponseMap[TWSOpreation]>;
    sendWSAPIRequest<TWSOpreation extends WSAPIOperation = 'order.amend'>(wsKey: typeof WS_KEY_MAP.v5PrivateTrade, operation: TWSOpreation, params: WsAPITopicRequestParamMap[TWSOpreation]): Promise<WsAPIOperationResponseMap[TWSOpreation]>;
    sendWSAPIRequest<TWSOpreation extends WSAPIOperation = 'order.cancel'>(wsKey: typeof WS_KEY_MAP.v5PrivateTrade, operation: TWSOpreation, params: WsAPITopicRequestParamMap[TWSOpreation]): Promise<WsAPIOperationResponseMap[TWSOpreation]>;
    /**
     *
     *
     * Internal methods - not intended for public use
     *
     *
     */
    /**
     * @returns The WS URL to connect to for this WS key
     */
    protected getWsUrl(wsKey: WsKey): Promise<string>;
    /**
     * Return params required to make authorized request
     */
    private getWsAuthURLSuffix;
    private signMessage;
    protected getWsAuthRequestEvent(wsKey: WsKey): Promise<WsRequestOperationBybit<string>>;
    private getWsAuthSignature;
    private signWSAPIRequest;
    protected sendPingEvent(wsKey: WsKey): void;
    protected sendPongEvent(wsKey: WsKey): void;
    /** Force subscription requests to be sent in smaller batches, if a number is returned */
    protected getMaxTopicsPerSubscribeEvent(wsKey: WsKey): number | null;
    /**
     * @returns one or more correctly structured request events for performing a operations over WS. This can vary per exchange spec.
     */
    protected getWsRequestEvents(market: WsMarket, operation: WsOperation, requests: WsTopicRequest<string>[], wsKey: WsKey): Promise<MidflightWsRequestEvent<WsRequestOperationBybit<WsTopic>>[]>;
    protected getPrivateWSKeys(): WsKey[];
    protected isAuthOnConnectWsKey(wsKey: WsKey): boolean;
    /**
     * Determines if a topic is for a private channel, using a hardcoded list of strings
     */
    protected isPrivateTopicRequest(request: WsTopicRequest<string>): boolean;
    protected isWsPing(msg: any): boolean;
    protected isWsPong(msg: any): boolean;
    /**
     * Abstraction called to sort ws events into emittable event types (response to a request, data update, etc)
     */
    protected resolveEmittableEvents(wsKey: WsKey, event: MessageEventLike): EmittableEvent[];
}
