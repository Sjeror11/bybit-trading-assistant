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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketClient = void 0;
const util_1 = require("./util");
const BaseWSClient_1 = require("./util/BaseWSClient");
const webCryptoAPI_1 = require("./util/webCryptoAPI");
class WebsocketClient extends BaseWSClient_1.BaseWebsocketClient {
    /**
     * Request connection of all dependent (public & private) websockets, instead of waiting
     * for automatic connection by SDK.
     */
    connectAll() {
        switch (this.options.market) {
            case 'v5': {
                return [...this.connectPublic(), this.connectPrivate()];
            }
            default: {
                throw (0, util_1.neverGuard)(this.options.market, 'connectAll(): Unhandled market');
            }
        }
    }
    /**
     * Ensures the WS API connection is active and ready.
     *
     * You do not need to call this, but if you call this before making any WS API requests,
     * it can accelerate the first request (by preparing the connection in advance).
     */
    connectWSAPI() {
        /** This call automatically ensures the connection is active AND authenticated before resolving */
        return this.assertIsAuthenticated(util_1.WS_KEY_MAP.v5PrivateTrade);
    }
    connectPublic() {
        switch (this.options.market) {
            case 'v5':
            default: {
                return [
                    this.connect(util_1.WS_KEY_MAP.v5SpotPublic),
                    this.connect(util_1.WS_KEY_MAP.v5LinearPublic),
                    this.connect(util_1.WS_KEY_MAP.v5InversePublic),
                    this.connect(util_1.WS_KEY_MAP.v5OptionPublic),
                ];
            }
        }
    }
    connectPrivate() {
        switch (this.options.market) {
            case 'v5':
            default: {
                return this.connect(util_1.WS_KEY_MAP.v5Private);
            }
        }
    }
    /**
     * Subscribe to V5 topics & track/persist them.
     * @param wsTopics - topic or list of topics
     * @param category - the API category this topic is for (e.g. "linear").
     * The value is only important when connecting to public topics and will be ignored for private topics.
     * @param isPrivateTopic - optional - the library will try to detect private topics, you can use this
     * to mark a topic as private (if the topic isn't recognised yet)
     */
    subscribeV5(wsTopics, category, isPrivateTopic) {
        const topicRequests = Array.isArray(wsTopics) ? wsTopics : [wsTopics];
        const perWsKeyTopics = {};
        // Sort into per-WsKey batches, in case there is a mix of topics here
        for (const topic of topicRequests) {
            const derivedWsKey = (0, util_1.getWsKeyForTopic)(this.options.market, topic, isPrivateTopic, category);
            const wsRequest = {
                topic: topic,
                category: category,
            };
            if (!perWsKeyTopics[derivedWsKey] ||
                !Array.isArray(perWsKeyTopics[derivedWsKey])) {
                perWsKeyTopics[derivedWsKey] = [];
            }
            perWsKeyTopics[derivedWsKey].push(wsRequest);
        }
        const promises = [];
        // Batch sub topics per ws key
        for (const wsKey in perWsKeyTopics) {
            const wsKeyTopicRequests = perWsKeyTopics[wsKey];
            if (wsKeyTopicRequests === null || wsKeyTopicRequests === void 0 ? void 0 : wsKeyTopicRequests.length) {
                const requestPromise = this.subscribeTopicsForWsKey(wsKeyTopicRequests, wsKey);
                if (Array.isArray(requestPromise)) {
                    promises.push(...requestPromise);
                }
                else {
                    promises.push(requestPromise);
                }
            }
        }
        // Return promise to resolve midflight WS request (only works if already connected before request)
        return promises;
    }
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
    unsubscribeV5(wsTopics, category, isPrivateTopic) {
        const topicRequests = Array.isArray(wsTopics) ? wsTopics : [wsTopics];
        const perWsKeyTopics = {};
        // Sort into per-WsKey batches, in case there is a mix of topics here
        for (const topic of topicRequests) {
            const derivedWsKey = (0, util_1.getWsKeyForTopic)(this.options.market, topic, isPrivateTopic, category);
            const wsRequest = {
                topic: topic,
                category: category,
            };
            if (!perWsKeyTopics[derivedWsKey] ||
                !Array.isArray(perWsKeyTopics[derivedWsKey])) {
                perWsKeyTopics[derivedWsKey] = [];
            }
            perWsKeyTopics[derivedWsKey].push(wsRequest);
        }
        const promises = [];
        // Batch sub topics per ws key
        for (const wsKey in perWsKeyTopics) {
            const wsKeyTopicRequests = perWsKeyTopics[wsKey];
            if (wsKeyTopicRequests === null || wsKeyTopicRequests === void 0 ? void 0 : wsKeyTopicRequests.length) {
                const requestPromise = this.unsubscribeTopicsForWsKey(wsKeyTopicRequests, wsKey);
                if (Array.isArray(requestPromise)) {
                    promises.push(...requestPromise);
                }
                else {
                    promises.push(requestPromise);
                }
            }
        }
        // Return promise to resolve midflight WS request (only works if already connected before request)
        return promises;
    }
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
    subscribe(requests, wsKey) {
        const topicRequests = Array.isArray(requests) ? requests : [requests];
        const normalisedTopicRequests = (0, util_1.getNormalisedTopicRequests)(topicRequests);
        const perWsKeyTopics = (0, util_1.getTopicsPerWSKey)(this.options.market, normalisedTopicRequests, wsKey);
        // Batch sub topics per ws key
        for (const wsKey in perWsKeyTopics) {
            const wsKeyTopicRequests = perWsKeyTopics[wsKey];
            if (wsKeyTopicRequests === null || wsKeyTopicRequests === void 0 ? void 0 : wsKeyTopicRequests.length) {
                this.subscribeTopicsForWsKey(wsKeyTopicRequests, wsKey);
            }
        }
    }
    /**
     * Note: unsubscribe() might be simpler to use. The end result is the same.
     * Unsubscribe from one or more topics. Similar to subscribe() but in reverse.
     *
     * - Requests are automatically routed to the correct websocket connection.
     * - These topics will be removed from the topic cache, so they won't be subscribed to again.
     */
    unsubscribe(requests, wsKey) {
        const topicRequests = Array.isArray(requests) ? requests : [requests];
        const normalisedTopicRequests = (0, util_1.getNormalisedTopicRequests)(topicRequests);
        const perWsKeyTopics = (0, util_1.getTopicsPerWSKey)(this.options.market, normalisedTopicRequests, wsKey);
        // Batch sub topics per ws key
        for (const wsKey in perWsKeyTopics) {
            const wsKeyTopicRequests = perWsKeyTopics[wsKey];
            if (wsKeyTopicRequests === null || wsKeyTopicRequests === void 0 ? void 0 : wsKeyTopicRequests.length) {
                this.unsubscribeTopicsForWsKey(wsKeyTopicRequests, wsKey);
            }
        }
    }
    sendWSAPIRequest() {
        return __awaiter(this, arguments, void 0, function* (wsKey = util_1.WS_KEY_MAP.v5PrivateTrade, operation, params) {
            this.logger.trace(`sendWSAPIRequest(): assert "${wsKey}" is connected`);
            yield this.assertIsConnected(wsKey);
            this.logger.trace('sendWSAPIRequest()->assertIsConnected() ok');
            yield this.assertIsAuthenticated(wsKey);
            this.logger.trace('sendWSAPIRequest()->assertIsAuthenticated() ok');
            const requestEvent = {
                reqId: this.getNewRequestId(),
                header: {
                    'X-BAPI-RECV-WINDOW': `${this.options.recvWindow}`,
                    'X-BAPI-TIMESTAMP': `${Date.now()}`,
                    Referer: util_1.APIID,
                },
                op: operation,
                args: [params],
            };
            // Sign, if needed
            const signedEvent = yield this.signWSAPIRequest(requestEvent);
            // Store deferred promise, resolved within the "resolveEmittableEvents" method while parsing incoming events
            const promiseRef = (0, util_1.getPromiseRefForWSAPIRequest)(requestEvent);
            const deferredPromise = this.getWsStore().createDeferredPromise(wsKey, promiseRef, false);
            this.logger.trace(`sendWSAPIRequest(): sending raw request: ${JSON.stringify(signedEvent, null, 2)}`);
            // Send event
            this.tryWsSend(wsKey, JSON.stringify(signedEvent));
            this.logger.trace(`sendWSAPIRequest(): sent ${operation} event`);
            // Return deferred promise, so caller can await this call
            return deferredPromise.promise;
        });
    }
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
    getWsUrl(wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const wsBaseURL = (0, util_1.getWsUrl)(wsKey, this.options, this.logger);
            // If auth is needed for this wsKey URL, this returns a suffix
            const authParams = yield this.getWsAuthURLSuffix();
            if (!authParams) {
                return wsBaseURL;
            }
            return wsBaseURL + '?' + authParams;
        });
    }
    /**
     * Return params required to make authorized request
     */
    getWsAuthURLSuffix() {
        return __awaiter(this, void 0, void 0, function* () {
            return '';
        });
    }
    signMessage(paramsStr, secret, method, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.options.customSignMessageFn === 'function') {
                return this.options.customSignMessageFn(paramsStr, secret);
            }
            return yield (0, webCryptoAPI_1.signMessage)(paramsStr, secret, method, algorithm);
        });
    }
    getWsAuthRequestEvent(wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { signature, expiresAt } = yield this.getWsAuthSignature(wsKey);
                const request = {
                    op: 'auth',
                    args: [this.options.key, expiresAt, signature],
                    req_id: `${wsKey}-auth`,
                };
                return request;
            }
            catch (e) {
                this.logger.error(e, Object.assign(Object.assign({}, util_1.WS_LOGGER_CATEGORY), { wsKey }));
                throw e;
            }
        });
    }
    getWsAuthSignature(wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, secret } = this.options;
            if (!key || !secret) {
                this.logger.error('Cannot authenticate websocket, either api or private keys missing.', Object.assign(Object.assign({}, util_1.WS_LOGGER_CATEGORY), { wsKey }));
                throw new Error('Cannot auth - missing api or secret in config');
            }
            this.logger.trace("Getting auth'd request params", Object.assign(Object.assign({}, util_1.WS_LOGGER_CATEGORY), { wsKey }));
            const recvWindow = this.options.recvWindow || 5000;
            const signatureExpiresAt = Date.now() + this.getTimeOffsetMs() + recvWindow;
            const signature = yield this.signMessage('GET/realtime' + signatureExpiresAt, secret, 'hex', 'SHA-256');
            return {
                expiresAt: signatureExpiresAt,
                signature,
            };
        });
    }
    signWSAPIRequest(requestEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not needed for Bybit. Auth happens only on connection open, automatically.
            return requestEvent;
        });
    }
    sendPingEvent(wsKey) {
        this.tryWsSend(wsKey, JSON.stringify({ op: 'ping' }));
    }
    sendPongEvent(wsKey) {
        this.tryWsSend(wsKey, JSON.stringify({ op: 'pong' }));
    }
    /** Force subscription requests to be sent in smaller batches, if a number is returned */
    getMaxTopicsPerSubscribeEvent(wsKey) {
        return (0, util_1.getMaxTopicsPerSubscribeEvent)(this.options.market, wsKey);
    }
    /**
     * @returns one or more correctly structured request events for performing a operations over WS. This can vary per exchange spec.
     */
    getWsRequestEvents(market, operation, requests, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const wsRequestEvents = [];
            const wsRequestBuildingErrors = [];
            switch (market) {
                case 'all': {
                    const topics = requests.map((r) => r.topic);
                    // Previously used to track topics in a request. Keeping this for subscribe/unsubscribe requests, no need for incremental values
                    const req_id = ['subscribe', 'unsubscribe'].includes(operation) && topics.length
                        ? topics.join(',')
                        : this.getNewRequestId();
                    const wsEvent = {
                        req_id: req_id,
                        op: operation,
                        args: topics,
                    };
                    const midflightWsEvent = {
                        requestKey: wsEvent.req_id,
                        requestEvent: wsEvent,
                    };
                    wsRequestEvents.push(Object.assign({}, midflightWsEvent));
                    break;
                }
                default: {
                    throw (0, util_1.neverGuard)(market, `Unhandled market "${market}"`);
                }
            }
            if (wsRequestBuildingErrors.length) {
                const label = wsRequestBuildingErrors.length === requests.length ? 'all' : 'some';
                this.logger.error(`Failed to build/send ${wsRequestBuildingErrors.length} event(s) for ${label} WS requests due to exceptions`, Object.assign(Object.assign({}, util_1.WS_LOGGER_CATEGORY), { wsRequestBuildingErrors, wsRequestBuildingErrorsStringified: JSON.stringify(wsRequestBuildingErrors, null, 2) }));
            }
            return wsRequestEvents;
        });
    }
    getPrivateWSKeys() {
        return util_1.WS_AUTH_ON_CONNECT_KEYS;
    }
    isAuthOnConnectWsKey(wsKey) {
        return util_1.WS_AUTH_ON_CONNECT_KEYS.includes(wsKey);
    }
    /**
     * Determines if a topic is for a private channel, using a hardcoded list of strings
     */
    isPrivateTopicRequest(request) {
        var _a;
        const topicName = (_a = request === null || request === void 0 ? void 0 : request.topic) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!topicName) {
            return false;
        }
        return (0, util_1.isPrivateWsTopic)(topicName);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isWsPing(msg) {
        if (!msg) {
            return false;
        }
        if (typeof (msg === null || msg === void 0 ? void 0 : msg.data) === 'string') {
            if (msg.data.includes('op": "ping')) {
                return true;
            }
            return false;
        }
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isWsPong(msg) {
        var _a;
        if (!msg) {
            return false;
        }
        if (typeof (msg === null || msg === void 0 ? void 0 : msg.data) === 'string') {
            // public ws connections
            if (msg.data.includes('ret_msg":"pong')) {
                return true;
            }
            // private ws connections
            if (msg.data.includes('op":"pong')) {
                return true;
            }
            return false;
        }
        if (((_a = msg.event) === null || _a === void 0 ? void 0 : _a.ret_msg) === 'pong') {
            return true;
        }
        return (msg === null || msg === void 0 ? void 0 : msg.pong) || (0, util_1.isWsPong)(msg);
    }
    /**
     * Abstraction called to sort ws events into emittable event types (response to a request, data update, etc)
     */
    resolveEmittableEvents(wsKey, event) {
        const results = [];
        try {
            const parsed = JSON.parse(event.data);
            // this.logger.trace('resolveEmittableEvents', {
            //   ...WS_LOGGER_CATEGORY,
            //   wsKey,
            //   parsed: JSON.stringify(parsed),
            // });
            // Only applies to the V5 WS topics
            if ((0, util_1.isTopicSubscriptionConfirmation)(parsed) && parsed.req_id) {
                const isTopicSubscriptionSuccessEvent = (0, util_1.isTopicSubscriptionSuccess)(parsed);
                this.updatePendingTopicSubscriptionStatus(wsKey, parsed.req_id, parsed, isTopicSubscriptionSuccessEvent);
            }
            const EVENTS_AUTHENTICATED = ['auth'];
            const EVENTS_RESPONSES = [
                'subscribe',
                'unsubscribe',
                'COMMAND_RESP',
                'ping',
                'pong',
            ];
            const eventTopic = parsed === null || parsed === void 0 ? void 0 : parsed.topic;
            const eventOperation = parsed === null || parsed === void 0 ? void 0 : parsed.op;
            // WS API response
            if ((0, util_1.isWSAPIResponse)(parsed)) {
                const retCode = parsed.retCode;
                const reqId = parsed.reqId;
                const isError = retCode !== 0;
                const promiseRef = [parsed.op, reqId].join('_');
                if (!reqId) {
                    this.logger.error('WS API response is missing reqId - promisified workflow could get stuck. If this happens, please get in touch with steps to reproduce. Trace:', {
                        wsKey,
                        promiseRef,
                        parsedEvent: parsed,
                    });
                }
                // WS API Exception
                if (isError) {
                    try {
                        this.getWsStore().rejectDeferredPromise(wsKey, promiseRef, Object.assign({ wsKey }, parsed), true);
                    }
                    catch (e) {
                        this.logger.error('Exception trying to reject WSAPI promise', {
                            wsKey,
                            promiseRef,
                            parsedEvent: parsed,
                        });
                    }
                    results.push({
                        eventType: 'exception',
                        event: parsed,
                        isWSAPIResponse: true,
                    });
                    return results;
                }
                // WS API Success
                try {
                    this.getWsStore().resolveDeferredPromise(wsKey, promiseRef, Object.assign({ wsKey }, parsed), true);
                }
                catch (e) {
                    this.logger.error('Exception trying to resolve WSAPI promise', {
                        wsKey,
                        promiseRef,
                        parsedEvent: parsed,
                    });
                }
                results.push({
                    eventType: 'response',
                    event: parsed,
                    isWSAPIResponse: true,
                });
                return results;
            }
            // Messages for a subscribed topic all include the "topic" property
            if (typeof eventTopic === 'string') {
                results.push({
                    eventType: 'update',
                    event: parsed,
                });
                return results;
            }
            // Messages that are a "reply" to a request/command (e.g. subscribe to these topics) typically include the "op" property
            if (typeof eventOperation === 'string') {
                // Failed request
                if (parsed.success === false) {
                    results.push({
                        eventType: 'exception',
                        event: parsed,
                    });
                    return results;
                }
                // These are r  equest/reply pattern events (e.g. after subscribing to topics or authenticating)
                if (EVENTS_RESPONSES.includes(eventOperation)) {
                    results.push({
                        eventType: 'response',
                        event: parsed,
                    });
                    return results;
                }
                // Request/reply pattern for authentication success
                if (EVENTS_AUTHENTICATED.includes(eventOperation)) {
                    results.push({
                        eventType: 'authenticated',
                        event: parsed,
                    });
                    return results;
                }
                this.logger.error(`!! Unhandled string operation type "${eventOperation}". Defaulting to "update" channel...`, parsed);
            }
            else {
                this.logger.error(`!! Unhandled non-string event type "${eventOperation}". Defaulting to "update" channel...`, parsed);
            }
            // In case of catastrophic failure, fallback to noisy emit update
            results.push({
                eventType: 'update',
                event: parsed,
            });
        }
        catch (e) {
            results.push({
                event: {
                    message: 'Failed to parse event data due to exception',
                    exception: e,
                    eventData: event.data,
                },
                eventType: 'exception',
            });
            this.logger.error('Failed to parse event data due to exception: ', {
                exception: e,
                eventData: event.data,
            });
        }
        return results;
    }
}
exports.WebsocketClient = WebsocketClient;
//# sourceMappingURL=websocket-client.js.map