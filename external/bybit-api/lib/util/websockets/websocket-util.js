"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS_ERROR_ENUM = exports.WS_BASE_URL_MAP = exports.PUBLIC_WS_KEYS = exports.WS_AUTH_ON_CONNECT_KEYS = exports.WS_KEY_MAP = exports.WS_LOGGER_CATEGORY = void 0;
exports.isPrivateWsTopic = isPrivateWsTopic;
exports.getWsKeyForTopic = getWsKeyForTopic;
exports.getWsUrl = getWsUrl;
exports.getMaxTopicsPerSubscribeEvent = getMaxTopicsPerSubscribeEvent;
exports.safeTerminateWs = safeTerminateWs;
exports.getPromiseRefForWSAPIRequest = getPromiseRefForWSAPIRequest;
exports.getNormalisedTopicRequests = getNormalisedTopicRequests;
exports.getTopicsPerWSKey = getTopicsPerWSKey;
const typeGuards_1 = require("../typeGuards");
exports.WS_LOGGER_CATEGORY = { category: 'bybit-ws' };
exports.WS_KEY_MAP = {
    v5SpotPublic: 'v5SpotPublic',
    v5LinearPublic: 'v5LinearPublic',
    v5InversePublic: 'v5InversePublic',
    v5OptionPublic: 'v5OptionPublic',
    v5Private: 'v5Private',
    /**
     * The V5 Websocket API (for sending orders over WS)
     */
    v5PrivateTrade: 'v5PrivateTrade',
};
exports.WS_AUTH_ON_CONNECT_KEYS = [
    exports.WS_KEY_MAP.v5Private,
    exports.WS_KEY_MAP.v5PrivateTrade,
];
exports.PUBLIC_WS_KEYS = [
    exports.WS_KEY_MAP.v5SpotPublic,
    exports.WS_KEY_MAP.v5LinearPublic,
    exports.WS_KEY_MAP.v5InversePublic,
    exports.WS_KEY_MAP.v5OptionPublic,
];
/** Used to automatically determine if a sub request should be to the public or private ws (when there's two) */
const PRIVATE_TOPICS = [
    'stop_order',
    'outboundAccountInfo',
    'executionReport',
    'ticketInfo',
    // copy trading apis
    'copyTradePosition',
    'copyTradeOrder',
    'copyTradeExecution',
    'copyTradeWallet',
    // usdc options
    'user.openapi.option.position',
    'user.openapi.option.trade',
    'user.order',
    'user.openapi.option.order',
    'user.service',
    'user.openapi.greeks',
    'user.mmp.event',
    // usdc perps
    'user.openapi.perp.position',
    'user.openapi.perp.trade',
    'user.openapi.perp.order',
    'user.service',
    // unified margin
    'user.position.unifiedAccount',
    'user.execution.unifiedAccount',
    'user.order.unifiedAccount',
    'user.wallet.unifiedAccount',
    'user.greeks.unifiedAccount',
    // contract v3
    'user.position.contractAccount',
    'user.execution.contractAccount',
    'user.order.contractAccount',
    'user.wallet.contractAccount',
    // v5
    'position',
    'execution',
    'order',
    'wallet',
    'greeks',
    // v5 fast execution topics are private
    'execution.fast',
    'execution.fast.linear',
    'execution.fast.inverse',
    'execution.fast.spot',
];
exports.WS_BASE_URL_MAP = {
    v5: {
        public: {
            livenet: 'public topics are routed internally via the public wskeys',
            testnet: 'public topics are routed internally via the public wskeys',
        },
        private: {
            livenet: 'wss://stream.bybit.com/v5/private',
            testnet: 'wss://stream-testnet.bybit.com/v5/private',
        },
    },
    v5PrivateTrade: {
        public: {
            livenet: 'public topics are routed internally via the public wskeys',
            testnet: 'public topics are routed internally via the public wskeys',
        },
        private: {
            livenet: 'wss://stream.bybit.com/v5/trade',
            testnet: 'wss://stream-testnet.bybit.com/v5/trade',
        },
    },
    v5SpotPublic: {
        public: {
            livenet: 'wss://stream.bybit.com/v5/public/spot',
            testnet: 'wss://stream-testnet.bybit.com/v5/public/spot',
        },
    },
    v5LinearPublic: {
        public: {
            livenet: 'wss://stream.bybit.com/v5/public/linear',
            testnet: 'wss://stream-testnet.bybit.com/v5/public/linear',
        },
    },
    v5InversePublic: {
        public: {
            livenet: 'wss://stream.bybit.com/v5/public/inverse',
            testnet: 'wss://stream-testnet.bybit.com/v5/public/inverse',
        },
    },
    v5OptionPublic: {
        public: {
            livenet: 'wss://stream.bybit.com/v5/public/option',
            testnet: 'wss://stream-testnet.bybit.com/v5/public/option',
        },
    },
};
function isPrivateWsTopic(topic) {
    return PRIVATE_TOPICS.includes(topic);
}
function getWsKeyForTopic(market, topic, isPrivate, category) {
    const isPrivateTopic = isPrivate === true || PRIVATE_TOPICS.includes(topic);
    switch (market) {
        case 'v5': {
            if (isPrivateTopic) {
                return exports.WS_KEY_MAP.v5Private;
            }
            switch (category) {
                case 'spot': {
                    return exports.WS_KEY_MAP.v5SpotPublic;
                }
                case 'linear': {
                    return exports.WS_KEY_MAP.v5LinearPublic;
                }
                case 'inverse': {
                    return exports.WS_KEY_MAP.v5InversePublic;
                }
                case 'option': {
                    return exports.WS_KEY_MAP.v5OptionPublic;
                }
                case undefined: {
                    throw new Error('Category cannot be undefined');
                }
                default: {
                    throw (0, typeGuards_1.neverGuard)(category, 'getWsKeyForTopic(v5): Unhandled v5 category');
                }
            }
        }
        default: {
            throw (0, typeGuards_1.neverGuard)(market, 'getWsKeyForTopic(): Unhandled market');
        }
    }
}
function getWsUrl(wsKey, wsClientOptions, logger) {
    const wsUrl = wsClientOptions.wsUrl;
    if (wsUrl) {
        return wsUrl;
    }
    // https://bybit-exchange.github.io/docs/v5/demo
    const DEMO_TRADING_ENDPOINT = 'wss://stream-demo.bybit.com/v5/private';
    const isDemoTrading = wsClientOptions.demoTrading;
    const isTestnet = wsClientOptions.testnet;
    const networkKey = isTestnet ? 'testnet' : 'livenet';
    switch (wsKey) {
        case exports.WS_KEY_MAP.v5Private: {
            if (isDemoTrading) {
                return DEMO_TRADING_ENDPOINT;
            }
            return exports.WS_BASE_URL_MAP.v5.private[networkKey];
        }
        case exports.WS_KEY_MAP.v5PrivateTrade: {
            if (isDemoTrading) {
                return DEMO_TRADING_ENDPOINT;
            }
            return exports.WS_BASE_URL_MAP[wsKey].private[networkKey];
        }
        case exports.WS_KEY_MAP.v5SpotPublic: {
            return exports.WS_BASE_URL_MAP.v5SpotPublic.public[networkKey];
        }
        case exports.WS_KEY_MAP.v5LinearPublic: {
            return exports.WS_BASE_URL_MAP.v5LinearPublic.public[networkKey];
        }
        case exports.WS_KEY_MAP.v5InversePublic: {
            return exports.WS_BASE_URL_MAP.v5InversePublic.public[networkKey];
        }
        case exports.WS_KEY_MAP.v5OptionPublic: {
            return exports.WS_BASE_URL_MAP.v5OptionPublic.public[networkKey];
        }
        default: {
            logger.error('getWsUrl(): Unhandled wsKey: ', {
                category: 'bybit-ws',
                wsKey,
            });
            throw (0, typeGuards_1.neverGuard)(wsKey, 'getWsUrl(): Unhandled wsKey');
        }
    }
}
function getMaxTopicsPerSubscribeEvent(market, wsKey) {
    switch (market) {
        case 'v5': {
            if (wsKey === exports.WS_KEY_MAP.v5SpotPublic) {
                return 10;
            }
            return null;
        }
        default: {
            throw (0, typeGuards_1.neverGuard)(market, 'getWsKeyForTopic(): Unhandled market');
        }
    }
}
exports.WS_ERROR_ENUM = {
    NOT_AUTHENTICATED_SPOT_V3: '-1004',
    API_ERROR_GENERIC: '10001',
    API_SIGN_AUTH_FAILED: '10003',
    USDC_OPTION_AUTH_FAILED: '3303006',
};
/**
 * #305: ws.terminate() is undefined in browsers.
 * This only works in node.js, not in browsers.
 * Does nothing if `ws` is undefined. Does nothing in browsers.
 */
