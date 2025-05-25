"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsStore = exports.DEFERRED_PROMISE_REF = void 0;
exports.isDeepObjectMatch = isDeepObjectMatch;
const logger_1 = require("../logger");
const WsStore_types_1 = require("./WsStore.types");
/**
 * Simple comparison of two objects, only checks 1-level deep (nested objects won't match)
 */
function isDeepObjectMatch(object1, object2) {
    if (typeof object1 === 'string' && typeof object2 === 'string') {
        return object1 === object2;
    }
    if (typeof object1 !== 'object' || typeof object2 !== 'object') {
        return false;
    }
    for (const key in object1) {
        const value1 = object1[key];
        const value2 = object2[key];
        if (value1 !== value2) {
            return false;
        }
    }
    return true;
}
exports.DEFERRED_PROMISE_REF = {
    CONNECTION_IN_PROGRESS: 'CONNECTION_IN_PROGRESS',
    AUTHENTICATION_IN_PROGRESS: 'AUTHENTICATION_IN_PROGRESS',
};
class WsStore {
    constructor(logger) {
        this.wsState = {};
        this.logger = logger || logger_1.DefaultLogger;
    }
    get(key, createIfMissing) {
        if (this.wsState[key]) {
            return this.wsState[key];
        }
        if (createIfMissing) {
            return this.create(key);
        }
    }
    getKeys() {
        return Object.keys(this.wsState);
    }
    create(key) {
        if (this.hasExistingActiveConnection(key)) {
            this.logger.info('WsStore setConnection() overwriting existing open connection: ', this.getWs(key));
        }
        this.wsState[key] = {
            subscribedTopics: new Set(),
            connectionState: WsStore_types_1.WsConnectionStateEnum.INITIAL,
            deferredPromiseStore: {},
        };
        return this.get(key);
    }
    delete(key) {
        // TODO: should we allow this at all? Perhaps block this from happening...
        if (this.hasExistingActiveConnection(key)) {
            const ws = this.getWs(key);
            this.logger.info('WsStore deleting state for connection still open: ', ws);
            ws === null || ws === void 0 ? void 0 : ws.close();
        }
        delete this.wsState[key];
    }
    /* connection websocket */
    hasExistingActiveConnection(key) {
        return this.get(key) && this.isWsOpen(key);
    }
    getWs(key) {
        var _a;
        return (_a = this.get(key)) === null || _a === void 0 ? void 0 : _a.ws;
    }
    setWs(key, wsConnection) {
        if (this.isWsOpen(key)) {
            this.logger.info('WsStore setConnection() overwriting existing open connection: ', this.getWs(key));
        }
        this.get(key, true).ws = wsConnection;
        return wsConnection;
    }
    getDeferredPromise(wsKey, promiseRef) {
        const storeForKey = this.get(wsKey);
        if (!storeForKey) {
            return;
        }
        const deferredPromiseStore = storeForKey.deferredPromiseStore;
        return deferredPromiseStore[promiseRef];
    }
    createDeferredPromise(wsKey, promiseRef, throwIfExists) {
        const existingPromise = this.getDeferredPromise(wsKey, promiseRef);
        if (existingPromise) {
            if (throwIfExists) {
                throw new Error(`Promise exists for "${wsKey}"`);
            }
            else {
                // console.log('existing promise');
                return existingPromise;
            }
        }
        // console.log('create promise');
        const createIfMissing = true;
        const storeForKey = this.get(wsKey, createIfMissing);
        // TODO: Once stable, use Promise.withResolvers in future
        const deferredPromise = {};
        deferredPromise.promise = new Promise((resolve, reject) => {
            deferredPromise.resolve = resolve;
            deferredPromise.reject = reject;
        });
        const deferredPromiseStore = storeForKey.deferredPromiseStore;
        deferredPromiseStore[promiseRef] = deferredPromise;
        return deferredPromise;
    }
    resolveDeferredPromise(wsKey, promiseRef, value, removeAfter) {
        const promise = this.getDeferredPromise(wsKey, promiseRef);
        if (promise === null || promise === void 0 ? void 0 : promise.resolve) {
            promise.resolve(value);
        }
        if (removeAfter) {
            this.removeDeferredPromise(wsKey, promiseRef);
        }
    }
    rejectDeferredPromise(wsKey, promiseRef, value, removeAfter) {
        const promise = this.getDeferredPromise(wsKey, promiseRef);
        if (promise === null || promise === void 0 ? void 0 : promise.reject) {
            this.logger.trace(`rejectDeferredPromise(): rejecting ${wsKey}/${promiseRef}/${value}`);
            promise.reject(value);
        }
        if (removeAfter) {
            this.removeDeferredPromise(wsKey, promiseRef);
        }
    }
    removeDeferredPromise(wsKey, promiseRef) {
        const storeForKey = this.get(wsKey);
        if (!storeForKey) {
            return;
        }
        const deferredPromise = storeForKey.deferredPromiseStore[promiseRef];
        if (deferredPromise) {
            // Just in case it's pending
            if (deferredPromise.resolve) {
                deferredPromise.resolve('promiseRemoved');
            }
            delete storeForKey.deferredPromiseStore[promiseRef];
        }
    }
    rejectAllDeferredPromises(wsKey, reason) {
        const storeForKey = this.get(wsKey);
        const deferredPromiseStore = storeForKey.deferredPromiseStore;
        if (!storeForKey || !deferredPromiseStore) {
            return;
        }
        const reservedKeys = Object.values(exports.DEFERRED_PROMISE_REF);
        for (const promiseRef in deferredPromiseStore) {
            // Skip reserved keys, such as the connection promise
            if (reservedKeys.includes(promiseRef)) {
                continue;
            }
            try {
                this.rejectDeferredPromise(wsKey, promiseRef, reason, true);
            }
            catch (e) {
                this.logger.error('rejectAllDeferredPromises(): Exception rejecting deferred promise', { wsKey: wsKey, reason, promiseRef, exception: e });
            }
        }
    }
    /** Get promise designed to track a connection attempt in progress. Resolves once connected. */
    getConnectionInProgressPromise(wsKey) {
        return this.getDeferredPromise(wsKey, exports.DEFERRED_PROMISE_REF.CONNECTION_IN_PROGRESS);
    }
    getAuthenticationInProgressPromise(wsKey) {
        return this.getDeferredPromise(wsKey, exports.DEFERRED_PROMISE_REF.AUTHENTICATION_IN_PROGRESS);
    }
    /**
     * Create a deferred promise designed to track a connection attempt in progress.
     *
     * Will throw if existing promise is found.
     */
    createConnectionInProgressPromise(wsKey, throwIfExists) {
        return this.createDeferredPromise(wsKey, exports.DEFERRED_PROMISE_REF.CONNECTION_IN_PROGRESS, throwIfExists);
    }
    createAuthenticationInProgressPromise(wsKey, throwIfExists) {
        return this.createDeferredPromise(wsKey, exports.DEFERRED_PROMISE_REF.AUTHENTICATION_IN_PROGRESS, throwIfExists);
    }
    /** Remove promise designed to track a connection attempt in progress */
    removeConnectingInProgressPromise(wsKey) {
        return this.removeDeferredPromise(wsKey, exports.DEFERRED_PROMISE_REF.CONNECTION_IN_PROGRESS);
    }
    removeAuthenticationInProgressPromise(wsKey) {
        return this.removeDeferredPromise(wsKey, exports.DEFERRED_PROMISE_REF.AUTHENTICATION_IN_PROGRESS);
    }
    /* connection state */
    isWsOpen(key) {
        const existingConnection = this.getWs(key);
        return (!!existingConnection &&
            existingConnection.readyState === existingConnection.OPEN);
    }
    getConnectionState(key) {
        return this.get(key, true).connectionState;
    }
    setConnectionState(key, state) {
        this.get(key, true).connectionState = state;
    }
    isConnectionState(key, state) {
        return this.getConnectionState(key) === state;
    }
    /**
     * Check if we're currently in the process of opening a connection for any reason. Safer than only checking "CONNECTING" as the state
     * @param key
     * @returns
     */
    isConnectionAttemptInProgress(key) {
        const isConnectionInProgress = this.isConnectionState(key, WsStore_types_1.WsConnectionStateEnum.CONNECTING) ||
            this.isConnectionState(key, WsStore_types_1.WsConnectionStateEnum.RECONNECTING);
        return isConnectionInProgress;
    }
    /* subscribed topics */
    getTopics(key) {
        return this.get(key, true).subscribedTopics;
    }
    getTopicsByKey() {
        const result = {};
        for (const refKey in this.wsState) {
            result[refKey] = this.getTopics(refKey);
        }
        return result;
    }
    // Since topics are objects we can't rely on the set to detect duplicates
    /**
     * Find matching "topic" request from the store
     * @param key
     * @param topic
     * @returns
     */
    getMatchingTopic(key, topic) {
        const allTopics = this.getTopics(key).values();
        for (const storedTopic of allTopics) {
            if (isDeepObjectMatch(topic, storedTopic)) {
                return storedTopic;
            }
        }
    }
    addTopic(key, topic) {
        // Check for duplicate topic. If already tracked, don't store this one
        const existingTopic = this.getMatchingTopic(key, topic);
        if (existingTopic) {
            return this.getTopics(key);
        }
        return this.getTopics(key).add(topic);
    }
    deleteTopic(key, topic) {
        // Check if we're subscribed to a topic like this
        const storedTopic = this.getMatchingTopic(key, topic);
        if (storedTopic) {
            this.getTopics(key).delete(storedTopic);
        }
        return this.getTopics(key);
    }
}
exports.WsStore = WsStore;
//# sourceMappingURL=WsStore.js.map