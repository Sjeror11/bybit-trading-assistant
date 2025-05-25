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
exports.SpotClientV3 = void 0;
const util_1 = require("./util");
const BaseRestClient_1 = __importDefault(require("./util/BaseRestClient"));
/**
 * REST API client for newer Spot V3 APIs.
 * @deprecated WARNING
 * These endpoints are being switched off gradually and are expected to be completely turned off by the end of 2024.
 * They may stop working at any point before then.
 * Please update your code as soon as possible to use the V5 APIs instead.
 */
class SpotClientV3 extends BaseRestClient_1.default {
    getClientType() {
        // Doesn't really matter here, since the only remaining endpoint does not require auth.
        return util_1.REST_CLIENT_TYPE_ENUM.v5;
    }
    fetchServerTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.getServerTime();
            return Number(res.time_now);
        });
    }
    /**
     *
     * Market Data Endpoints
     *
     */
    /**
     * Get merged orderbook for symbol
     *
     * This is the only known pre-V5 endpoint to still be online.
     */
    getMergedOrderBook(symbol, scale, limit) {
        return this.get('/spot/v3/public/quote/depth/merged', {
            symbol,
            scale,
            limit,
        });
    }
    /**
     *
     * API Data Endpoints
     *
     */
    getServerTime() {
        return this.get('/v2/public/time');
    }
}
exports.SpotClientV3 = SpotClientV3;
//# sourceMappingURL=spot-client-v3.js.map