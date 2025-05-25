"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWebsocketClient = void 0;
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
const events_1 = __importDefault(require("events"));
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
const logger_1 = require("./logger");
const types_1 = require("../types");
const WsStore_1 = require("./websockets/WsStore");
const websockets_1 = require("./websockets");
/**
 * Base WebSocket abstraction layer. Handles connections, tracking each connection as a unique "WS Key"
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class BaseWebsocketClient extends events_1.default {
    constructor(options, logger) {
        super();
        this.wsApiRequestId = 0;
        this.timeOffsetMs = 0;
        /**
         * A nested wsKey->request key store.
         * pendingTopicSubscriptionRequests[wsKey][requestKey] = WsKeyPendingTopicSubscriptions<TWSRequestEvent>
         */
        this.pendingTopicSubscriptionRequests = {};
        this.logger = logger || logger_1.DefaultLogger;
        this.wsStore = new WsStore_1.WsStore(this.logger);
        this.options = Object.assign({ 
            // Some defaults:
            testnet: false, demoTrading: false, 
            // Connect to V5 by default, if not defined by the user
            market: 'v5', pongTimeout: 1000, pingInterval: 10000, reconnectTimeout: 500, recvWindow: 5000, 
            // Calls to subscribeV5() are wrapped in a promise, allowing you to await a subscription request.
            // Note: due to internal complexity, it's only recommended if you connect before subscribing.
            promiseSubscribeRequests: false, 
            // Automatically send an authentication op/request after a connection opens, for private connections.
            authPrivateConnectionsOnConnect: true, 
            // Individual requests do not require a signature, so this is disabled.
            authPrivateRequests: false }, options);
    }
    isPrivateWsKey(wsKey) {
        return this.getPrivateWSKeys().includes(wsKey);
    }
    /** Returns auto-incrementing request ID, used to track promise references for async requests */
    getNewRequestId() {
        return `${++this.wsApiRequestId}`;
    }
    getTimeOffsetMs() {
        return this.timeOffsetMs;
    }
    setTimeOffsetMs(newOffset) {
        this.timeOffsetMs = newOffset;
    }
    getWsKeyPendingSubscriptionStore(wsKey) {
        if (!this.pendingTopicSubscriptionRequests[wsKey]) {
            this.pendingTopicSubscriptionRequests[wsKey] = {};
        }
        return this.pendingTopicSubscriptionRequests[wsKey];
    }
    upsertPendingTopicSubscribeRequests(wsKey, requestData) {
        // a unique identifier for this subscription request (e.g. csv of topics, or request id, etc)
        const requestKey = requestData.requestKey;
        // Should not be possible to see a requestKey collision in the current design, since the req ID increments automatically with every request, so this should never be true, but just in case a future mistake happens...
        const pendingSubReqs = this.getWsKeyPendingSubscriptionStore(wsKey);
        if (pendingSubReqs[requestKey]) {
            throw new Error('Implementation error: attempted to upsert pending topics with duplicate request ID!');
        }
        return new Promise((resolver, rejector) => {
            const pendingSubReqs = this.getWsKeyPendingSubscriptionStore(wsKey);
            pendingSubReqs[requestKey] = {
                requestData: requestData.requestEvent,
                resolver,
                rejector,
            };
        });
    }
    removeTopicPendingSubscription(wsKey, requestKey) {
        const pendingSubReqs = this.getWsKeyPendingSubscriptionStore(wsKey);
        delete pendingSubReqs[requestKey];
    }
    clearTopicsPendingSubscriptions(wsKey, rejectAll, rejectReason) {
        if (rejectAll) {
            const pendingSubReqs = this.getWsKeyPendingSubscriptionStore(wsKey);
            for (const requestKey in pendingSubReqs) {
                const request = pendingSubReqs[requestKey];
                this.logger.trace(`clearTopicsPendingSubscriptions(${wsKey}, ${rejectAll}, ${rejectReason}, ${requestKey}): rejecting promise for: ${JSON.stringify((request === null || request === void 0 ? void 0 : request.requestData) || {})}`);
                request === null || request === void 0 ? void 0 : request.rejector(request.requestData, rejectReason);
            }
        }
        this.pendingTopicSubscriptionRequests[wsKey] = {};
    }
    /**
     * Resolve/reject the promise for a midflight request.
     *
     * This will typically execute before the event is emitted.
     */
    updatePendingTopicSubscriptionStatus(wsKey, requestKey, msg, isTopicSubscriptionSuccessEvent) {
        const wsKeyPendingRequests = this.getWsKeyPendingSubscriptionStore(wsKey);
        if (!wsKeyPendingRequests) {
            return;
        }
        const pendingSubscriptionRequest = wsKeyPendingRequests[requestKey];
        if (!pendingSubscriptionRequest) {
            return;
        }
        if (isTopicSubscriptionSuccessEvent) {
            pendingSubscriptionRequest.resolver(pendingSubscriptionRequest.requestData);
        }
        else {
            this.logger.trace(`updatePendingTopicSubscriptionStatus.reject(${wsKey}, ${requestKey}, ${msg}, ${isTopicSubscriptionSuccessEvent}): `, msg);
            try {
                pendingSubscriptionRequest.rejector(pendingSubscriptionRequest.requestData, msg);
            }
            catch (e) {
                console.error('Exception rejecting promise: ', e);
            }
        }
        this.removeTopicPendingSubscription(wsKey, requestKey);
    }
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
    subscribeTopicsForWsKey(wsTopicRequests, wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const normalisedTopicRequests = (0, websockets_1.getNormalisedTopicRequests)(wsTopicRequests);
            // Store topics, so future automation (post-auth, post-reconnect) has everything needed to resubscribe automatically
            for (const topic of normalisedTopicRequests) {
                this.wsStore.addTopic(wsKey, topic);
            }
            const isConnected = this.wsStore.isConnectionState(wsKey, websockets_1.WsConnectionStateEnum.CONNECTED);
            const isConnectionInProgress = this.wsStore.isConnectionAttemptInProgress(wsKey);
            // start connection process if it hasn't yet begun. Topics are automatically subscribed to on-connect
            if (!isConnected && !isConnectionInProgress) {
                return this.connect(wsKey);
            }
            // Subscribe should happen automatically once connected, nothing to do here after topics are added to wsStore.
            if (!isConnected) {
                /**
                 * Are we in the process of connection? Nothing to send yet.
                 */
                this.logger.trace('WS not connected - requests queued for retry once connected.', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey,
                    wsTopicRequests }));
                return;
            }
            // We're connected. Check if auth is needed and if already authenticated
            const isPrivateConnection = this.isPrivateWsKey(wsKey);
            const isAuthenticated = (_a = this.wsStore.get(wsKey)) === null || _a === void 0 ? void 0 : _a.isAuthenticated;
            if (isPrivateConnection && !isAuthenticated) {
                /**
                 * If not authenticated yet and auth is required, don't request topics yet.
                 *
                 * Auth should already automatically be in progress, so no action needed from here. Topics will automatically subscribe post-auth success.
                 */
                return false;
            }
            // Finally, request subscription to topics if the connection is healthy and ready
            return this.requestSubscribeTopics(wsKey, normalisedTopicRequests);
        });
    }
    unsubscribeTopicsForWsKey(wsTopicRequests, wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const normalisedTopicRequests = (0, websockets_1.getNormalisedTopicRequests)(wsTopicRequests);
            // Store topics, so future automation (post-auth, post-reconnect) has everything needed to resubscribe automatically
            for (const topic of normalisedTopicRequests) {
                this.wsStore.deleteTopic(wsKey, topic);
            }
            const isConnected = this.wsStore.isConnectionState(wsKey, websockets_1.WsConnectionStateEnum.CONNECTED);
            // If not connected, don't need to do anything.
            // Removing the topic from the store is enough to stop it from being resubscribed to on reconnect.
            if (!isConnected) {
                return;
            }
            // We're connected. Check if auth is needed and if already authenticated
            const isPrivateConnection = this.isPrivateWsKey(wsKey);
            const isAuthenticated = (_a = this.wsStore.get(wsKey)) === null || _a === void 0 ? void 0 : _a.isAuthenticated;
            if (isPrivateConnection && !isAuthenticated) {
                /**
                 * If not authenticated yet and auth is required, don't need to do anything.
                 * We don't subscribe to topics until auth is complete anyway.
                 */
                return;
            }
            // Finally, request subscription to topics if the connection is healthy and ready
            return this.requestUnsubscribeTopics(wsKey, normalisedTopicRequests);
        });
    }
    /**
     * Splits topic requests into two groups, public & private topic requests
     */
    sortTopicRequestsIntoPublicPrivate(wsTopicRequests, wsKey) {
        const publicTopicRequests = [];
        const privateTopicRequests = [];
        for (const topic of wsTopicRequests) {
            if (this.isPrivateTopicRequest(topic, wsKey)) {
                privateTopicRequests.push(topic);
            }
            else {
                publicTopicRequests.push(topic);
            }
        }
        return {
            publicReqs: publicTopicRequests,
            privateReqs: privateTopicRequests,
        };
    }
    /** Get the WsStore that tracks websockets & topics */
    getWsStore() {
        return this.wsStore;
    }
    close(wsKey, force) {
        this.logger.info('Closing connection', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
        this.setWsState(wsKey, websockets_1.WsConnectionStateEnum.CLOSING);
        this.clearTimers(wsKey);
        const ws = this.getWs(wsKey);
        ws === null || ws === void 0 ? void 0 : ws.close();
        if (force) {
            (0, websockets_1.safeTerminateWs)(ws, false);
        }
    }
    closeAll(force) {
        const keys = this.wsStore.getKeys();
        this.logger.info(`Closing all ws connections: ${keys}`);
        keys.forEach((key) => {
            this.close(key, force);
        });
    }
    isConnected(wsKey) {
        return this.wsStore.isConnectionState(wsKey, websockets_1.WsConnectionStateEnum.CONNECTED);
    }
    /**
     * Request connection to a specific websocket, instead of waiting for automatic connection.
     */
    connect(wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (this.wsStore.isWsOpen(wsKey)) {
                    this.logger.error('Refused to connect to ws with existing active connection', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
                    return { wsKey };
                }
                if (this.wsStore.isConnectionState(wsKey, websockets_1.WsConnectionStateEnum.CONNECTING)) {
                    this.logger.error('Refused to connect to ws, connection attempt already active', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
                    return;
                }
                if (!this.wsStore.getConnectionState(wsKey) ||
                    this.wsStore.isConnectionState(wsKey, websockets_1.WsConnectionStateEnum.INITIAL)) {
                    this.setWsState(wsKey, websockets_1.WsConnectionStateEnum.CONNECTING);
                }
                if (!this.wsStore.getConnectionInProgressPromise(wsKey)) {
                    this.wsStore.createConnectionInProgressPromise(wsKey, false);
                }
                const url = yield this.getWsUrl(wsKey);
                const ws = this.connectToWsUrl(url, wsKey);
                this.wsStore.setWs(wsKey, ws);
                return (_a = this.wsStore.getConnectionInProgressPromise(wsKey)) === null || _a === void 0 ? void 0 : _a.promise;
            }
            catch (err) {
                this.parseWsError('Connection failed', err, wsKey);
                this.reconnectWithDelay(wsKey, this.options.reconnectTimeout);
            }
        });
    }
    connectToWsUrl(url, wsKey) {
        var _a;
        this.logger.trace(`Opening WS connection to URL: ${url}`, Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
        const agent = (_a = this.options.requestOptions) === null || _a === void 0 ? void 0 : _a.agent;
        const ws = new isomorphic_ws_1.default(url, undefined, agent ? { agent } : undefined);
        ws.onopen = (event) => this.onWsOpen(event, wsKey);
        ws.onmessage = (event) => this.onWsMessage(event, wsKey, ws);
        ws.onerror = (event) => this.parseWsError('Websocket onWsError', event, wsKey);
        ws.onclose = (event) => this.onWsClose(event, wsKey);
        return ws;
    }
    parseWsError(context, error, wsKey) {
        if (!error.message) {
            this.logger.error(`${context} due to unexpected error: `, error);
            this.emit('response', Object.assign(Object.assign({}, error), { wsKey }));
            this.emit('exception', Object.assign(Object.assign({}, error), { wsKey }));
            return;
        }
        switch (error.message) {
            case 'Unexpected server response: 401':
                this.logger.error(`${context} due to 401 authorization failure.`, Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
                break;
            default:
                if (this.wsStore.getConnectionState(wsKey) !==
                    websockets_1.WsConnectionStateEnum.CLOSING) {
                    this.logger.error(`${context} due to unexpected response error: "${(error === null || error === void 0 ? void 0 : error.msg) || (error === null || error === void 0 ? void 0 : error.message) || error}"`, Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey, error }));
                    this.executeReconnectableClose(wsKey, 'unhandled onWsError');
                }
                else {
                    this.logger.info(`${wsKey} socket forcefully closed. Will not reconnect.`);
                }
                break;
        }
        this.logger.error(`parseWsError(${context}, ${error}, ${wsKey}) `, error);
        this.emit('response', Object.assign(Object.assign({}, error), { wsKey }));
        this.emit('exception', Object.assign(Object.assign({}, error), { wsKey }));
    }
    /** Get a signature, build the auth request and send it */
    sendAuthRequest(wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                this.logger.trace('Sending auth request...', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
                yield this.assertIsConnected(wsKey);
                if (!this.wsStore.getAuthenticationInProgressPromise(wsKey)) {
                    this.wsStore.createAuthenticationInProgressPromise(wsKey, false);
                }
                const request = yield this.getWsAuthRequestEvent(wsKey);
                // console.log('ws auth req', request);
                this.tryWsSend(wsKey, JSON.stringify(request));
                return (_a = this.wsStore.getAuthenticationInProgressPromise(wsKey)) === null || _a === void 0 ? void 0 : _a.promise;
            }
            catch (e) {
                this.logger.trace(e, Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
            }
        });
    }
    reconnectWithDelay(wsKey, connectionDelayMs) {
        var _a;
        this.clearTimers(wsKey);
        if (!this.wsStore.isConnectionAttemptInProgress(wsKey)) {
            this.setWsState(wsKey, websockets_1.WsConnectionStateEnum.RECONNECTING);
        }
        if ((_a = this.wsStore.get(wsKey)) === null || _a === void 0 ? void 0 : _a.activeReconnectTimer) {
            this.clearReconnectTimer(wsKey);
        }
        this.wsStore.get(wsKey, true).activeReconnectTimer = setTimeout(() => {
            this.logger.info('Reconnecting to websocket', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
            this.clearReconnectTimer(wsKey);
            this.connect(wsKey);
        }, connectionDelayMs);
    }
    ping(wsKey) {
        if (this.wsStore.get(wsKey, true).activePongTimer) {
            return;
        }
        this.clearPongTimer(wsKey);
        this.logger.trace('Sending ping', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
        const ws = this.wsStore.get(wsKey, true).ws;
        if (!ws) {
            this.logger.error(`Unable to send ping for wsKey "${wsKey}" - no connection found`);
            return;
        }
        this.sendPingEvent(wsKey, ws);
        this.wsStore.get(wsKey, true).activePongTimer = setTimeout(() => this.executeReconnectableClose(wsKey, 'Pong timeout'), this.options.pongTimeout);
    }
    /**
     * Closes a connection, if it's even open. If open, this will trigger a reconnect asynchronously.
     * If closed, trigger a reconnect immediately
     */
    executeReconnectableClose(wsKey, reason) {
        this.logger.info(`${reason} - closing socket to reconnect`, Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey,
            reason }));
        const wasOpen = this.wsStore.isWsOpen(wsKey);
        this.clearPingTimer(wsKey);
        this.clearPongTimer(wsKey);
        const ws = this.getWs(wsKey);
        if (ws) {
            ws.close();
            (0, websockets_1.safeTerminateWs)(ws, false);
        }
        if (!wasOpen) {
            this.logger.info(`${reason} - socket already closed - trigger immediate reconnect`, Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey,
                reason }));
            this.reconnectWithDelay(wsKey, this.options.reconnectTimeout);
        }
    }
    clearTimers(wsKey) {
        this.clearPingTimer(wsKey);
        this.clearPongTimer(wsKey);
        this.clearReconnectTimer(wsKey);
    }
    // Send a ping at intervals
    clearPingTimer(wsKey) {
        const wsState = this.wsStore.get(wsKey);
        if (wsState === null || wsState === void 0 ? void 0 : wsState.activePingTimer) {
            clearInterval(wsState.activePingTimer);
            wsState.activePingTimer = undefined;
        }
    }
    // Expect a pong within a time limit
    clearPongTimer(wsKey) {
        const wsState = this.wsStore.get(wsKey);
        if (wsState === null || wsState === void 0 ? void 0 : wsState.activePongTimer) {
            clearTimeout(wsState.activePongTimer);
            wsState.activePongTimer = undefined;
            // this.logger.trace(`Cleared pong timeout for "${wsKey}"`);
        }
        else {
            // this.logger.trace(`No active pong timer for "${wsKey}"`);
        }
    }
    clearReconnectTimer(wsKey) {
        const wsState = this.wsStore.get(wsKey);
        if (wsState === null || wsState === void 0 ? void 0 : wsState.activeReconnectTimer) {
            clearTimeout(wsState.activeReconnectTimer);
            wsState.activeReconnectTimer = undefined;
        }
    }
    /**
     * Returns a list of string events that can be individually sent upstream to complete subscribing/unsubscribing/etc to these topics
     *
     * If events are an object, these should be stringified (`return JSON.stringify(event);`)
     * Each event returned by this will be sent one at a time
     *
     * Events are automatically split into smaller batches, by this method, if needed.
     */
    getWsOperationEventsForTopics(topics, wsKey, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!topics.length) {
                return [];
            }
            // Events that are ready to send (usually stringified JSON)
            const requestEvents = [];
            const market = 'all';
            const maxTopicsPerEvent = this.getMaxTopicsPerSubscribeEvent(wsKey);
            if (maxTopicsPerEvent &&
                maxTopicsPerEvent !== null &&
                topics.length > maxTopicsPerEvent) {
                for (let i = 0; i < topics.length; i += maxTopicsPerEvent) {
                    const batch = topics.slice(i, i + maxTopicsPerEvent);
                    const subscribeRequestEvents = yield this.getWsRequestEvents(market, operation, batch, wsKey);
                    requestEvents.push(...subscribeRequestEvents);
                }
                return requestEvents;
            }
            const subscribeRequestEvents = yield this.getWsRequestEvents(market, operation, topics, wsKey);
            return subscribeRequestEvents;
        });
    }
    /**
     * Simply builds and sends subscribe events for a list of topics for a ws key
     *
     * @private Use the `subscribe(topics)` or `subscribeTopicsForWsKey(topics, wsKey)` method to subscribe to topics.
     */
    requestSubscribeTopics(wsKey, wsTopicRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!wsTopicRequests.length) {
                return;
            }
            // Automatically splits requests into smaller batches, if needed
            const subscribeWsMessages = yield this.getWsOperationEventsForTopics(wsTopicRequests, wsKey, 'subscribe');
            this.logger.trace(`Subscribing to ${wsTopicRequests.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches.`);
            // console.log(`batches: `, JSON.stringify(subscribeWsMessages, null, 2));
            const promises = [];
            for (const midflightRequest of subscribeWsMessages) {
                const wsMessage = midflightRequest.requestEvent;
                if (this.options.promiseSubscribeRequests) {
                    promises.push(this.upsertPendingTopicSubscribeRequests(wsKey, midflightRequest));
                }
                this.logger.trace(`Sending batch via message: "${JSON.stringify(wsMessage)}"`);
                this.tryWsSend(wsKey, JSON.stringify(wsMessage));
            }
            this.logger.trace(`Finished subscribing to ${wsTopicRequests.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches.`);
            return Promise.all(promises);
        });
    }
    /**
     * Simply builds and sends unsubscribe events for a list of topics for a ws key
     *
     * @private Use the `unsubscribe(topics)` method to unsubscribe from topics. Send WS message to unsubscribe from topics.
     */
    requestUnsubscribeTopics(wsKey, wsTopicRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!wsTopicRequests.length) {
                return;
            }
            const subscribeWsMessages = yield this.getWsOperationEventsForTopics(wsTopicRequests, wsKey, 'unsubscribe');
            this.logger.trace(`Unsubscribing to ${wsTopicRequests.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches. Events: "${JSON.stringify(wsTopicRequests)}"`);
            const promises = [];
            for (const midflightRequest of subscribeWsMessages) {
                const wsMessage = midflightRequest.requestEvent;
                if (this.options.promiseSubscribeRequests) {
                    promises.push(this.upsertPendingTopicSubscribeRequests(wsKey, midflightRequest));
                }
                this.logger.trace(`Sending batch via message: "${wsMessage}"`);
                this.tryWsSend(wsKey, JSON.stringify(wsMessage));
            }
            this.logger.trace(`Finished unsubscribing to ${wsTopicRequests.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches.`);
            return Promise.all(promises);
        });
    }
    /**
     * Try sending a string event on a WS connection (identified by the WS Key)
     */
    tryWsSend(wsKey, wsMessage, throwExceptions) {
        try {
            this.logger.trace('Sending upstream ws message: ', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsMessage,
                wsKey }));
            if (!wsKey) {
                throw new Error('Cannot send message due to no known websocket for this wsKey');
            }
            const ws = this.getWs(wsKey);
            if (!ws) {
                throw new Error(`${wsKey} socket not connected yet, call "connectAll()" first then try again when the "open" event arrives`);
            }
            ws.send(wsMessage);
        }
        catch (e) {
            this.logger.error('Failed to send WS message', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsMessage,
                wsKey, exception: e }));
            if (throwExceptions) {
                throw e;
            }
        }
    }
    onWsOpen(event, wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFreshConnectionAttempt = this.wsStore.isConnectionState(wsKey, websockets_1.WsConnectionStateEnum.CONNECTING);
            const isReconnectionAttempt = this.wsStore.isConnectionState(wsKey, websockets_1.WsConnectionStateEnum.RECONNECTING);
            if (isFreshConnectionAttempt) {
                this.logger.info('Websocket connected', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey, testnet: this.options.testnet === true, market: this.options.market }));
                this.emit('open', { wsKey, event });
            }
            else if (isReconnectionAttempt) {
                this.logger.info('Websocket reconnected', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey, testnet: this.options.testnet === true, market: this.options.market }));
                this.emit('reconnected', { wsKey, event });
            }
            this.setWsState(wsKey, websockets_1.WsConnectionStateEnum.CONNECTED);
            this.logger.trace('Enabled ping timer', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
            this.wsStore.get(wsKey, true).activePingTimer = setInterval(() => this.ping(wsKey), this.options.pingInterval);
            // Resolve & cleanup deferred "connection attempt in progress" promise
            try {
                const connectionInProgressPromise = this.wsStore.getConnectionInProgressPromise(wsKey);
                if (connectionInProgressPromise === null || connectionInProgressPromise === void 0 ? void 0 : connectionInProgressPromise.resolve) {
                    connectionInProgressPromise.resolve({
                        wsKey,
                    });
                }
            }
            catch (e) {
                this.logger.error('Exception trying to resolve "connectionInProgress" promise', e);
            }
            // Remove before continuing, in case there's more requests queued
            this.wsStore.removeConnectingInProgressPromise(wsKey);
            // Reconnect to topics known before it connected
            const { privateReqs, publicReqs } = this.sortTopicRequestsIntoPublicPrivate([...this.wsStore.getTopics(wsKey)], wsKey);
            // Request sub to public topics, if any
            try {
                yield this.requestSubscribeTopics(wsKey, publicReqs);
            }
            catch (e) {
                this.logger.error(`onWsOpen(): exception in public requestSubscribeTopics(${wsKey}): `, publicReqs, e);
            }
            // Request sub to private topics, if auth on connect isn't needed
            // Else, this is automatic after authentication is successfully confirmed
            if (!this.options.authPrivateConnectionsOnConnect) {
                try {
                    this.requestSubscribeTopics(wsKey, privateReqs);
                }
                catch (e) {
                    this.logger.error(`onWsOpen(): exception in private requestSubscribeTopics(${wsKey}: `, privateReqs, e);
                }
            }
            // Some websockets require an auth packet to be sent after opening the connection
            if (this.isAuthOnConnectWsKey(wsKey) &&
                this.options.authPrivateConnectionsOnConnect) {
                yield this.sendAuthRequest(wsKey);
            }
        });
    }
    /**
     * Handle subscription to private topics _after_ authentication successfully completes asynchronously.
     *
     * Only used for exchanges that require auth before sending private topic subscription requests
     */
    onWsAuthenticated(wsKey, event) {
        const wsState = this.wsStore.get(wsKey, true);
        wsState.isAuthenticated = true;
        // Resolve & cleanup deferred "connection attempt in progress" promise
        try {
            const inProgressPromise = this.wsStore.getAuthenticationInProgressPromise(wsKey);
            if (inProgressPromise === null || inProgressPromise === void 0 ? void 0 : inProgressPromise.resolve) {
                inProgressPromise.resolve({
                    wsKey,
                    event,
                });
            }
        }
        catch (e) {
            this.logger.error('Exception trying to resolve "connectionInProgress" promise', e);
        }
        // Remove before continuing, in case there's more requests queued
        this.wsStore.removeAuthenticationInProgressPromise(wsKey);
        if (this.options.authPrivateConnectionsOnConnect) {
            const topics = [...this.wsStore.getTopics(wsKey)];
            const privateTopics = topics.filter((topic) => this.isPrivateTopicRequest(topic, wsKey));
            if (privateTopics.length) {
                this.subscribeTopicsForWsKey(privateTopics, wsKey);
            }
        }
    }
    onWsMessage(event, wsKey, ws) {
        try {
            // console.log('onMessageRaw: ', (event as any).data);
            // any message can clear the pong timer - wouldn't get a message if the ws wasn't working
            this.clearPongTimer(wsKey);
            if (this.isWsPong(event)) {
                this.logger.trace('Received pong', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey, event: event === null || event === void 0 ? void 0 : event.data }));
                return;
            }
            if (this.isWsPing(event)) {
                this.logger.trace('Received ping', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey,
                    event }));
                this.sendPongEvent(wsKey, ws);
                return;
            }
            if ((0, types_1.isMessageEvent)(event)) {
                const data = event.data;
                const dataType = event.type;
                const emittableEvents = this.resolveEmittableEvents(wsKey, event);
                if (!emittableEvents.length) {
                    // console.log(`raw event: `, { data, dataType, emittableEvents });
                    this.logger.error('Unhandled/unrecognised ws event message - returned no emittable data', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { message: data || 'no message', dataType,
                        event,
                        wsKey }));
                    return this.emit('update', Object.assign(Object.assign({}, event), { wsKey }));
                }
                for (const emittable of emittableEvents) {
                    if (this.isWsPong(emittable)) {
                        this.logger.trace('Received pong2', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey,
                            data }));
                        continue;
                    }
                    const emittableFinalEvent = Object.assign(Object.assign({}, emittable.event), { wsKey, isWSAPIResponse: emittable.isWSAPIResponse });
                    if (emittable.eventType === 'authenticated') {
                        this.logger.trace('Successfully authenticated', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey,
                            emittable }));
                        this.emit(emittable.eventType, emittableFinalEvent);
                        this.onWsAuthenticated(wsKey, emittable.event);
                        continue;
                    }
                    // this.logger.trace(
                    //   `onWsMessage().emit(${emittable.eventType})`,
                    //   emittableFinalEvent,
                    // );
                    try {
                        this.emit(emittable.eventType, emittableFinalEvent);
                    }
                    catch (e) {
                        this.logger.error(`Exception in onWsMessage().emit(${emittable.eventType}) handler:`, e);
                    }
                    // this.logger.trace(
                    //   `onWsMessage().emit(${emittable.eventType}).done()`,
                    //   emittableFinalEvent,
                    // );
                }
                return;
            }
            this.logger.error('Unhandled/unrecognised ws event message - unexpected message format', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { message: event || 'no message', event,
                wsKey }));
        }
        catch (e) {
            this.logger.error('Failed to parse ws event message', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { error: e, event,
                wsKey }));
        }
    }
    onWsClose(event, wsKey) {
        this.logger.info('Websocket connection closed', Object.assign(Object.assign({}, websockets_1.WS_LOGGER_CATEGORY), { wsKey }));
        const wsState = this.wsStore.get(wsKey, true);
        wsState.isAuthenticated = false;
        if (this.wsStore.getConnectionState(wsKey) !== websockets_1.WsConnectionStateEnum.CLOSING) {
            this.logger.trace(`onWsClose(${wsKey}): rejecting all deferred promises...`);
            // clean up any pending promises for this connection
            this.getWsStore().rejectAllDeferredPromises(wsKey, 'connection lost, reconnecting');
            this.clearTopicsPendingSubscriptions(wsKey, true, 'WS Closed');
            this.setWsState(wsKey, websockets_1.WsConnectionStateEnum.INITIAL);
            this.reconnectWithDelay(wsKey, this.options.reconnectTimeout);
            this.emit('reconnect', { wsKey, event });
        }
        else {
            // clean up any pending promises for this connection
            this.logger.trace(`onWsClose(${wsKey}): rejecting all deferred promises...`);
            this.getWsStore().rejectAllDeferredPromises(wsKey, 'disconnected');
            this.setWsState(wsKey, websockets_1.WsConnectionStateEnum.INITIAL);
            this.emit('close', { wsKey, event });
        }
    }
    getWs(wsKey) {
        return this.wsStore.getWs(wsKey);
    }
    setWsState(wsKey, state) {
        this.wsStore.setConnectionState(wsKey, state);
    }
    /**
     * Promise-driven method to assert that a ws has successfully connected (will await until connection is open)
     */
    assertIsConnected(wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.getWsStore().isConnectionState(wsKey, websockets_1.WsConnectionStateEnum.CONNECTED);
            if (!isConnected) {
                const inProgressPromise = this.getWsStore().getConnectionInProgressPromise(wsKey);
                // Already in progress? Await shared promise and retry
                if (inProgressPromise) {
                    this.logger.trace('assertIsConnected(): awaiting...');
                    yield inProgressPromise.promise;
                    this.logger.trace('assertIsConnected(): connected!');
                    return inProgressPromise.promise;
                }
                // Start connection, it should automatically store/return a promise.
                this.logger.trace('assertIsConnected(): connecting...');
                yield this.connect(wsKey);
                this.logger.trace('assertIsConnected(): newly connected!');
            }
        });
    }
    /**
     * Promise-driven method to assert that a ws has been successfully authenticated (will await until auth is confirmed)
     */
    assertIsAuthenticated(wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const isConnected = this.getWsStore().isConnectionState(wsKey, websockets_1.WsConnectionStateEnum.CONNECTED);
            if (!isConnected) {
                this.logger.trace('assertIsAuthenticated(): connecting...');
                yield this.assertIsConnected(wsKey);
            }
            const inProgressPromise = this.getWsStore().getAuthenticationInProgressPromise(wsKey);
            // Already in progress? Await shared promise and retry
            if (inProgressPromise) {
                this.logger.trace('assertIsAuthenticated(): awaiting...');
                yield inProgressPromise.promise;
                this.logger.trace('assertIsAuthenticated(): authenticated!');
                return;
            }
            const isAuthenticated = (_a = this.wsStore.get(wsKey)) === null || _a === void 0 ? void 0 : _a.isAuthenticated;
            if (isAuthenticated) {
                this.logger.trace('assertIsAuthenticated(): ok');
                return;
            }
            // Start authentication, it should automatically store/return a promise.
            this.logger.trace('assertIsAuthenticated(): authenticating...');
            yield this.sendAuthRequest(wsKey);
            this.logger.trace('assertIsAuthenticated(): newly authenticated!');
        });
    }
}
exports.BaseWebsocketClient = BaseWebsocketClient;
//# sourceMappingURL=BaseWSClient.js.map