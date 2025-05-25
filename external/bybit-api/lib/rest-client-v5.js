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
exports.RestClientV5 = void 0;
const util_1 = require("./util");
const BaseRestClient_1 = __importDefault(require("./util/BaseRestClient"));
/**
 * REST API client for V5 REST APIs
 *
 * https://bybit-exchange.github.io/docs/v5/intro
 */
class RestClientV5 extends BaseRestClient_1.default {
    /**
     *
     ****** Custom SDK APIs
     *
     */
    /**
     * This method is used to get the latency and time sync between the client and the server.
     * This is not official API endpoint and is only used for internal testing purposes.
     * Use this method to check the latency and time sync between the client and the server.
     * Final values might vary slightly, but it should be within few ms difference.
     * If you have any suggestions or improvements to this measurement, please create an issue or pull request on GitHub.
     */
    fetchLatencySummary() {
        return __awaiter(this, void 0, void 0, function* () {
            const clientTimeReqStart = Date.now();
            const serverTime = yield this.getServerTime();
            const clientTimeReqEnd = Date.now();
            const serverTimeMs = serverTime.time;
            const roundTripTime = clientTimeReqEnd - clientTimeReqStart;
            const estimatedOneWayLatency = Math.floor(roundTripTime / 2);
            // Adjust server time by adding estimated one-way latency
            const adjustedServerTime = serverTimeMs + estimatedOneWayLatency;
            // Calculate time difference between adjusted server time and local time
            const timeDifference = adjustedServerTime - clientTimeReqEnd;
            const result = {
                localTime: clientTimeReqEnd,
                serverTime: serverTimeMs,
                roundTripTime,
                estimatedOneWayLatency,
                adjustedServerTime,
                timeDifference,
            };
            console.log('Time synchronization results:');
            console.log(result);
            console.log(`Your approximate latency to exchange server:
      One way: ${estimatedOneWayLatency}ms.
      Round trip: ${roundTripTime}ms.
      `);
            if (Math.abs(timeDifference) > 500) {
                console.warn(`WARNING! Time difference between server and client clock is greater than 500ms. It is currently ${timeDifference}ms.
        Consider adjusting your system clock to avoid unwanted clock sync errors!
        Visit https://github.com/tiagosiebler/awesome-crypto-examples/wiki/Timestamp-for-this-request-is-outside-of-the-recvWindow for more information`);
            }
            else {
                console.log(`Time difference between server and client clock is within acceptable range of 500ms. It is currently ${timeDifference}ms.`);
            }
            return result;
        });
    }
    /**
     *
     ****** Misc Bybit APIs
     *
     */
    getClientType() {
        return util_1.REST_CLIENT_TYPE_ENUM.v5;
    }
    fetchServerTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.getServerTime();
            return Number(res.time) / 1000;
        });
    }
    getServerTime() {
        return this.get('/v5/market/time');
    }
    /**
     *
     ****** Demo Account APIs
     *
     */
    requestDemoTradingFunds(params) {
        return this.postPrivate('/v5/account/demo-apply-money', params);
    }
    /**
     * Create a demo trading account.
     */
    createDemoAccount() {
        return this.postPrivate('/v5/user/create-demo-member');
    }
    /**
     *
     ****** Spread Trading APIs
     *
     */
    /**
     * Get Spread Instruments Info
     */
    getSpreadInstrumentsInfo(params) {
        return this.get('/v5/spread/instrument', params);
    }
    /**
     * Get Spread Orderbook
     */
    getSpreadOrderbook(params) {
        return this.get('/v5/spread/orderbook', params);
    }
    /**
     * Get Spread Tickers
     */
    getSpreadTickers(params) {
        return this.get('/v5/spread/tickers', params);
    }
    /**
     * Get Spread Public Recent Trades
     */
    getSpreadRecentTrades(params) {
        return this.get('/v5/spread/recent-trade', params);
    }
    /**
     * Create Spread Order
     */
    submitSpreadOrder(params) {
        return this.postPrivate('/v5/spread/order/create', params);
    }
    /**
     * Amend Spread Order
     * You can only modify unfilled or partially filled orders.
     */
    amendSpreadOrder(params) {
        return this.postPrivate('/v5/spread/order/amend', params);
    }
    /**
     * Cancel Spread Order
     */
    cancelSpreadOrder(params) {
        return this.postPrivate('/v5/spread/order/cancel', params);
    }
    /**
     * Cancel All Spread Orders
     *
     * When a symbol is specified, all orders for that symbol will be canceled regardless of the cancelAll field.
     * When symbol is not specified and cancelAll=true, all orders, regardless of the symbol, will be canceled.
     */
    cancelAllSpreadOrders(params) {
        return this.postPrivate('/v5/spread/order/cancel-all', params);
    }
    /**
     * Get Spread Open Orders
     * Query unfilled or partially filled orders in real-time.
     */
    getSpreadOpenOrders(params) {
        return this.getPrivate('/v5/spread/order/realtime', params);
    }
    /**
     * Get Spread Order History
     *
     * Note:
     * - orderId & orderLinkId has a higher priority than startTime & endTime
     * - Fully canceled orders are stored for up to 24 hours
     * - Single leg orders can also be found with "createType"=CreateByFutureSpread via Get Order History
     */
    getSpreadOrderHistory(params) {
        return this.getPrivate('/v5/spread/order/history', params);
    }
    /**
     * Get Spread Trade History
     *
     * Note:
     * - In self-trade cases, both the maker and taker single-leg trades will be returned in the same request
     * - Single leg executions can also be found with "execType"=FutureSpread via Get Trade History
     */
    getSpreadTradeHistory(params) {
        return this.getPrivate('/v5/spread/execution/list', params);
    }
    /**
     *
     ****** Market APIs
     *
     */
    /**
     * Query the kline data. Charts are returned in groups based on the requested interval.
     *
     * Covers: Spot / Linear contract / Inverse contract
     */
    getKline(params) {
        return this.get('/v5/market/kline', params);
    }
    /**
     * Query the mark price kline data. Charts are returned in groups based on the requested interval.
     *
     * Covers: Linear contract / Inverse contract
     */
    getMarkPriceKline(params) {
        return this.get('/v5/market/mark-price-kline', params);
    }
    /**
     * Query the index price kline data. Charts are returned in groups based on the requested interval.
     *
     * Covers: Linear contract / Inverse contract
     */
    getIndexPriceKline(params) {
        return this.get('/v5/market/index-price-kline', params);
    }
    /**
     * Retrieve the premium index price kline data. Charts are returned in groups based on the requested interval.
     *
     * Covers: Linear contract
     */
    getPremiumIndexPriceKline(params) {
        return this.get('/v5/market/premium-index-price-kline', params);
    }
    /**
     * Query a list of instruments of online trading pair.
     *
     * Covers: Spot / Linear contract / Inverse contract / Option
     *
     * Note: Spot does not support pagination, so limit & cursor are invalid.
     */
    getInstrumentsInfo(params) {
        return this.get('/v5/market/instruments-info', params);
    }
    /**
     * Query orderbook data
     *
     * Covers: Spot / Linear contract / Inverse contract / Option
     */
    getOrderbook(params) {
        return this.get('/v5/market/orderbook', params);
    }
    /**
     * Query the latest price snapshot, best bid/ask price, and trading volume in the last 24 hours.
     *
     * Covers: Spot / Linear contract / Inverse contract / Option
     */
    getTickers(params) {
        return this.get('/v5/market/tickers', params);
    }
    /**
     * Query historical funding rate. Each symbol has a different funding interval.
     *
     * Covers: Linear contract / Inverse perpetual
     */
    getFundingRateHistory(params) {
        return this.get('/v5/market/funding/history', params);
    }
    /**
     * Query recent public trading data in Bybit.
     *
     * Covers: Spot / Linear contract / Inverse contract / Option
     */
    getPublicTradingHistory(params) {
        return this.get('/v5/market/recent-trade', params);
    }
    /**
     * Get open interest of each symbol.
     *
     * Covers: Linear contract / Inverse contract
     */
    getOpenInterest(params) {
        return this.get('/v5/market/open-interest', params);
    }
    /**
     * Query option historical volatility
     * Covers: Option
     */
    getHistoricalVolatility(params) {
        return this.get('/v5/market/historical-volatility', params);
    }
    /**
     * Query Bybit insurance pool data (BTC/USDT/USDC etc). The data is updated every 24 hours.
     */
    getInsurance(params) {
        return this.get('/v5/market/insurance', params);
    }
    /**
     * Query risk limit of futures
     *
     * Covers: Linear contract / Inverse contract
     */
    getRiskLimit(params) {
        return this.get('/v5/market/risk-limit', params);
    }
    /**
     * Get the delivery price for option
     *
     * Covers: Option
     *
     * @deprecated use getDeliveryPrice() instead
     */
    getOptionDeliveryPrice(params) {
        return this.get('/v5/market/delivery-price', params);
    }
    /**
     * Get the delivery price of Inverse futures, USDC futures and Options
     *
     * Covers: USDC futures / Inverse futures / Option
     */
    getDeliveryPrice(params) {
        return this.get('/v5/market/delivery-price', params);
    }
    getLongShortRatio(params) {
        return this.get('/v5/market/account-ratio', params);
    }
    /**
     *
     ****** Trade APIs
     *
     */
    submitOrder(params) {
        return this.postPrivate('/v5/order/create', params);
    }
    amendOrder(params) {
        return this.postPrivate('/v5/order/amend', params);
    }
    cancelOrder(params) {
        return this.postPrivate('/v5/order/cancel', params);
    }
    /**
     * Query unfilled or partially filled orders in real-time. To query older order records, please use the order history interface.
     */
    getActiveOrders(params) {
        return this.getPrivate('/v5/order/realtime', params);
    }
    cancelAllOrders(params) {
        return this.postPrivate('/v5/order/cancel-all', params);
    }
    /**
     * Query order history. As order creation/cancellation is asynchronous, the data returned from this endpoint may delay.
     *
     * If you want to get real-time order information, you could query this endpoint or rely on the websocket stream (recommended).
     */
    getHistoricOrders(params) {
        return this.getPrivate('/v5/order/history', params);
    }
    /**
     * Query users' execution records, sorted by execTime in descending order
     *
     * Unified account covers: Spot / Linear contract / Options
     * Normal account covers: USDT perpetual / Inverse perpetual / Inverse futures
     */
    getExecutionList(params) {
        return this.getPrivate('/v5/execution/list', params);
    }
    /**
     * This endpoint allows you to place more than one order in a single request.
     * Covers: Option (UTA, UTA Pro) / USDT Perpetual, UDSC Perpetual, USDC Futures (UTA Pro)
     *
     * Make sure you have sufficient funds in your account when placing an order.
     * Once an order is placed, according to the funds required by the order,
     * the funds in your account will be frozen by the corresponding amount during the life cycle of the order.
     *
     * A maximum of 20 orders can be placed per request. The returned data list is divided into two lists.
     * The first list indicates whether or not the order creation was successful and the second list details the created order information.
     * The structure of the two lists are completely consistent.
     */
    batchSubmitOrders(category, orders) {
        return this.postPrivate('/v5/order/create-batch', {
            category,
            request: orders,
        });
    }
    /**
     * This endpoint allows you to amend more than one open order in a single request.
     * Covers: Option (UTA, UTA Pro) / USDT Perpetual, UDSC Perpetual, USDC Futures (UTA Pro)
     *
     * You can modify unfilled or partially filled orders. Conditional orders are not supported.
     *
     * A maximum of 20 orders can be amended per request.
     */
    batchAmendOrders(category, orders) {
        return this.postPrivate('/v5/order/amend-batch', {
            category,
            request: orders,
        });
    }
    /**
     * This endpoint allows you to cancel more than one open order in a single request.
     * Covers: Option (UTA, UTA Pro) / USDT Perpetual, UDSC Perpetual, USDC Futures (UTA Pro)
     *
     * You must specify orderId or orderLinkId. If orderId and orderLinkId is not matched, the system will process orderId first.
     *
     * You can cancel unfilled or partially filled orders. A maximum of 20 orders can be cancelled per request.
     */
    batchCancelOrders(category, orders) {
        return this.postPrivate('/v5/order/cancel-batch', {
            category,
            request: orders,
        });
    }
    /**
     * Query the qty and amount of borrowable coins in spot account.
     *
     * Covers: Spot (Unified Account)
     */
    getSpotBorrowCheck(symbol, side) {
        return this.getPrivate('/v5/order/spot-borrow-check', {
            category: 'spot',
            symbol,
            side,
        });
    }
    /**
     * This endpoint allows you to set the disconnection protect time window. Covers: option (unified account).
     *
     * If you need to turn it on/off, you can contact your client manager for consultation and application.
     * The default time window is 10 seconds.
     *
     * Only for institutional clients!
     *
     * If it doesn't work, use v2!
     */
    setDisconnectCancelAllWindow(category, timeWindow) {
        return this.postPrivate('/v5/order/disconnected-cancel-all', {
            category,
            timeWindow,
        });
    }
    /**
     * This endpoint allows you to set the disconnection protect time window. Covers: option (unified account).
     *
     * If you need to turn it on/off, you can contact your client manager for consultation and application.
     * The default time window is 10 seconds.
     *
     * Only for institutional clients!
     */
    setDisconnectCancelAllWindowV2(params) {
        return this.postPrivate('/v5/order/disconnected-cancel-all', params);
    }
    /**
     *
     ****** Position APIs
     *
     */
    /**
     * Query real-time position data, such as position size, cumulative realizedPNL.
     *
     * 0: cross margin. 1: isolated margin
     *
     * Unified account covers: Linear contract / Options
     *
     * Normal account covers: USDT perpetual / Inverse perpetual / Inverse futures
     *
     * Note: this will give a 404 error if you query the `option` category if your account is not unified
     */
    getPositionInfo(params) {
        return this.getPrivate('/v5/position/list', params);
    }
    /**
     * Set the leverage
     *
     * Unified account covers: Linear contract
     *
     * Normal account covers: USDT perpetual / Inverse perpetual / Inverse futures
     *
     * Note: Under one-way mode, buyLeverage must be the same as sellLeverage
     */
    setLeverage(params) {
        return this.postPrivate('/v5/position/set-leverage', params);
    }
    /**
     * Select cross margin mode or isolated margin mode.
     * 0: cross margin. 1: isolated margin
     *
     * Covers: USDT perpetual (Normal account) / Inverse contract (Normal account).
     *
     * Switching margin modes will cause orders in progress to be cancelled.
     * Please make sure that there are no open orders before you switch margin modes.
     */
    switchIsolatedMargin(params) {
        return this.postPrivate('/v5/position/switch-isolated', params);
    }
    /**
     * @deprecated
     * This endpoint sets the take profit/stop loss (TP/SL) mode to full or partial.
     *
     * Unified account covers: Linear contract; normal account covers: USDT perpetual, inverse perpetual, inverse futures.
     *
     * For partial TP/SL mode, you can set the TP/SL size smaller than position size.
     */
    setTPSLMode(params) {
        return this.postPrivate('/v5/position/set-tpsl-mode', params);
    }
    /**
     * Switches the position mode for USDT perpetual and Inverse futures.
     *
     * If you are in one-way Mode, you can only open one position on Buy or Sell side.
     *
     * If you are in hedge mode, you can open both Buy and Sell side positions simultaneously.
     *
     * Position mode. 0: Merged Single. 3: Both Sides.
     */
    switchPositionMode(params) {
        return this.postPrivate('/v5/position/switch-mode', params);
    }
    /**
     * @deprecated
     * The risk limit will limit the maximum position value you can hold under different margin requirements.
     * If you want to hold a bigger position size, you need more margin.
     *
     * This interface can set the risk limit of a single position.
     * If the order exceeds the current risk limit when placing an order, it will be rejected.
     */
    setRiskLimit(params) {
        return this.postPrivate('/v5/position/set-risk-limit', params);
    }
    /**
     * This endpoint allows you to set the take profit, stop loss or trailing stop for a position.
     * Passing these parameters will create conditional orders by the system internally.
     *
     * The system will cancel these orders if the position is closed, and adjust the qty according to the size of the open position.
     *
     * Unified account covers: Linear contract.
     * Normal account covers: USDT perpetual / Inverse perpetual / Inverse futures.
     */
    setTradingStop(params) {
        return this.postPrivate('/v5/position/trading-stop', params);
    }
    /**
     * This endpoint allows you to turn on/off auto-add-margin for an isolated margin position.
     *
     * Covers: USDT perpetual (Normal Account).
     */
    setAutoAddMargin(params) {
        return this.postPrivate('/v5/position/set-auto-add-margin', params);
    }
    /**
     * Manually add or reduce margin for isolated margin position
     *
     * Unified account covers: USDT perpetual / USDC perpetual / USDC futures / Inverse contract
     * Normal account covers: USDT perpetual / Inverse contract
     */
    addOrReduceMargin(params) {
        return this.postPrivate('/v5/position/add-margin', params);
    }
    /**
     * Query user's closed profit and loss records. The results are sorted by createdTime in descending order.
     *
     * Unified account covers: Linear contract
     * Normal account covers: USDT perpetual / Inverse perpetual / Inverse futures
     */
    getClosedPnL(params) {
        return this.getPrivate('/v5/position/closed-pnl', params);
    }
    /**
     * Move positions between sub-master, master-sub, or sub-sub UIDs.
     *
     * Unified account covers: USDT perpetual / USDC contract / Spot / Option
     *
     * INFO
     * The endpoint can only be called by master UID api key
     * UIDs must be the same master-sub account relationship
     * The trades generated from move-position endpoint will not be displayed in the Recent Trade (Rest API & Websocket)
     * There is no trading fee
     * fromUid and toUid both should be Unified trading accounts, and they need to be one-way mode when moving the positions
     * Please note that once executed, you will get execType=MovePosition entry from Get Trade History, Get Closed Pnl, and stream from Execution.
     */
    movePosition(params) {
        return this.postPrivate('/v5/position/move-positions', params);
    }
    /**
     * Query moved position data by master UID api key.
     *
     * Unified account covers: USDT perpetual / USDC contract / Spot / Option
     */
    getMovePositionHistory(params) {
        return this.getPrivate('/v5/position/move-history', params);
    }
    /**
     * Confirm new risk limit.
     *
     * It is only applicable when the user is marked as only reducing positions (please see the isReduceOnly field in the Get Position Info interface).
     * After the user actively adjusts the risk level, this interface is called to try to calculate the adjusted risk level, and if it passes (retCode=0),
     * the system will remove the position reduceOnly mark. You are recommended to call Get Position Info to check isReduceOnly field.
     *
     * Unified account covers: USDT perpetual / USDC contract / Inverse contract
     * Classic account covers: USDT perpetual / Inverse contract
     */
    confirmNewRiskLimit(params) {
        return this.postPrivate('/v5/position/confirm-pending-mmr', params);
    }
    /**
     *
     ****** Pre-upgrade APIs
     *
     */
    /**
     * Get those orders which occurred before you upgrade the account to Unified account.
     *
     * For now, it only supports to query USDT perpetual, USDC perpetual, Inverse perpetual and futures.
     *
     *   - can get all status in 7 days
     *   - can only get filled orders beyond 7 days
     */
    getPreUpgradeOrderHistory(params) {
        return this.getPrivate('/v5/pre-upgrade/order/history', params);
    }
    /**
     * Get users' execution records which occurred before you upgrade the account to Unified account, sorted by execTime in descending order
     *
     * For now, it only supports to query USDT perpetual, Inverse perpetual and futures.
     *
     *   - You may have multiple executions in a single order.
     *   - You can query by symbol, baseCoin, orderId and orderLinkId, and if you pass multiple params,
     *      the system will process them according to this priority: orderId > orderLinkId > symbol > baseCoin.
     */
    getPreUpgradeTradeHistory(params) {
        return this.getPrivate('/v5/pre-upgrade/execution/list', params);
    }
    /**
     * Query user's closed profit and loss records. The results are sorted by createdTime in descending order.
     *
     * For now, it only supports to query USDT perpetual, Inverse perpetual and futures.
     */
    getPreUpgradeClosedPnl(params) {
        return this.getPrivate('/v5/pre-upgrade/position/closed-pnl', params);
    }
    /**
     * Query transaction logs which occurred in the USDC Derivatives wallet before the account was upgraded to a Unified account.
     *
     * You can get USDC Perpetual, Option records.
     *
     * INFO
     * USDC Perpeual & Option support the recent 6 months data. Please download older data via GUI
     */
    getPreUpgradeTransactions(params) {
        return this.getPrivate('/v5/pre-upgrade/account/transaction-log', params);
    }
    /**
     * Query delivery records of Option before you upgraded the account to a Unified account, sorted by deliveryTime in descending order.
     *
     * INFO
     * Supports the recent 6 months data. Please download older data via GUI
     */
    getPreUpgradeOptionDeliveryRecord(params) {
        return this.getPrivate('/v5/pre-upgrade/asset/delivery-record', params);
    }
    /**
     * Query session settlement records of USDC perpetual before you upgrade the account to Unified account.
     *
     * INFO
     * USDC Perpetual support the recent 6 months data. Please download older data via GUI
     */
    getPreUpgradeUSDCSessionSettlements(params) {
        return this.getPrivate('/v5/pre-upgrade/asset/settlement-record', params);
    }
    /**
     *
     ****** Account APIs
     *
     */
    /**
     * Obtain wallet balance, query asset information of each currency, and account risk rate information under unified margin mode.
     *
     * By default, currency information with assets or liabilities of 0 is not returned.
     */
    getWalletBalance(params) {
        return this.getPrivate('/v5/account/wallet-balance', params);
    }
    /**
     * Query the available amount to transfer of a specific coin in the Unified wallet.
     *
     * @param coinName Coin name, uppercase only
     */
    getTransferableAmount(params) {
        return this.getPrivate('/v5/account/withdrawal', params);
    }
    /**
     * Upgrade to unified account.
     *
     * Banned/OTC loan/Net asset unsatisfying/Express path users cannot upgrade the account to Unified Account for now.
     */
    upgradeToUnifiedAccount() {
        return this.postPrivate('/v5/account/upgrade-to-uta');
    }
    /**
     * Get interest records, sorted in reverse order of creation time.
     *
     * Unified account
     */
    getBorrowHistory(params) {
        return this.getPrivate('/v5/account/borrow-history', params);
    }
    /**
     * You can manually repay the liabilities of Unified account
     * Applicable: Unified Account
     * Permission: USDC Contracts
     *
     * - Input the specific coin: repay the liability of this coin in particular
     * - No coin specified: repay the liability of all coins
     */
    repayLiability(params) {
        return this.postPrivate('/v5/account/quick-repayment', params);
    }
    /**
     * You can decide whether the assets in the Unified account needs to be collateral coins.
     */
    setCollateralCoin(params) {
        return this.postPrivate('/v5/account/set-collateral-switch', params);
    }
    batchSetCollateralCoin(params) {
        return this.postPrivate('/v5/account/set-collateral-switch-batch', params);
    }
    /**
     * Get the collateral information of the current unified margin account, including loan interest rate,
     * loanable amount, collateral conversion rate, whether it can be mortgaged as margin, etc.
     */
    getCollateralInfo(currency) {
        return this.getPrivate('/v5/account/collateral-info', { currency });
    }
    /**
     * Get current account Greeks information
     */
    getCoinGreeks(baseCoin) {
        return this.getPrivate('/v5/asset/coin-greeks', baseCoin ? { baseCoin } : undefined);
    }
    /**
     * Get the trading fee rate.
     * Covers: Spot / USDT perpetual / Inverse perpetual / Inverse futures / Options
     */
    getFeeRate(params) {
        return this.getPrivate('/v5/account/fee-rate', params);
    }
    /**
     * Query the margin mode and the upgraded status of account
     */
    getAccountInfo() {
        return this.getPrivate('/v5/account/info');
    }
    /**
     * Query the DCP configuration of the account's contracts (USDT perpetual, USDC perpetual and USDC Futures) / spot / options.
     *
     * Only the configured main / sub account can query information from this API. Calling this API by an account always returns empty.
     *
     * INFO
     * support linear contract (USDT, USDC Perp & USDC Futures) / Spot / Options only
     * Unified account only
     */
    getDCPInfo() {
        return this.getPrivate('/v5/account/query-dcp-info');
    }
    /**
     * Query transaction logs in Unified account.
     */
    getTransactionLog(params) {
        return this.getPrivate('/v5/account/transaction-log', params);
    }
    /**
     * Query transaction logs in the derivatives wallet (classic account), and inverse derivatives wallet (upgraded to UTA).
     *
     * API key permission: "Contract - Position"
     */
    getClassicTransactionLogs(params) {
        return this.getPrivate('/v5/account/contract-transaction-log', params);
    }
    /**
     * Query the SMP group ID of self match prevention.
     */
    getSMPGroup() {
        return this.getPrivate('/v5/account/smp-group');
    }
    /**
     * Default is regular margin mode.
     *
     * This mode is valid for USDT Perp, USDC Perp and USDC Option.
     */
    setMarginMode(marginMode) {
        return this.postPrivate('/v5/account/set-margin-mode', {
            setMarginMode: marginMode,
        });
    }
    /**
     * Turn on/off Spot hedging feature in Portfolio margin for Unified account.
     *
     * INFO
     * Only unified account is applicable
     * Only portfolio margin mode is applicable
     */
    setSpotHedging(params) {
        return this.postPrivate('/v5/account/set-hedging-mode', params);
    }
    /**
     * Configure Market Maker Protection (MMP)
     */
    setMMP(params) {
        return this.postPrivate('/v5/account/mmp-modify', params);
    }
    /**
     * Once the mmp triggered, you can unfreeze the account via this endpoint
     */
    resetMMP(baseCoin) {
        return this.postPrivate('/v5/account/mmp-reset', { baseCoin });
    }
    /**
     * Get MMP State
     */
    getMMPState(baseCoin) {
        return this.getPrivate('/v5/account/mmp-state', { baseCoin });
    }
    /**
     *
     ****** Asset APIs
     *
     */
    /**
     * Query option delivery records, sorted by deliveryTime in descending order.
     *
     * Covers: Option
     */
    getDeliveryRecord(params) {
        return this.getPrivate('/v5/asset/delivery-record', params);
    }
    /**
     * Query session settlement records of USDC perpetual
     *
     * Covers: Linear contract (USDC Perpetual only, Unified Account)
     */
    getSettlementRecords(params) {
        return this.getPrivate('/v5/asset/settlement-record', params);
    }
    /**
     * Query the coin exchange records.
     *
     * CAUTION: You may experience long delays with this endpoint.
     */
    getCoinExchangeRecords(params) {
        return this.getPrivate('/v5/asset/exchange/order-record', params);
    }
    /**
     * Query coin information, including chain information, withdraw and deposit status.
     */
    getCoinInfo(coin) {
        return this.getPrivate('/v5/asset/coin/query-info', coin ? { coin } : undefined);
    }
    /**
     * Query the sub UIDs under a main UID
     *
     * CAUTION: Can query by the master UID's api key only
     */
    getSubUID() {
        return this.getPrivate('/v5/asset/transfer/query-sub-member-list');
    }
    /**
     * Query asset information.
     *
     * INFO
     * For now, it can query SPOT only.
     */
    getAssetInfo(params) {
        return this.getPrivate('/v5/asset/transfer/query-asset-info', params);
    }
    /**
     * Query all coin balances of all account types under the master account and sub accounts.
     *
     * It is not allowed to get the master account coin balance via sub account API key.
     */
    getAllCoinsBalance(params) {
        return this.getPrivate('/v5/asset/transfer/query-account-coins-balance', params);
    }
    /**
     * Query the balance of a specific coin in a specific account type. Supports querying sub UID's balance.
     *
     * CAUTION: Can query by the master UID's api key only.
     */
    getCoinBalance(params) {
        return this.getPrivate('/v5/asset/transfer/query-account-coin-balance', params);
    }
    /**
     * Query withdrawable amount.
     */
    getWithdrawableAmount(params) {
        return this.getPrivate('/v5/asset/withdraw/withdrawable-amount', params);
    }
    /**
     * Query the transferable coin list between each account type.
     */
    getTransferableCoinList(fromAccountType, toAccountType) {
        return this.getPrivate('/v5/asset/transfer/query-transfer-coin-list', {
            fromAccountType,
            toAccountType,
        });
    }
    /**
     * Create the internal transfer between different account types under the same UID.
     * Each account type has its own acceptable coins, e.g, you cannot transfer USDC from SPOT to CONTRACT.
     *
     * Please refer to the getTransferableCoinList() API to find out more.
     */
    createInternalTransfer(transferId, coin, amount, fromAccountType, toAccountType) {
        return this.postPrivate('/v5/asset/transfer/inter-transfer', {
            transferId,
            coin,
            amount,
            fromAccountType,
            toAccountType,
        });
    }
    /**
     * Query the internal transfer records between different account types under the same UID.
     */
    getInternalTransferRecords(params) {
        return this.getPrivate('/v5/asset/transfer/query-inter-transfer-list', params);
    }
    /**
     * Enable Universal Transfer for Sub UID
     *
     * Use this endpoint to enable a subaccount to take part in a universal transfer.
     * It is a one-time switch which, once thrown, enables a subaccount permanently.
     * If not set, your subaccount cannot use universal transfers.
     *
     * @deprecated - You no longer need to configure transferable sub UIDs.
     * Now, all sub UIDs are automatically enabled for universal transfer.
     *
     */
    enableUniversalTransferForSubUIDs(subMemberIds) {
        return this.postPrivate('/v5/asset/transfer/save-transfer-sub-member', {
            subMemberIds,
        });
    }
    /**
     * Transfer between sub-sub or main-sub. Please make sure you have enabled universal transfer on your sub UID in advance.
     */
    createUniversalTransfer(params) {
        return this.postPrivate('/v5/asset/transfer/universal-transfer', params);
    }
    /**
     * Query universal transfer records
     *
     * CAUTION
     * Can query by the master UID's API key only
     */
    getUniversalTransferRecords(params) {
        return this.getPrivate('/v5/asset/transfer/query-universal-transfer-list', params);
    }
    /**
     * Query allowed deposit coin information.
     * To find out paired chain of coin, please refer to the coin info api.
     */
    getAllowedDepositCoinInfo(params) {
        return this.getPrivate('/v5/asset/deposit/query-allowed-list', params);
    }
    /**
     * Set auto transfer account after deposit. The same function as the setting for Deposit on web GUI
     */
    setDepositAccount(params) {
        return this.postPrivate('/v5/asset/deposit/deposit-to-account', params);
    }
    /**
     * Query deposit records.
     *
     * TIP
     * endTime - startTime should be less than 30 days. Query last 30 days records by default.
     *
     * Can use main or sub UID api key to query deposit records respectively.
     */
    getDepositRecords(params) {
        return this.getPrivate('/v5/asset/deposit/query-record', params);
    }
    /**
     * Query subaccount's deposit records by MAIN UID's API key.
     *
     * TIP: Query deposit records of SPOT only
     *      endTime - startTime should be less than 30 days.
     *      Queries for the last 30 days worth of records by default.
     */
    getSubAccountDepositRecords(params) {
        return this.getPrivate('/v5/asset/deposit/query-sub-member-record', params);
    }
    /**
     * Get Internal Deposit Records (across Bybit)
     * Query deposit records through Bybit platform
     *
     * RULES
     * The maximum difference between the start time and the end time is 30 days.
     * Support to get deposit records by Master or Sub Member Api Key
     */
    getInternalDepositRecords(params) {
        return this.getPrivate('/v5/asset/deposit/query-internal-record', params);
    }
    /**
     * Query the deposit address information of MASTER account.
     */
    getMasterDepositAddress(coin, chainType) {
        return this.getPrivate('/v5/asset/deposit/query-address', {
            coin,
            chainType,
        });
    }
    /**
     * Query the deposit address information of SUB account.
     */
    getSubDepositAddress(coin, chainType, subMemberId) {
        return this.getPrivate('/v5/asset/deposit/query-sub-member-address', {
            coin,
            chainType,
            subMemberId,
        });
    }
    /**
     * @deprecated - duplicate function, use getSubDepositAddress() instead
     * Query the deposit address information of SUB account.
     * @deprecated Duplicate endpoint - Use getSubDepositAddress() instead
     *
     * CAUTION
     * Can use master UID's api key only
     */
    querySubMemberAddress(coin, chainType, subMemberId) {
        return this.getPrivate('/v5/asset/deposit/query-sub-member-address', {
            coin,
            chainType,
            subMemberId,
        });
    }
    /**
     * Query withdrawal records.
     */
    getWithdrawalRecords(params) {
        return this.getPrivate('/v5/asset/withdraw/query-record', params);
    }
    /**
     * Get Exchange Entity List.
     *
     * This endpoint is particularly used for kyc=KOR users. When withdraw funds, you need to fill entity id.
     */
    getExchangeEntities() {
        return this.getPrivate('/v5/asset/withdraw/vasp/list');
    }
    /**
     * Withdraw assets from the SPOT account.
     *
     * CAUTION: Make sure you have whitelisted your wallet address before calling this endpoint.
     *
     * You can make an off-chain transfer if the target wallet address is from Bybit. This means that no blockchain fee will be charged.
     */
    submitWithdrawal(params) {
        return this.postPrivate('/v5/asset/withdraw/create', params);
    }
    /**
     * Cancel the withdrawal
     *
     * CAUTION: Can query by the master UID's api key only
     */
    cancelWithdrawal(id) {
        return this.postPrivate('/v5/asset/withdraw/cancel', { id });
    }
    /**
     * Query the coin list of convert from (to).
     */
    getConvertCoins(params) {
        return this.getPrivate('/v5/asset/exchange/query-coin-list', params);
    }
    /**
     * Request a quote for converting coins.
     */
    requestConvertQuote(params) {
        return this.postPrivate('/v5/asset/exchange/quote-apply', params);
    }
    /**
     * Confirm a quote for converting coins.
     */
    confirmConvertQuote(params) {
        return this.postPrivate('/v5/asset/exchange/convert-execute', params);
    }
    /**
     * Query the exchange result by sending quoteTxId.
     */
    getConvertStatus(params) {
        return this.getPrivate('/v5/asset/exchange/convert-result-query', params);
    }
    /**
     * Query the conversion history.
     */
    getConvertHistory(params) {
        return this.getPrivate('/v5/asset/exchange/query-convert-history', params);
    }
    /**
     *
     ****** User APIs
     *
     */
    /**
     * Create a new sub user id. Use master user's api key only.
     *
     * The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     */
    createSubMember(params) {
        return this.postPrivate('/v5/user/create-sub-member', params);
    }
    /**
     * To create new API key for those newly created sub UID. Use master user's api key only.
     *
     * TIP: The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     */
    createSubUIDAPIKey(params) {
        return this.postPrivate('/v5/user/create-sub-api', params);
    }
    /**
     * This endpoint allows you to get a list of all sub UID of master account. At most 10k subaccounts.
     */
    getSubUIDList() {
        return this.getPrivate('/v5/user/query-sub-members');
    }
    /**
     * This endpoint allows you to get a list of all sub UID of master account. No limit on the number of subaccounts.
     */
    getSubUIDListUnlimited(params) {
        return this.getPrivate('/v5/user/submembers', params);
    }
    /**
     * Froze sub uid. Use master user's api key only.
     *
     * TIP: The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     */
    setSubUIDFrozenState(subuid, frozen) {
        return this.postPrivate('/v5/user/frozen-sub-member', { subuid, frozen });
    }
    /**
     * Get the information of the api key. Use the api key pending to be checked to call the endpoint.
     * Both master and sub user's api key are applicable.
     *
     * TIP: Any permission can access this endpoint.
     */
    getQueryApiKey() {
        return this.getPrivate('/v5/user/query-api');
    }
    /**
     * Query all api keys information of a sub UID.
     */
    getSubAccountAllApiKeys(params) {
        return this.getPrivate('/v5/user/sub-apikeys', params);
    }
    getUIDWalletType(params) {
        return this.getPrivate('/v5/user/get-member-type', params);
    }
    /**
     * Modify the settings of a master API key. Use the API key pending to be modified to call the endpoint. Use master user's API key only.
     *
     * TIP: The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     */
    updateMasterApiKey(params) {
        return this.postPrivate('/v5/user/update-api', params);
    }
    /**
     * This endpoint modifies the settings of a sub API key.
     * Use the API key pending to be modified to call the endpoint or use master account api key to manage its sub account api key.
     * The API key must have one of the below permissions in order to call this endpoint
     *
     *  - sub API key: "Account Transfer", "Sub Member Transfer"
     *  - master API Key: "Account Transfer", "Sub Member Transfer", "Withdrawal"
     */
    updateSubApiKey(params) {
        return this.postPrivate('/v5/user/update-sub-api', params);
    }
    /**
     * Delete a sub UID. Before deleting the UID, please make sure there are no assets.
     *
     * TIP:
     * The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     */
    deleteSubMember(params) {
        return this.postPrivate('/v5/user/del-submember', params);
    }
    /**
     * Delete the api key of master account. Use the api key pending to be delete to call the endpoint. Use master user's api key only.
     *
     * TIP:
     * The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     *
     * DANGER: BE CAREFUL! The API key used to call this interface will be invalid immediately.
     */
    deleteMasterApiKey() {
        return this.postPrivate('/v5/user/delete-api');
    }
    /**
     * Delete the api key of sub account. Use the api key pending to be delete to call the endpoint. Use sub user's api key only.
     *
     * TIP:
     * The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - sub API key: "Account Transfer", "Sub Member Transfer"
     * - master API Key: "Account Transfer", "Sub Member Transfer", "Withdrawal"
     *
     * DANGER: BE CAREFUL! The sub API key used to call this interface will be invalid immediately.
     */
    deleteSubApiKey(params) {
        return this.postPrivate('/v5/user/delete-sub-api', params);
    }
    /**
     *
     ****** Affiliate APIs
     *
     */
    /**
     * Get Affiliate User List.
     * To use this endpoint, you should have an affiliate account and only tick "affiliate" permission while creating the API key.
     *
     * TIP:
     * - Use master UID only
     * - The api key can only have "Affiliate" permission
     */
    getAffiliateUserList(params) {
        return this.getPrivate('/v5/affiliate/aff-user-list', params);
    }
    /**
     * Get Affiliate User Info.
     *
     * This API is used for affiliate to get their users information.
     *
     * TIP
     * Use master UID only
     * The api key can only have "Affiliate" permission
     * The transaction volume and deposit amount are the total amount of the user done on Bybit, and have nothing to do with commission settlement. Any transaction volume data related to commission settlement is subject to the Affiliate Portal.
     */
    getAffiliateUserInfo(params) {
        return this.getPrivate('/v5/user/aff-customer-info', params);
    }
    /**
     *
     ****** Spot Leverage Token APIs
     *
     */
    /**
     * Query leverage token information
     */
    getLeveragedTokenInfo(ltCoin) {
        return this.get('/v5/spot-lever-token/info', { ltCoin });
    }
    /**
     * Get leverage token market information.
     */
    getLeveragedTokenMarket(ltCoin) {
        return this.get('/v5/spot-lever-token/reference', { ltCoin });
    }
    /**
     * This endpoint allows you to purchase a leveraged token with a specified amount.
     */
    purchaseSpotLeveragedToken(params) {
        return this.postPrivate('/v5/spot-lever-token/purchase', params);
    }
    /**
     * Redeem leveraged token.
     */
    redeemSpotLeveragedToken(params) {
        return this.postPrivate('/v5/spot-lever-token/redeem', params);
    }
    /**
     * Get purchase or redemption history
     */
    getSpotLeveragedTokenOrderHistory(params) {
        return this.getPrivate('/v5/spot-lever-token/order-record', params);
    }
    /**
     *
     ****** Spot Margin Trade APIs (UTA)
     *
     */
    /**
     * Get VIP Margin Data.
     *
     * This margin data is for Unified account in particular.
     *
     * INFO
     * Do not need authentication
     */
    getVIPMarginData(params) {
        return this.get('/v5/spot-margin-trade/data', params);
    }
    /**
     * Get Historical Interest Rate
     * You can query up to six months borrowing interest rate of Margin trading.
     * INFO: Need authentication, the api key needs "Spot" permission. Only supports Unified account.
     */
    getHistoricalInterestRate(params) {
        return this.getPrivate('/v5/spot-margin-trade/interest-rate-history', params);
    }
    /**
     * Turn spot margin trade on / off in your UTA account.
     *
     * CAUTION
     * Your account needs to turn on spot margin first.
     */
    toggleSpotMarginTrade(spotMarginMode) {
        return this.postPrivate('/v5/spot-margin-trade/switch-mode', {
            spotMarginMode,
        });
    }
    /**
     * Set the user's maximum leverage in spot cross margin.
     * CAUTION: Your account needs to enable spot margin first; i.e., you must have finished the quiz on web / app.
     */
    setSpotMarginLeverage(leverage) {
        return this.postPrivate('/v5/spot-margin-trade/set-leverage', { leverage });
    }
    /**
     * Query the Spot margin status and leverage of Unified account.
     *
     * Covers: Margin trade (Unified Account)
     */
    getSpotMarginState() {
        return this.getPrivate('/v5/spot-margin-trade/state');
    }
    /**
     *
     ****** Spot Margin Trade APIs (Normal)
     *
     */
    /**
     * Get Margin Coin Info
     */
    getSpotMarginCoinInfo(coin) {
        return this.getPrivate('/v5/spot-cross-margin-trade/pledge-token', {
            coin,
        });
    }
    /**
     * Get Borrowable Coin Info
     */
    getSpotMarginBorrowableCoinInfo(coin) {
        return this.getPrivate('/v5/spot-cross-margin-trade/borrow-token', {
            coin,
        });
    }
    /**
     * Get Interest & Quota
     */
    getSpotMarginInterestAndQuota(coin) {
        return this.getPrivate('/v5/spot-cross-margin-trade/loan-info', {
            coin,
        });
    }
    /**
     * Get Loan Account Info
     */
    getSpotMarginLoanAccountInfo() {
        return this.getPrivate('/v5/spot-cross-margin-trade/account');
    }
    /**
     * Borrow
     */
    spotMarginBorrow(params) {
        return this.postPrivate('/v5/spot-cross-margin-trade/loan', params);
    }
    /**
     * Repay
     */
    spotMarginRepay(params) {
        return this.postPrivate('/v5/spot-cross-margin-trade/repay', params);
    }
    /**
     * Get Borrow Order Detail
     */
    getSpotMarginBorrowOrderDetail(params) {
        return this.getPrivate('/v5/spot-cross-margin-trade/orders', params);
    }
    /**
     * Get Repayment Order Detail
     */
    getSpotMarginRepaymentOrderDetail(params) {
        return this.getPrivate('/v5/spot-cross-margin-trade/repay-history', params);
    }
    /**
     * Turn spot margin trade on / off in your NORMAL account.
     */
    toggleSpotCrossMarginTrade(params) {
        return this.postPrivate('/v5/spot-cross-margin-trade/switch', params);
    }
    /**
     *
     ****** Crypto Loan
     *
     */
    /**
     * Get Collateral Coins
     *
     * INFO: Do not need authentication
     */
    getCollateralCoins(params) {
        return this.get('/v5/crypto-loan/collateral-data', params);
    }
    /**
     * Get Borrowable Coins
     *
     * INFO: Do not need authentication
     */
    getBorrowableCoins(params) {
        return this.get('/v5/crypto-loan/loanable-data', params);
    }
    /**
     * Get Account Borrow/Collateral Limit
     * Query the account borrowable/collateral limit
     *
     * Permission: "Spot trade"
     */
    getAccountBorrowCollateralLimit(params) {
        return this.getPrivate('/v5/crypto-loan/borrowable-collateralisable-number', params);
    }
    /**
     * Borrow Crypto Loan
     *
     * Permission: "Spot trade"
     *
     * INFO:
     * The loan funds are released to the Funding account
     * The collateral funds are deducted from the Funding account, so make sure you have enough collateral amount in the funding wallet
     */
    borrowCryptoLoan(params) {
        return this.postPrivate('/v5/crypto-loan/borrow', params);
    }
    /**
     * Repay Crypto Loan
     *
     * You can repay partial loan. If there is interest occurred, interest will be repaid in priority
     *
     * Permission: "Spot trade"
     *
     * INFO:
     * The repaid amount will be deducted from Funding account
     * The collateral amount will not be auto returned when you don't fully repay the debt, but you can also adjust collateral amount
     */
    repayCryptoLoan(params) {
        return this.postPrivate('/v5/crypto-loan/repay', params);
    }
    /**
     * Get Unpaid Loan Orders
     * Query the ongoing loan orders, which are not fully repaid
     *
     * Permission: "Spot trade"
     */
    getUnpaidLoanOrders(params) {
        return this.getPrivate('/v5/crypto-loan/ongoing-orders', params);
    }
    /**
     * Get Repayment Transaction History
     * Query repaid transaction history
     *
     * Permission: "Spot trade"
     *
     * INFO:
     * Support querying last 6 months completed loan orders
     * Only successful repayments can be queried
     */
    getRepaymentHistory(params) {
        return this.getPrivate('/v5/crypto-loan/repayment-history', params);
    }
    /**
     * Get Completed Loan Order History
     * Query the completed loan orders
     *
     * Permission: "Spot trade"
     *
     * INFO:
     * Support querying last 6 months completed loan orders
     */
    getCompletedLoanOrderHistory(params) {
        return this.getPrivate('/v5/crypto-loan/borrow-history', params);
    }
    /**
     * Get Max. Allowed Reduction Collateral Amount
     * Query the maximum allowed reduction collateral amount
     *
     * Permission: "Spot trade"
     */
    getMaxAllowedReductionCollateralAmount(params) {
        return this.getPrivate('/v5/crypto-loan/max-collateral-amount', params);
    }
    /**
     * Adjust Collateral Amount
     * You can increase or reduce collateral amount. When you reduce, please follow the max. allowed reduction amount.
     *
     * Permission: "Spot trade"
     *
     * INFO:
     * The adjusted collateral amount will be returned to or deducted from Funding account
     */
    adjustCollateralAmount(params) {
        return this.postPrivate('/v5/crypto-loan/adjust-ltv', params);
    }
    /**
     * Get Loan LTV Adjustment History
     * Query the transaction history of collateral amount adjustment
     *
     * Permission: "Spot trade"
     *
     * INFO:
     * Support querying last 6 months adjustment transactions
     * Only the ltv adjustment transactions launched by the user can be queried
     */
    getLoanLTVAdjustmentHistory(params) {
        return this.getPrivate('/v5/crypto-loan/adjustment-history', params);
    }
    /**
     *
     ****** Institutional Lending
     *
     */
    /**
     * Get Product Info
     */
    getInstitutionalLendingProductInfo(productId) {
        return this.get('/v5/ins-loan/product-infos', { productId });
    }
    /**
     * Get Margin Coin Info
     * @deprecated
     */
    getInstitutionalLendingMarginCoinInfo(productId) {
        return this.get('/v5/ins-loan/ensure-tokens', { productId });
    }
    /**
     * Get Margin Coin Info With Conversion Rate
     */
    getInstitutionalLendingMarginCoinInfoWithConversionRate(productId) {
        return this.get('/v5/ins-loan/ensure-tokens-convert', { productId });
    }
    /**
     * Get Loan Orders
     */
    getInstitutionalLendingLoanOrders(params) {
        return this.getPrivate('/v5/ins-loan/loan-order', params);
    }
    /**
     * Get Repay Orders
     */
    getInstitutionalLendingRepayOrders(params) {
        return this.getPrivate('/v5/ins-loan/repaid-history', params);
    }
    /**
     * Get LTV
     * @deprecated
     */
    getInstitutionalLendingLTV() {
        return this.getPrivate('/v5/ins-loan/ltv');
    }
    /**
     * Get LTV with Ladder Conversion Rate
     */
    getInstitutionalLendingLTVWithLadderConversionRate() {
        return this.getPrivate('/v5/ins-loan/ltv-convert');
    }
    /**
     * Bind or unbind UID for the institutional loan product.
     *
     * INFO
     * Risk unit designated UID cannot be unbound
     * This endpoint can only be called by uids in the risk unit list
     * The UID must be upgraded to UTA Pro if you try to bind it.
     * When the API is operated through the API Key of any UID in the risk unit, the UID is bound or unbound in the risk unit.
     */
    bindOrUnbindUID(params) {
        return this.postPrivate('/v5/ins-loan/association-uid', params);
    }
    /**
     *
     ****** Broker
     *
     */
    /**
     * Get Exchange Broker Earning.
     *
     * INFO
     * Use exchange broker master account to query
     * The data can support up to past 1 months until T-1. To extract data from over a month ago, please contact your Relationship Manager
     * begin & end are either entered at the same time or not entered, and latest 7 days data are returned by default
     * API rate limit: 10 req / sec
     */
    getExchangeBrokerEarnings(params) {
        return this.getPrivate('/v5/broker/earnings-info', params);
    }
    /**
     * Get Exchange Broker Account Info.
     *
     * INFO
     * Use exchange broker master account to query
     * API rate limit: 10 req / sec
     */
    getExchangeBrokerAccountInfo() {
        return this.getPrivate('/v5/broker/account-info');
    }
    /**
     * Get Sub Account Deposit Records.
     *
     * Exchange broker can query subaccount's deposit records by main UID's API key without specifying uid.
     *
     * API rate limit: 300 req / min
     *
     * TIP
     * endTime - startTime should be less than 30 days. Queries for the last 30 days worth of records by default.
     */
    getBrokerSubAccountDeposits(params) {
        return this.getPrivate('/v5/broker/asset/query-sub-member-deposit-record', params);
    }
    /**
     * Query Voucher Spec
     */
    getBrokerVoucherSpec(params) {
        return this.postPrivate('/v5/broker/award/info', params);
    }
    /**
     * Issue a voucher to a user
     *
     * INFO
     * Use exchange broker master account to issue
     */
    issueBrokerVoucher(params) {
        return this.postPrivate('/v5/broker/award/distribute-award', params);
    }
    /**
     * Query an issued voucher
     *
     * INFO
     * Use exchange broker master account to query
     */
    getBrokerIssuedVoucher(params) {
        return this.postPrivate('/v5/broker/award/distribution-record', params);
    }
    /**
     *
     ****** EARN
     *
     */
    /**
     * Get Product Info for Earn products
     *
     * INFO: Do not need authentication
     */
    getEarnProduct(params) {
        return this.get('/v5/earn/product', params);
    }
    /**
     * Stake or Redeem Earn products
     *
     * INFO: API key needs "Earn" permission
     *
     * NOTE: In times of high demand for loans in the market for a specific cryptocurrency,
     * the redemption of the principal may encounter delays and is expected to be processed
     * within 48 hours. Once the redemption request is initiated, it cannot be canceled,
     * and your principal will continue to earn interest until the process is completed.
     */
    submitStakeRedeem(params) {
        return this.postPrivate('/v5/earn/place-order', params);
    }
    /**
     * Get Stake/Redeem Order History
     *
     * INFO: API key needs "Earn" permission
     *
     * Note: Either orderId or orderLinkId is required. If both are passed,
     * make sure they're matched, otherwise returning empty result
     */
    getEarnOrderHistory(params) {
        return this.getPrivate('/v5/earn/order', params);
    }
    /**
     * Get Staked Position
     *
     * INFO: API key needs "Earn" permission
     *
     * Note: Fully redeemed position is also returned in the response
     */
    getEarnPosition(params) {
        return this.getPrivate('/v5/earn/position', params);
    }
    /**
     *
     ****** P2P TRADING
     *
     */
    /**
     *
     * General P2P
     */
    /**
     * Get coin balance of all account types under the master account, and sub account.
     *
     * Note: this field is mandatory for accountType=UNIFIED, and supports up to 10 coins each request
     */
    getP2PAccountCoinsBalance(params) {
        return this.getPrivate('/v5/asset/transfer/query-account-coins-balance', params);
    }
    /**
     *
     * Advertisement P2P
     */
    /**
     * Get market online ads list
     */
    getP2POnlineAds(params) {
        return this.postPrivate('/v5/p2p/item/online', params);
    }
    /**
     * Post new P2P advertisement
     */
    createP2PAd(params) {
        return this.postPrivate('/v5/p2p/item/create', params);
    }
    /**
     * Cancel P2P advertisement
     */
    cancelP2PAd(params) {
        return this.postPrivate('/v5/p2p/item/cancel', params);
    }
    /**
     * Update or relist P2P advertisement
     */
    updateP2PAd(params) {
        return this.postPrivate('/v5/p2p/item/update', params);
    }
    /**
     * Get personal P2P ads list
     *
     */
    getP2PPersonalAds(params) {
        return this.postPrivate('/v5/p2p/item/personal/list', params);
    }
    /**
     * Get P2P ad details
     */
    getP2PAdDetail(params) {
        return this.postPrivate('/v5/p2p/item/info', params);
    }
    /**
     *
     * Orders P2P
     */
    /**
     * Get all P2P orders
     *
     */
    getP2POrders(params) {
        return this.postPrivate('/v5/p2p/order/simplifyList', params);
    }
    /**
     * Get P2P order details
     *
     */
    getP2POrderDetail(params) {
        return this.postPrivate('/v5/p2p/order/info', params);
    }
    /**
     * Get pending P2P orders
     */
    getP2PPendingOrders(params) {
        return this.postPrivate('/v5/p2p/order/pending/simplifyList', params);
    }
    /**
     * Mark P2P order as paid
     */
    markP2POrderAsPaid(params) {
        return this.postPrivate('/v5/p2p/order/pay', params);
    }
    /**
     * Release digital assets in a P2P order
     */
    releaseP2POrder(params) {
        return this.postPrivate('/v5/p2p/order/finish', params);
    }
    /**
     * Send chat message in a P2P order
     */
    sendP2POrderMessage(params) {
        return this.postPrivate('/v5/p2p/order/message/send', params);
    }
    /**
     * Upload chat file for P2P order
     */
    uploadP2PChatFile(params) {
        return this.postPrivate('/v5/p2p/oss/upload_file', params);
    }
    /**
     * Get chat messages in a P2P order
     */
    getP2POrderMessages(params) {
        return this.postPrivate('/v5/p2p/order/message/listpage', params);
    }
    /**
     *
     * User P2P
     */
    /**
     * Get P2P user account information
     */
    getP2PUserInfo() {
        return this.postPrivate('/v5/p2p/user/personal/info');
    }
    /**
     * Get counterparty user information in a P2P order
     */
    getP2PCounterpartyUserInfo(params) {
        return this.postPrivate('/v5/p2p/user/order/personal/info', params);
    }
    /**
     * Get user payment information
     */
    getP2PUserPayments() {
        return this.postPrivate('/v5/p2p/user/payment/list');
    }
}
exports.RestClientV5 = RestClientV5;
//# sourceMappingURL=rest-client-v5.js.map