"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REST_CLIENT_TYPE_ENUM = exports.APIID = void 0;
exports.serializeParams = serializeParams;
exports.getRestBaseUrl = getRestBaseUrl;
exports.isWsPong = isWsPong;
exports.parseRateLimitHeaders = parseRateLimitHeaders;
/**
 * Serialise a (flat) object into a query string
 * @param params the object to serialise
 * @param strict_validation throw if any properties are undefined
 * @param sortProperties sort properties alphabetically before building a query string
 * @param encodeSerialisedValues URL encode value before serialising
 * @returns the params object as a serialised string key1=value1&key2=value2&etc
 */
function serializeParams(params = {}, strict_validation = false, sortProperties = true, encodeSerialisedValues = true) {
    const properties = sortProperties
        ? Object.keys(params).sort()
        : Object.keys(params);
    return properties
        .map((key) => {
        const value = encodeSerialisedValues
            ? encodeURIComponent(params[key])
            : params[key];
        if (strict_validation === true && typeof value === 'undefined') {
            throw new Error('Failed to sign API request due to undefined parameter');
        }
        return `${key}=${value}`;
    })
        .join('&');
}
function getRestBaseUrl(useTestnet, restClientOptions) {
    const exchangeBaseUrls = {
        livenet: {
            default: 'https://api.bybit.com',
            bytick: 'https://api.bytick.com',
            NL: 'https://api.bybit.nl',
            HK: 'https://api.byhkbit.com',
            TK: 'https://api.bybit-tr.com',
        },
        testnet: 'https://api-testnet.bybit.com',
        demoLivenet: 'https://api-demo.bybit.com',
    };
    if (restClientOptions.baseUrl) {
        return restClientOptions.baseUrl;
    }
    if (restClientOptions.demoTrading) {
        return exchangeBaseUrls.demoLivenet;
    }
    if (useTestnet) {
        return exchangeBaseUrls.testnet;
    }
    if (restClientOptions.apiRegion) {
        const regionalBaseURL = exchangeBaseUrls.livenet[restClientOptions.apiRegion];
        if (!regionalBaseURL) {
            throw new Error(`No base URL found for region "${restClientOptions.apiRegion}". Check that your "apiRegion" value is valid.`);
        }
        return regionalBaseURL;
    }
    return exchangeBaseUrls.livenet.default;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isWsPong(msg) {
    if (!msg) {
        return false;
    }
    if (msg.pong || msg.ping) {
        return true;
    }
    if (msg['op'] === 'pong') {
        return true;
    }
    if (msg['ret_msg'] === 'pong') {
        return true;
    }
    return (msg.request &&
        msg.request.op === 'ping' &&
        msg.ret_msg === 'pong' &&
        msg.success === true);
}
exports.APIID = 'bybitapinode';
/**
 * Used to switch how authentication/requests work under the hood (primarily for SPOT since it's different there)
 */
exports.REST_CLIENT_TYPE_ENUM = {
    v5: 'v5',
};
/** Parse V5 rate limit response headers, if enabled */
function parseRateLimitHeaders(headers, throwOnFailedRateLimitParse) {
    try {
        if (!headers || typeof headers !== 'object') {
            return;
        }
        const remaining = headers['x-bapi-limit-status'];
        const max = headers['x-bapi-limit'];
        const resetAt = headers['x-bapi-limit-reset-timestamp'];
        if (typeof remaining === 'undefined' ||
            typeof max === 'undefined' ||
            typeof resetAt === 'undefined') {
            return;
        }
        const result = {
            remainingRequests: Number(remaining),
            maxRequests: Number(max),
            resetAtTimestamp: Number(resetAt),
        };
        if (isNaN(result.remainingRequests) ||
            isNaN(result.maxRequests) ||
            isNaN(result.resetAtTimestamp)) {
            return;
        }
        return result;
    }
    catch (e) {
        if (throwOnFailedRateLimitParse) {
            console.log(new Date(), 'parseRateLimitHeaders()', 'Failed to parse rate limit headers', {
                headers,
                exception: e,
            });
            throw e;
        }
    }
    return undefined;
}
//# sourceMappingURL=requestUtils.js.map