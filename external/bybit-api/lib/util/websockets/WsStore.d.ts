import WebSocket from 'isomorphic-ws';
import { DefaultLogger } from '../logger';
import { DeferredPromise, WSConnectedResult, WsConnectionStateEnum, WsStoredState } from './WsStore.types';
/**
 * Simple comparison of two objects, only checks 1-level deep (nested objects won't match)
 */
export declare function isDeepObjectMatch(object1: unknown, object2: unknown): boolean;
export declare const DEFERRED_PROMISE_REF: {
    readonly CONNECTION_IN_PROGRESS: "CONNECTION_IN_PROGRESS";
    readonly AUTHENTICATION_IN_PROGRESS: "AUTHENTICATION_IN_PROGRESS";
};
type DeferredPromiseRef = (typeof DEFERRED_PROMISE_REF)[keyof typeof DEFERRED_PROMISE_REF];
export declare class WsStore<WsKey extends string, TWSTopicSubscribeEventArgs extends string | object> {
    private wsState;
    private logger;
    constructor(logger: typeof DefaultLogger);
    /** Get WS stored state for key, optionally create if missing */
    get(key: WsKey, createIfMissing?: true): WsStoredState<TWSTopicSubscribeEventArgs>;
    get(key: WsKey, createIfMissing?: false): WsStoredState<TWSTopicSubscribeEventArgs> | undefined;
    getKeys(): WsKey[];
    create(key: WsKey): WsStoredState<TWSTopicSubscribeEventArgs> | undefined;
    delete(key: WsKey): void;
    hasExistingActiveConnection(key: WsKey): boolean;
    getWs(key: WsKey): WebSocket | undefined;
    setWs(key: WsKey, wsConnection: WebSocket): WebSocket;
    getDeferredPromise<TSuccessResult = any>(wsKey: WsKey, promiseRef: string | DeferredPromiseRef): DeferredPromise<TSuccessResult> | undefined;
    createDeferredPromise<TSuccessResult = any>(wsKey: WsKey, promiseRef: string | DeferredPromiseRef, throwIfExists: boolean): DeferredPromise<TSuccessResult>;
    resolveDeferredPromise(wsKey: WsKey, promiseRef: string | DeferredPromiseRef, value: unknown, removeAfter: boolean): void;
    rejectDeferredPromise(wsKey: WsKey, promiseRef: string | DeferredPromiseRef, value: unknown, removeAfter: boolean): void;
    removeDeferredPromise(wsKey: WsKey, promiseRef: string | DeferredPromiseRef): void;
    rejectAllDeferredPromises(wsKey: WsKey, reason: string): void;
    /** Get promise designed to track a connection attempt in progress. Resolves once connected. */
    getConnectionInProgressPromise(wsKey: WsKey): DeferredPromise<WSConnectedResult> | undefined;
    getAuthenticationInProgressPromise(wsKey: WsKey): DeferredPromise<WSConnectedResult & {
        event: any;
    }> | undefined;
    /**
     * Create a deferred promise designed to track a connection attempt in progress.
     *
     * Will throw if existing promise is found.
     */
    createConnectionInProgressPromise(wsKey: WsKey, throwIfExists: boolean): DeferredPromise<WSConnectedResult>;
    createAuthenticationInProgressPromise(wsKey: WsKey, throwIfExists: boolean): DeferredPromise<WSConnectedResult & {
        event: any;
    }>;
    /** Remove promise designed to track a connection attempt in progress */
    removeConnectingInProgressPromise(wsKey: WsKey): void;
    removeAuthenticationInProgressPromise(wsKey: WsKey): void;
    isWsOpen(key: WsKey): boolean;
    getConnectionState(key: WsKey): WsConnectionStateEnum;
    setConnectionState(key: WsKey, state: WsConnectionStateEnum): void;
    isConnectionState(key: WsKey, state: WsConnectionStateEnum): boolean;
    /**
     * Check if we're currently in the process of opening a connection for any reason. Safer than only checking "CONNECTING" as the state
     * @param key
     * @returns
     */
    isConnectionAttemptInProgress(key: WsKey): boolean;
    getTopics(key: WsKey): Set<TWSTopicSubscribeEventArgs>;
    getTopicsByKey(): Record<string, Set<TWSTopicSubscribeEventArgs>>;
    /**
     * Find matching "topic" request from the store
     * @param key
     * @param topic
     * @returns
     */
    getMatchingTopic(key: WsKey, topic: TWSTopicSubscribeEventArgs): TWSTopicSubscribeEventArgs | undefined;
    addTopic(key: WsKey, topic: TWSTopicSubscribeEventArgs): Set<TWSTopicSubscribeEventArgs>;
    deleteTopic(key: WsKey, topic: TWSTopicSubscribeEventArgs): Set<TWSTopicSubscribeEventArgs>;
}
export {};
