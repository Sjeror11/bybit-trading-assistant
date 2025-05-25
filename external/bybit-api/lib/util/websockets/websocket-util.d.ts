import WebSocket from 'isomorphic-ws';
import { APIMarket, CategoryV5, WebsocketClientOptions, WsKey, WsTopic } from '../../types';
import { DefaultLogger } from '../logger';
import { WSAPIRequest } from '../../types/websockets/ws-api';
export declare const WS_LOGGER_CATEGORY: {
    category: string;
};
export declare const WS_KEY_MAP: {
    readonly v5SpotPublic: "v5SpotPublic";
    readonly v5LinearPublic: "v5LinearPublic";
    readonly v5InversePublic: "v5InversePublic";
    readonly v5OptionPublic: "v5OptionPublic";
    readonly v5Private: "v5Private";
    /**
     * The V5 Websocket API (for sending orders over WS)
     */
    readonly v5PrivateTrade: "v5PrivateTrade";
};
export declare const WS_AUTH_ON_CONNECT_KEYS: WsKey[];
export declare const PUBLIC_WS_KEYS: string[];
/**
 * Normalised internal format for a request (subscribe/unsubscribe/etc) on a topic, with optional parameters.
 *
 * - Topic: the topic this event is for
 * - Payload: the parameters to include, optional. E.g. auth requires key + sign. Some topics allow configurable parameters.
 * - Category: required for bybit, since different categories have different public endpoints
 */
export interface WsTopicRequest<TWSTopic extends string = string, TWSPayload = unknown> {
    topic: TWSTopic;
    payload?: TWSPayload;
    category?: CategoryV5;
}
/**
 * Conveniently allow users to request a topic either as string topics or objects (containing string topic + params)
 */
export type WsTopicRequestOrStringTopic<TWSTopic extends string, TWSPayload = unknown> = WsTopicRequest<TWSTopic, TWSPayload> | string;
interface NetworkMapV3 {
    livenet: string;
    livenet2?: string;
    testnet: string;
    testnet2?: string;
}
type PublicPrivateNetwork = 'public' | 'private';
/**
 * The following WS keys are logical.
 *
 * They're not directly used as a market. They usually have one private endpoint but many public ones,
 * so they need a bit of extra handling for seamless messaging between endpoints.
 *
 * For the unified keys, the "split" happens using the symbol. Symbols suffixed with USDT are obviously USDT topics.
 * For the v5 endpoints, the subscribe/unsubscribe call must specify the category the subscription should route to.
 */
type PublicOnlyWsKeys = 'v5SpotPublic' | 'v5LinearPublic' | 'v5InversePublic' | 'v5OptionPublic';
export declare const WS_BASE_URL_MAP: Record<APIMarket, Record<PublicPrivateNetwork, NetworkMapV3>> & Record<PublicOnlyWsKeys, Record<'public', NetworkMapV3>> & Record<typeof WS_KEY_MAP.v5PrivateTrade, Record<PublicPrivateNetwork, NetworkMapV3>>;
export declare function isPrivateWsTopic(topic: string): boolean;
export declare function getWsKeyForTopic(market: APIMarket, topic: string, isPrivate?: boolean, category?: CategoryV5): WsKey;
export declare function getWsUrl(wsKey: WsKey, wsClientOptions: WebsocketClientOptions, logger: typeof DefaultLogger): string;
export declare function getMaxTopicsPerSubscribeEvent(market: APIMarket, wsKey: WsKey): number | null;
export declare const WS_ERROR_ENUM: {
    NOT_AUTHENTICATED_SPOT_V3: string;
    API_ERROR_GENERIC: string;
    API_SIGN_AUTH_FAILED: string;
    USDC_OPTION_AUTH_FAILED: string;
};
/**
 * #305: ws.terminate() is undefined in browsers.
 * This only works in node.js, not in browsers.
 * Does nothing if `ws` is undefined. Does nothing in browsers.
 */
export declare function safeTerminateWs(ws?: WebSocket | any, fallbackToClose?: boolean): boolean;
/**
 * WS API promises are stored using a primary key. This key is constructed using
 * properties found in every request & reply.
 */
export declare function getPromiseRefForWSAPIRequest(requestEvent: WSAPIRequest<unknown>): string;
/**
 * Users can conveniently pass topics as strings or objects (object has topic name + optional params).
 *
 * This method normalises topics into objects (object has topic name + optional params).
 */
export declare function getNormalisedTopicRequests(wsTopicRequests: WsTopicRequestOrStringTopic<string>[]): WsTopicRequest<string>[];
/**
 * Groups topics in request into per-wsKey groups
 * @param normalisedTopicRequests
 * @param wsKey
 * @param isPrivateTopic
 * @returns
 */
export declare function getTopicsPerWSKey(market: APIMarket, normalisedTopicRequests: WsTopicRequest[], wsKey?: WsKey, isPrivateTopic?: boolean): {
    [key in WsKey]?: WsTopicRequest<WsTopic>[];
};
export {};