function safeTerminateWs(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
ws, fallbackToClose) {
    if (!ws) {
        return false;
    }
    if (typeof ws['terminate'] === 'function') {
        ws.terminate();
        return true;
    }
    else if (fallbackToClose) {
        ws.close();
    }
    return false;
}
/**
 * WS API promises are stored using a primary key. This key is constructed using
 * properties found in every request & reply.
 */
function getPromiseRefForWSAPIRequest(requestEvent) {
    const promiseRef = [requestEvent.op, requestEvent.reqId].join('_');
    return promiseRef;
}
/**
 * Users can conveniently pass topics as strings or objects (object has topic name + optional params).
 *
 * This method normalises topics into objects (object has topic name + optional params).
 */
function getNormalisedTopicRequests(wsTopicRequests) {
    const normalisedTopicRequests = [];
    for (const wsTopicRequest of wsTopicRequests) {
        // passed as string, convert to object
        if (typeof wsTopicRequest === 'string') {
            const topicRequest = {
                topic: wsTopicRequest,
                payload: undefined,
            };
            normalisedTopicRequests.push(topicRequest);
            continue;
        }
        // already a normalised object, thanks to user
        normalisedTopicRequests.push(wsTopicRequest);
    }
    return normalisedTopicRequests;
}
/**
 * Groups topics in request into per-wsKey groups
 * @param normalisedTopicRequests
 * @param wsKey
 * @param isPrivateTopic
 * @returns
 */
function getTopicsPerWSKey(market, normalisedTopicRequests, wsKey, isPrivateTopic) {
    const perWsKeyTopics = {};
    // Sort into per wsKey arrays, in case topics are mixed together for different wsKeys
    for (const topicRequest of normalisedTopicRequests) {
        const derivedWsKey = wsKey ||
            getWsKeyForTopic(market, topicRequest.topic, isPrivateTopic, topicRequest.category);
        if (!perWsKeyTopics[derivedWsKey] ||
            !Array.isArray(perWsKeyTopics[derivedWsKey])) {
            perWsKeyTopics[derivedWsKey] = [];
        }
        perWsKeyTopics[derivedWsKey].push(topicRequest);
    }
    return perWsKeyTopics;
}
//# sourceMappingURL=websocket-util.js.map