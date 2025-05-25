import { APIResponseV3, numberInString } from './types';
import BaseRestClient from './util/BaseRestClient';
/**
 * REST API client for newer Spot V3 APIs.
 * @deprecated WARNING
 * These endpoints are being switched off gradually and are expected to be completely turned off by the end of 2024.
 * They may stop working at any point before then.
 * Please update your code as soon as possible to use the V5 APIs instead.
 */
export declare class SpotClientV3 extends BaseRestClient {
    getClientType(): "v5";
    fetchServerTime(): Promise<number>;
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
    getMergedOrderBook(symbol: string, scale?: number, limit?: number): Promise<APIResponseV3<any>>;
    /**
     *
     * API Data Endpoints
     *
     */
    getServerTime(): Promise<{
        time_now: numberInString;
    }>;
}
