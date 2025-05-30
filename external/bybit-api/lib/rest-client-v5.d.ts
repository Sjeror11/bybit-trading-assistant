import { APIResponseV3, APIResponseV3WithTime, AccountBorrowCollateralLimitV5, AccountCoinBalanceV5, AccountInfoV5, AccountMarginModeV5, AccountOrderV5, AccountTypeV5, AddOrReduceMarginParamsV5, AddOrReduceMarginResultV5, AffiliateUserInfoV5, AffiliateUserListItemV5, AllCoinsBalanceV5, AllowedDepositCoinInfoV5, AmendOrderParamsV5, AmendSpreadOrderParamsV5, ApiKeyInfoV5, AssetInfoV5, BatchAmendOrderParamsV5, BatchAmendOrderResultV5, BatchCancelOrderParamsV5, BatchCancelOrderResultV5, BatchCreateOrderResultV5, BatchOrderParamsV5, BatchOrdersRetExtInfoV5, BorrowCryptoLoanParamsV5, BorrowHistoryRecordV5, BrokerIssuedVoucherV5, BrokerVoucherSpecV5, CancelAllOrdersParamsV5, CancelOrderParamsV5, CategoryCursorListV5, CategoryListV5, CategorySymbolListV5, CategoryV5, ClosedPnLV5, CoinExchangeRecordV5, CoinGreeksV5, CoinInfoV5, CollateralInfoV5, CompletedLoanOrderV5, ConfirmNewRiskLimitParamsV5, ConvertCoinSpecV5, ConvertCoinsParamsV5, ConvertHistoryRecordV5, ConvertQuoteV5, ConvertStatusV5, CreateP2PAdParamsV5, CreateSubApiKeyParamsV5, CreateSubApiKeyResultV5, CreateSubMemberParamsV5, CreateSubMemberResultV5, CursorListV5, CursorRowsV5, DCPInfoV5, DeleteSubMemberParamsV5, DeliveryPriceV5, DeliveryRecordV5, DepositAddressChainV5, DepositRecordV5, EarnOrderHistoryV5, EarnPositionV5, EarnProductV5, ExchangeBrokerAccountInfoV5, ExchangeBrokerEarningResultV5, ExchangeBrokerSubAccountDepositRecordV5, ExecutionV5, FeeRateV5, FundingRateHistoryResponseV5, GetAccountCoinBalanceParamsV5, GetAccountHistoricOrdersParamsV5, GetAccountOrdersParamsV5, GetAllCoinsBalanceParamsV5, GetAllowedDepositCoinInfoParamsV5, GetAssetInfoParamsV5, GetBorrowHistoryParamsV5, GetBrokerIssuedVoucherParamsV5, GetBrokerSubAccountDepositsV5, GetClassicTransactionLogsParamsV5, GetClosedPnLParamsV5, GetCoinExchangeRecordParamsV5, GetCompletedLoanOrderHistoryParamsV5, GetConvertHistoryParamsV5, GetDeliveryPriceParamsV5, GetDeliveryRecordParamsV5, GetDepositRecordParamsV5, GetEarnOrderHistoryParamsV5, GetEarnPositionParamsV5, GetExchangeBrokerEarningsParamsV5, GetExecutionListParamsV5, GetFeeRateParamsV5, GetFundingRateHistoryParamsV5, GetHistoricalVolatilityParamsV5, GetIndexPriceKlineParamsV5, GetInstrumentsInfoParamsV5, GetInsuranceParamsV5, GetInternalDepositRecordParamsV5, GetInternalTransferParamsV5, GetKlineParamsV5, GetLoanLTVAdjustmentHistoryParamsV5, GetLongShortRatioParamsV5, GetMarkPriceKlineParamsV5, GetMovePositionHistoryParamsV5, GetOpenInterestParamsV5, GetOptionDeliveryPriceParamsV5, GetOrderbookParamsV5, GetP2PAccountCoinsBalanceParamsV5, GetP2PCounterpartyUserInfoParamsV5, GetP2POnlineAdsParamsV5, GetP2POrderMessagesParamsV5, GetP2POrdersParamsV5, GetP2PPendingOrdersParamsV5, GetP2PPersonalAdsParamsV5, GetPreUpgradeClosedPnlParamsV5, GetPreUpgradeOptionDeliveryRecordParamsV5, GetPreUpgradeOrderHistoryParamsV5, GetPreUpgradeTradeHistoryParamsV5, GetPreUpgradeTransactionLogParamsV5, GetPreUpgradeUSDCSessionParamsV5, GetPremiumIndexPriceKlineParamsV5, GetPublicTradingHistoryParamsV5, GetRepaymentHistoryParamsV5, GetRiskLimitParamsV5, GetSettlementRecordParamsV5, GetSpotLeveragedTokenOrderHistoryParamsV5, GetSpreadInstrumentsInfoParamsV5, GetSpreadOpenOrdersParamsV5, GetSpreadOrderHistoryParamsV5, GetSpreadTradeHistoryParamsV5, GetSubAccountAllApiKeysParamsV5, GetSubAccountDepositRecordParamsV5, GetTickersParamsV5, GetTransactionLogParamsV5, GetUniversalTransferRecordsParamsV5, GetUnpaidLoanOrdersParamsV5, GetVIPMarginDataParamsV5, GetWalletBalanceParamsV5, GetWithdrawalRecordsParamsV5, HistoricalVolatilityV5, InstrumentInfoResponseV5, InsuranceResponseV5, InternalDepositRecordV5, InternalTransferRecordV5, IssueVoucherParamsV5, LeverageTokenInfoV5, LeveragedTokenMarketResultV5, LoanLTVAdjustmentHistoryV5, LongShortRatioV5, MMPModifyParamsV5, MMPStateV5, MarkP2POrderAsPaidParamsV5, MovePositionHistoryV5, MovePositionParamsV5, MovePositionResultV5, OHLCKlineV5, OHLCVKlineV5, OpenInterestResponseV5, OptionDeliveryPriceV5, OrderParamsV5, OrderResultV5, OrderSideV5, OrderbookResponseV5, P2PAccountCoinsBalanceV5, P2PAdDetailV5, P2PCounterpartyUserInfoV5, P2PCreateAdResponseV5, P2POnlineAdsResponseV5, P2POrderDetailV5, P2POrderMessageV5, P2POrdersResponseV5, P2PPersonalAdsResponseV5, P2PUserInfoV5, P2PUserPaymentV5, PositionInfoParamsV5, PositionV5, PreUpgradeOptionsDelivery, PreUpgradeTransaction, PreUpgradeUSDCSessionSettlement, PublicTradeV5, PurchaseSpotLeveragedTokenParamsV5, PurchaseSpotLeveragedTokenResultV5, RedeemSpotLeveragedTokenParamsV5, RedeemSpotLeveragedTokenResultV5, RepayLiabilityParamsV5, RepayLiabilityResultV5, RepaymentHistoryV5, RequestConvertQuoteParamsV5, RiskLimitV5, SendP2POrderMessageParamsV5, SetAutoAddMarginParamsV5, SetCollateralCoinParamsV5, SetLeverageParamsV5, SetRiskLimitParamsV5, SetRiskLimitResultV5, SetTPSLModeParamsV5, SetTradingStopParamsV5, SettlementRecordV5, SpotBorrowCheckResultV5, SpotLeveragedTokenOrderHistoryV5, SpotMarginStateV5, SpreadInstrumentInfoV5, SpreadOpenOrderV5, SpreadOrderHistoryV5, SpreadOrderbookResponseV5, SpreadRecentTradeV5, SpreadTickerV5, SpreadTradeV5, SubMemberV5, SubmitSpreadOrderParamsV5, SubmitStakeRedeemParamsV5, SwitchIsolatedMarginParamsV5, SwitchPositionModeParamsV5, TPSLModeV5, TickerLinearInverseV5, TickerOptionV5, TickerSpotV5, TransactionLogV5, UnifiedAccountUpgradeResultV5, UniversalTransferParamsV5, UniversalTransferRecordV5, UnpaidLoanOrderV5, UpdateApiKeyParamsV5, UpdateApiKeyResultV5, UpdateP2PAdParamsV5, VIPMarginDataV5, VaspEntityV5, VipBorrowableCoinsV5, VipCollateralCoinsV5, WalletBalanceV5, WithdrawParamsV5, WithdrawableAmountV5, WithdrawalRecordV5 } from './types';
import BaseRestClient from './util/BaseRestClient';
/**
 * REST API client for V5 REST APIs
 *
 * https://bybit-exchange.github.io/docs/v5/intro
 */
export declare class RestClientV5 extends BaseRestClient {
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
    fetchLatencySummary(): Promise<any>;
    /**
     *
     ****** Misc Bybit APIs
     *
     */
    getClientType(): "v5";
    fetchServerTime(): Promise<number>;
    getServerTime(): Promise<APIResponseV3WithTime<{
        timeSecond: string;
        timeNano: string;
    }>>;
    /**
     *
     ****** Demo Account APIs
     *
     */
    requestDemoTradingFunds(params?: {
        adjustType?: 0 | 1;
        utaDemoApplyMoney?: Array<{
            coin: string;
            amountStr: string;
        }>;
    }): Promise<APIResponseV3<{}>>;
    /**
     * Create a demo trading account.
     */
    createDemoAccount(): Promise<APIResponseV3<{
        subMemberId: string;
    }>>;
    /**
     *
     ****** Spread Trading APIs
     *
     */
    /**
     * Get Spread Instruments Info
     */
    getSpreadInstrumentsInfo(params?: GetSpreadInstrumentsInfoParamsV5): Promise<APIResponseV3WithTime<{
        list: SpreadInstrumentInfoV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Get Spread Orderbook
     */
    getSpreadOrderbook(params: {
        symbol: string;
        limit?: number;
    }): Promise<APIResponseV3WithTime<SpreadOrderbookResponseV5>>;
    /**
     * Get Spread Tickers
     */
    getSpreadTickers(params: {
        symbol: string;
    }): Promise<APIResponseV3WithTime<{
        list: SpreadTickerV5[];
    }>>;
    /**
     * Get Spread Public Recent Trades
     */
    getSpreadRecentTrades(params: {
        symbol: string;
        limit?: number;
    }): Promise<APIResponseV3WithTime<{
        list: SpreadRecentTradeV5[];
    }>>;
    /**
     * Create Spread Order
     */
    submitSpreadOrder(params: SubmitSpreadOrderParamsV5): Promise<APIResponseV3WithTime<{
        orderId: string;
        orderLinkId: string;
    }>>;
    /**
     * Amend Spread Order
     * You can only modify unfilled or partially filled orders.
     */
    amendSpreadOrder(params: AmendSpreadOrderParamsV5): Promise<APIResponseV3WithTime<{
        orderId: string;
        orderLinkId: string;
    }>>;
    /**
     * Cancel Spread Order
     */
    cancelSpreadOrder(params: {
        orderId?: string;
        orderLinkId?: string;
    }): Promise<APIResponseV3WithTime<{
        orderId: string;
        orderLinkId: string;
    }>>;
    /**
     * Cancel All Spread Orders
     *
     * When a symbol is specified, all orders for that symbol will be canceled regardless of the cancelAll field.
     * When symbol is not specified and cancelAll=true, all orders, regardless of the symbol, will be canceled.
     */
    cancelAllSpreadOrders(params?: {
        symbol?: string;
        cancelAll?: boolean;
    }): Promise<APIResponseV3WithTime<{
        list: {
            orderId: string;
            orderLinkId: string;
        }[];
        success: string;
    }>>;
    /**
     * Get Spread Open Orders
     * Query unfilled or partially filled orders in real-time.
     */
    getSpreadOpenOrders(params?: GetSpreadOpenOrdersParamsV5): Promise<APIResponseV3WithTime<{
        list: SpreadOpenOrderV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Get Spread Order History
     *
     * Note:
     * - orderId & orderLinkId has a higher priority than startTime & endTime
     * - Fully canceled orders are stored for up to 24 hours
     * - Single leg orders can also be found with "createType"=CreateByFutureSpread via Get Order History
     */
    getSpreadOrderHistory(params?: GetSpreadOrderHistoryParamsV5): Promise<APIResponseV3WithTime<{
        list: SpreadOrderHistoryV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Get Spread Trade History
     *
     * Note:
     * - In self-trade cases, both the maker and taker single-leg trades will be returned in the same request
     * - Single leg executions can also be found with "execType"=FutureSpread via Get Trade History
     */
    getSpreadTradeHistory(params?: GetSpreadTradeHistoryParamsV5): Promise<APIResponseV3WithTime<{
        list: SpreadTradeV5[];
        nextPageCursor: string;
    }>>;
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
    getKline(params: GetKlineParamsV5): Promise<APIResponseV3WithTime<CategorySymbolListV5<OHLCVKlineV5[], 'spot' | 'linear' | 'inverse'>>>;
    /**
     * Query the mark price kline data. Charts are returned in groups based on the requested interval.
     *
     * Covers: Linear contract / Inverse contract
     */
    getMarkPriceKline(params: GetMarkPriceKlineParamsV5): Promise<APIResponseV3WithTime<CategorySymbolListV5<OHLCKlineV5[], 'linear' | 'inverse'>>>;
    /**
     * Query the index price kline data. Charts are returned in groups based on the requested interval.
     *
     * Covers: Linear contract / Inverse contract
     */
    getIndexPriceKline(params: GetIndexPriceKlineParamsV5): Promise<APIResponseV3WithTime<CategorySymbolListV5<OHLCKlineV5[], 'linear' | 'inverse'>>>;
    /**
     * Retrieve the premium index price kline data. Charts are returned in groups based on the requested interval.
     *
     * Covers: Linear contract
     */
    getPremiumIndexPriceKline(params: GetPremiumIndexPriceKlineParamsV5): Promise<APIResponseV3WithTime<CategorySymbolListV5<OHLCKlineV5[], 'linear'>>>;
    /**
     * Query a list of instruments of online trading pair.
     *
     * Covers: Spot / Linear contract / Inverse contract / Option
     *
     * Note: Spot does not support pagination, so limit & cursor are invalid.
     */
    getInstrumentsInfo<C extends CategoryV5>(params: GetInstrumentsInfoParamsV5 & {
        category: C;
    }): Promise<APIResponseV3WithTime<InstrumentInfoResponseV5<C>>>;
    /**
     * Query orderbook data
     *
     * Covers: Spot / Linear contract / Inverse contract / Option
     */
    getOrderbook(params: GetOrderbookParamsV5): Promise<APIResponseV3WithTime<OrderbookResponseV5>>;
    getTickers(params: GetTickersParamsV5<'linear' | 'inverse'>): Promise<APIResponseV3WithTime<CategoryListV5<TickerLinearInverseV5[], 'linear' | 'inverse'>>>;
    getTickers(params: GetTickersParamsV5<'option'>): Promise<APIResponseV3WithTime<CategoryListV5<TickerOptionV5[], 'option'>>>;
    getTickers(params: GetTickersParamsV5<'spot'>): Promise<APIResponseV3WithTime<CategoryListV5<TickerSpotV5[], 'spot'>>>;
    /**
     * Query historical funding rate. Each symbol has a different funding interval.
     *
     * Covers: Linear contract / Inverse perpetual
     */
    getFundingRateHistory(params: GetFundingRateHistoryParamsV5): Promise<APIResponseV3WithTime<CategoryListV5<FundingRateHistoryResponseV5[], 'linear' | 'inverse'>>>;
    /**
     * Query recent public trading data in Bybit.
     *
     * Covers: Spot / Linear contract / Inverse contract / Option
     */
    getPublicTradingHistory(params: GetPublicTradingHistoryParamsV5): Promise<APIResponseV3WithTime<CategoryListV5<PublicTradeV5[], CategoryV5>>>;
    /**
     * Get open interest of each symbol.
     *
     * Covers: Linear contract / Inverse contract
     */
    getOpenInterest(params: GetOpenInterestParamsV5): Promise<APIResponseV3WithTime<OpenInterestResponseV5>>;
    /**
     * Query option historical volatility
     * Covers: Option
     */
    getHistoricalVolatility(params: GetHistoricalVolatilityParamsV5): Promise<APIResponseV3WithTime<CategoryListV5<HistoricalVolatilityV5[], 'option'>>>;
    /**
     * Query Bybit insurance pool data (BTC/USDT/USDC etc). The data is updated every 24 hours.
     */
    getInsurance(params?: GetInsuranceParamsV5): Promise<APIResponseV3WithTime<InsuranceResponseV5>>;
    /**
     * Query risk limit of futures
     *
     * Covers: Linear contract / Inverse contract
     */
    getRiskLimit(params?: GetRiskLimitParamsV5): Promise<APIResponseV3WithTime<CategoryListV5<RiskLimitV5[], 'inverse' | 'linear'>>>;
    /**
     * Get the delivery price for option
     *
     * Covers: Option
     *
     * @deprecated use getDeliveryPrice() instead
     */
    getOptionDeliveryPrice(params: GetOptionDeliveryPriceParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<OptionDeliveryPriceV5[]>>>;
    /**
     * Get the delivery price of Inverse futures, USDC futures and Options
     *
     * Covers: USDC futures / Inverse futures / Option
     */
    getDeliveryPrice(params: GetDeliveryPriceParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<DeliveryPriceV5[]>>>;
    getLongShortRatio(params: GetLongShortRatioParamsV5): Promise<APIResponseV3WithTime<CursorListV5<LongShortRatioV5[]>>>;
    /**
     *
     ****** Trade APIs
     *
     */
    submitOrder(params: OrderParamsV5): Promise<APIResponseV3WithTime<OrderResultV5>>;
    amendOrder(params: AmendOrderParamsV5): Promise<APIResponseV3WithTime<OrderResultV5>>;
    cancelOrder(params: CancelOrderParamsV5): Promise<APIResponseV3WithTime<OrderResultV5>>;
    /**
     * Query unfilled or partially filled orders in real-time. To query older order records, please use the order history interface.
     */
    getActiveOrders(params: GetAccountOrdersParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<AccountOrderV5[]>>>;
    cancelAllOrders(params: CancelAllOrdersParamsV5): Promise<APIResponseV3WithTime<{
        list: OrderResultV5[];
        success: string;
    }>>;
    /**
     * Query order history. As order creation/cancellation is asynchronous, the data returned from this endpoint may delay.
     *
     * If you want to get real-time order information, you could query this endpoint or rely on the websocket stream (recommended).
     */
    getHistoricOrders(params: GetAccountHistoricOrdersParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<AccountOrderV5[]>>>;
    /**
     * Query users' execution records, sorted by execTime in descending order
     *
     * Unified account covers: Spot / Linear contract / Options
     * Normal account covers: USDT perpetual / Inverse perpetual / Inverse futures
     */
    getExecutionList(params: GetExecutionListParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<ExecutionV5[]>>>;
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
    batchSubmitOrders(category: 'option' | 'linear', orders: BatchOrderParamsV5[]): Promise<APIResponseV3WithTime<{
        list: BatchCreateOrderResultV5[];
    }, BatchOrdersRetExtInfoV5>>;
    /**
     * This endpoint allows you to amend more than one open order in a single request.
     * Covers: Option (UTA, UTA Pro) / USDT Perpetual, UDSC Perpetual, USDC Futures (UTA Pro)
     *
     * You can modify unfilled or partially filled orders. Conditional orders are not supported.
     *
     * A maximum of 20 orders can be amended per request.
     */
    batchAmendOrders(category: 'option' | 'linear', orders: BatchAmendOrderParamsV5[]): Promise<APIResponseV3WithTime<{
        list: BatchAmendOrderResultV5[];
    }, BatchOrdersRetExtInfoV5>>;
    /**
     * This endpoint allows you to cancel more than one open order in a single request.
     * Covers: Option (UTA, UTA Pro) / USDT Perpetual, UDSC Perpetual, USDC Futures (UTA Pro)
     *
     * You must specify orderId or orderLinkId. If orderId and orderLinkId is not matched, the system will process orderId first.
     *
     * You can cancel unfilled or partially filled orders. A maximum of 20 orders can be cancelled per request.
     */
    batchCancelOrders(category: 'option' | 'linear', orders: BatchCancelOrderParamsV5[]): Promise<APIResponseV3WithTime<{
        list: BatchCancelOrderResultV5[];
    }, BatchOrdersRetExtInfoV5>>;
    /**
     * Query the qty and amount of borrowable coins in spot account.
     *
     * Covers: Spot (Unified Account)
     */
    getSpotBorrowCheck(symbol: string, side: OrderSideV5): Promise<APIResponseV3WithTime<SpotBorrowCheckResultV5>>;
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
    setDisconnectCancelAllWindow(category: 'option', timeWindow: number): Promise<APIResponseV3<undefined>>;
    /**
     * This endpoint allows you to set the disconnection protect time window. Covers: option (unified account).
     *
     * If you need to turn it on/off, you can contact your client manager for consultation and application.
     * The default time window is 10 seconds.
     *
     * Only for institutional clients!
     */
    setDisconnectCancelAllWindowV2(params: {
        product?: 'OPTION' | 'SPOT' | 'DERIVATIVES';
        timeWindow: number;
    }): Promise<APIResponseV3<undefined>>;
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
    getPositionInfo(params: PositionInfoParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<PositionV5[]>>>;
    /**
     * Set the leverage
     *
     * Unified account covers: Linear contract
     *
     * Normal account covers: USDT perpetual / Inverse perpetual / Inverse futures
     *
     * Note: Under one-way mode, buyLeverage must be the same as sellLeverage
     */
    setLeverage(params: SetLeverageParamsV5): Promise<APIResponseV3WithTime<{}>>;
    /**
     * Select cross margin mode or isolated margin mode.
     * 0: cross margin. 1: isolated margin
     *
     * Covers: USDT perpetual (Normal account) / Inverse contract (Normal account).
     *
     * Switching margin modes will cause orders in progress to be cancelled.
     * Please make sure that there are no open orders before you switch margin modes.
     */
    switchIsolatedMargin(params: SwitchIsolatedMarginParamsV5): Promise<APIResponseV3WithTime<{}>>;
    /**
     * @deprecated
     * This endpoint sets the take profit/stop loss (TP/SL) mode to full or partial.
     *
     * Unified account covers: Linear contract; normal account covers: USDT perpetual, inverse perpetual, inverse futures.
     *
     * For partial TP/SL mode, you can set the TP/SL size smaller than position size.
     */
    setTPSLMode(params: SetTPSLModeParamsV5): Promise<APIResponseV3WithTime<{
        tpSlMode: TPSLModeV5;
    }>>;
    /**
     * Switches the position mode for USDT perpetual and Inverse futures.
     *
     * If you are in one-way Mode, you can only open one position on Buy or Sell side.
     *
     * If you are in hedge mode, you can open both Buy and Sell side positions simultaneously.
     *
     * Position mode. 0: Merged Single. 3: Both Sides.
     */
    switchPositionMode(params: SwitchPositionModeParamsV5): Promise<APIResponseV3WithTime<{}>>;
    /**
     * @deprecated
     * The risk limit will limit the maximum position value you can hold under different margin requirements.
     * If you want to hold a bigger position size, you need more margin.
     *
     * This interface can set the risk limit of a single position.
     * If the order exceeds the current risk limit when placing an order, it will be rejected.
     */
    setRiskLimit(params: SetRiskLimitParamsV5): Promise<APIResponseV3WithTime<SetRiskLimitResultV5>>;
    /**
     * This endpoint allows you to set the take profit, stop loss or trailing stop for a position.
     * Passing these parameters will create conditional orders by the system internally.
     *
     * The system will cancel these orders if the position is closed, and adjust the qty according to the size of the open position.
     *
     * Unified account covers: Linear contract.
     * Normal account covers: USDT perpetual / Inverse perpetual / Inverse futures.
     */
    setTradingStop(params: SetTradingStopParamsV5): Promise<APIResponseV3WithTime<{}>>;
    /**
     * This endpoint allows you to turn on/off auto-add-margin for an isolated margin position.
     *
     * Covers: USDT perpetual (Normal Account).
     */
    setAutoAddMargin(params: SetAutoAddMarginParamsV5): Promise<APIResponseV3WithTime<{}>>;
    /**
     * Manually add or reduce margin for isolated margin position
     *
     * Unified account covers: USDT perpetual / USDC perpetual / USDC futures / Inverse contract
     * Normal account covers: USDT perpetual / Inverse contract
     */
    addOrReduceMargin(params: AddOrReduceMarginParamsV5): Promise<APIResponseV3WithTime<AddOrReduceMarginResultV5>>;
    /**
     * Query user's closed profit and loss records. The results are sorted by createdTime in descending order.
     *
     * Unified account covers: Linear contract
     * Normal account covers: USDT perpetual / Inverse perpetual / Inverse futures
     */
    getClosedPnL(params: GetClosedPnLParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<ClosedPnLV5[]>>>;
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
    movePosition(params: MovePositionParamsV5): Promise<APIResponseV3WithTime<MovePositionResultV5>>;
    /**
     * Query moved position data by master UID api key.
     *
     * Unified account covers: USDT perpetual / USDC contract / Spot / Option
     */
    getMovePositionHistory(params?: GetMovePositionHistoryParamsV5): Promise<APIResponseV3WithTime<{
        list: MovePositionHistoryV5[];
        nextPageCursor: string;
    }>>;
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
    confirmNewRiskLimit(params: ConfirmNewRiskLimitParamsV5): Promise<APIResponseV3WithTime<{}>>;
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
    getPreUpgradeOrderHistory(params: GetPreUpgradeOrderHistoryParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<AccountOrderV5[]>>>;
    /**
     * Get users' execution records which occurred before you upgrade the account to Unified account, sorted by execTime in descending order
     *
     * For now, it only supports to query USDT perpetual, Inverse perpetual and futures.
     *
     *   - You may have multiple executions in a single order.
     *   - You can query by symbol, baseCoin, orderId and orderLinkId, and if you pass multiple params,
     *      the system will process them according to this priority: orderId > orderLinkId > symbol > baseCoin.
     */
    getPreUpgradeTradeHistory(params: GetPreUpgradeTradeHistoryParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<ExecutionV5[]>>>;
    /**
     * Query user's closed profit and loss records. The results are sorted by createdTime in descending order.
     *
     * For now, it only supports to query USDT perpetual, Inverse perpetual and futures.
     */
    getPreUpgradeClosedPnl(params: GetPreUpgradeClosedPnlParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<ClosedPnLV5[]>>>;
    /**
     * Query transaction logs which occurred in the USDC Derivatives wallet before the account was upgraded to a Unified account.
     *
     * You can get USDC Perpetual, Option records.
     *
     * INFO
     * USDC Perpeual & Option support the recent 6 months data. Please download older data via GUI
     */
    getPreUpgradeTransactions(params: GetPreUpgradeTransactionLogParamsV5): Promise<APIResponseV3WithTime<{
        list: PreUpgradeTransaction[];
        nextPageCursor: string;
    }>>;
    /**
     * Query delivery records of Option before you upgraded the account to a Unified account, sorted by deliveryTime in descending order.
     *
     * INFO
     * Supports the recent 6 months data. Please download older data via GUI
     */
    getPreUpgradeOptionDeliveryRecord(params: GetPreUpgradeOptionDeliveryRecordParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<PreUpgradeOptionsDelivery[]>>>;
    /**
     * Query session settlement records of USDC perpetual before you upgrade the account to Unified account.
     *
     * INFO
     * USDC Perpetual support the recent 6 months data. Please download older data via GUI
     */
    getPreUpgradeUSDCSessionSettlements(params: GetPreUpgradeUSDCSessionParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<PreUpgradeUSDCSessionSettlement[]>>>;
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
    getWalletBalance(params: GetWalletBalanceParamsV5): Promise<APIResponseV3WithTime<{
        list: WalletBalanceV5[];
    }>>;
    /**
     * Query the available amount to transfer of a specific coin in the Unified wallet.
     *
     * @param coinName Coin name, uppercase only
     */
    getTransferableAmount(params: {
        coinName: string;
    }): Promise<APIResponseV3WithTime<{
        availableWithdrawal: string;
    }>>;
    /**
     * Upgrade to unified account.
     *
     * Banned/OTC loan/Net asset unsatisfying/Express path users cannot upgrade the account to Unified Account for now.
     */
    upgradeToUnifiedAccount(): Promise<APIResponseV3WithTime<UnifiedAccountUpgradeResultV5>>;
    /**
     * Get interest records, sorted in reverse order of creation time.
     *
     * Unified account
     */
    getBorrowHistory(params?: GetBorrowHistoryParamsV5): Promise<APIResponseV3WithTime<CursorListV5<BorrowHistoryRecordV5[]>>>;
    /**
     * You can manually repay the liabilities of Unified account
     * Applicable: Unified Account
     * Permission: USDC Contracts
     *
     * - Input the specific coin: repay the liability of this coin in particular
     * - No coin specified: repay the liability of all coins
     */
    repayLiability(params?: RepayLiabilityParamsV5): Promise<APIResponseV3WithTime<CursorListV5<RepayLiabilityResultV5[]>>>;
    /**
     * You can decide whether the assets in the Unified account needs to be collateral coins.
     */
    setCollateralCoin(params: SetCollateralCoinParamsV5): Promise<APIResponseV3WithTime<{}>>;
    batchSetCollateralCoin(params: {
        request: SetCollateralCoinParamsV5[];
    }): Promise<APIResponseV3WithTime<{
        list: SetCollateralCoinParamsV5[];
    }>>;
    /**
     * Get the collateral information of the current unified margin account, including loan interest rate,
     * loanable amount, collateral conversion rate, whether it can be mortgaged as margin, etc.
     */
    getCollateralInfo(currency?: string): Promise<APIResponseV3WithTime<{
        list: CollateralInfoV5[];
    }>>;
    /**
     * Get current account Greeks information
     */
    getCoinGreeks(baseCoin?: string): Promise<APIResponseV3WithTime<{
        list: CoinGreeksV5[];
    }>>;
    /**
     * Get the trading fee rate.
     * Covers: Spot / USDT perpetual / Inverse perpetual / Inverse futures / Options
     */
    getFeeRate(params: GetFeeRateParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<FeeRateV5[]>>>;
    /**
     * Query the margin mode and the upgraded status of account
     */
    getAccountInfo(): Promise<APIResponseV3<AccountInfoV5>>;
    /**
     * Query the DCP configuration of the account's contracts (USDT perpetual, USDC perpetual and USDC Futures) / spot / options.
     *
     * Only the configured main / sub account can query information from this API. Calling this API by an account always returns empty.
     *
     * INFO
     * support linear contract (USDT, USDC Perp & USDC Futures) / Spot / Options only
     * Unified account only
     */
    getDCPInfo(): Promise<APIResponseV3WithTime<{
        dcpInfos: DCPInfoV5[];
    }>>;
    /**
     * Query transaction logs in Unified account.
     */
    getTransactionLog(params?: GetTransactionLogParamsV5): Promise<APIResponseV3WithTime<CursorListV5<TransactionLogV5[]>>>;
    /**
     * Query transaction logs in the derivatives wallet (classic account), and inverse derivatives wallet (upgraded to UTA).
     *
     * API key permission: "Contract - Position"
     */
    getClassicTransactionLogs(params?: GetClassicTransactionLogsParamsV5): Promise<APIResponseV3WithTime<{
        list: TransactionLogV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Query the SMP group ID of self match prevention.
     */
    getSMPGroup(): Promise<APIResponseV3WithTime<{
        smpGroup: number;
    }>>;
    /**
     * Default is regular margin mode.
     *
     * This mode is valid for USDT Perp, USDC Perp and USDC Option.
     */
    setMarginMode(marginMode: AccountMarginModeV5): Promise<APIResponseV3<{
        reasons: {
            reasonCode: string;
            reasonMsg: string;
        }[];
    }>>;
    /**
     * Turn on/off Spot hedging feature in Portfolio margin for Unified account.
     *
     * INFO
     * Only unified account is applicable
     * Only portfolio margin mode is applicable
     */
    setSpotHedging(params: {
        setHedgingMode: 'ON' | 'OFF';
    }): Promise<APIResponseV3WithTime<{}>>;
    /**
     * Configure Market Maker Protection (MMP)
     */
    setMMP(params: MMPModifyParamsV5): Promise<APIResponseV3<undefined>>;
    /**
     * Once the mmp triggered, you can unfreeze the account via this endpoint
     */
    resetMMP(baseCoin: string): Promise<APIResponseV3<undefined>>;
    /**
     * Get MMP State
     */
    getMMPState(baseCoin: string): Promise<APIResponseV3WithTime<{
        result: MMPStateV5[];
    }>>;
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
    getDeliveryRecord(params: GetDeliveryRecordParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<DeliveryRecordV5[]>>>;
    /**
     * Query session settlement records of USDC perpetual
     *
     * Covers: Linear contract (USDC Perpetual only, Unified Account)
     */
    getSettlementRecords(params: GetSettlementRecordParamsV5): Promise<APIResponseV3WithTime<CategoryCursorListV5<SettlementRecordV5[]>>>;
    /**
     * Query the coin exchange records.
     *
     * CAUTION: You may experience long delays with this endpoint.
     */
    getCoinExchangeRecords(params?: GetCoinExchangeRecordParamsV5): Promise<APIResponseV3WithTime<{
        orderBody: CoinExchangeRecordV5[];
        nextPageCursor?: string;
    }>>;
    /**
     * Query coin information, including chain information, withdraw and deposit status.
     */
    getCoinInfo(coin?: string): Promise<APIResponseV3WithTime<{
        rows: CoinInfoV5[];
    }>>;
    /**
     * Query the sub UIDs under a main UID
     *
     * CAUTION: Can query by the master UID's api key only
     */
    getSubUID(): Promise<APIResponseV3WithTime<{
        subMemberIds: string[];
        transferableSubMemberIds: string[];
    }>>;
    /**
     * Query asset information.
     *
     * INFO
     * For now, it can query SPOT only.
     */
    getAssetInfo(params: GetAssetInfoParamsV5): Promise<APIResponseV3WithTime<{
        spot: AssetInfoV5;
    }>>;
    /**
     * Query all coin balances of all account types under the master account and sub accounts.
     *
     * It is not allowed to get the master account coin balance via sub account API key.
     */
    getAllCoinsBalance(params: GetAllCoinsBalanceParamsV5): Promise<APIResponseV3WithTime<AllCoinsBalanceV5>>;
    /**
     * Query the balance of a specific coin in a specific account type. Supports querying sub UID's balance.
     *
     * CAUTION: Can query by the master UID's api key only.
     */
    getCoinBalance(params: GetAccountCoinBalanceParamsV5): Promise<APIResponseV3<AccountCoinBalanceV5>>;
    /**
     * Query withdrawable amount.
     */
    getWithdrawableAmount(params: {
        coin: string;
    }): Promise<APIResponseV3<{
        rows: WithdrawableAmountV5[];
    }>>;
    /**
     * Query the transferable coin list between each account type.
     */
    getTransferableCoinList(fromAccountType: AccountTypeV5, toAccountType: AccountTypeV5): Promise<APIResponseV3WithTime<{
        list: string[];
    }>>;
    /**
     * Create the internal transfer between different account types under the same UID.
     * Each account type has its own acceptable coins, e.g, you cannot transfer USDC from SPOT to CONTRACT.
     *
     * Please refer to the getTransferableCoinList() API to find out more.
     */
    createInternalTransfer(transferId: string, coin: string, amount: string, fromAccountType: AccountTypeV5, toAccountType: AccountTypeV5): Promise<APIResponseV3WithTime<{
        transferId: string;
        status: string;
    }>>;
    /**
     * Query the internal transfer records between different account types under the same UID.
     */
    getInternalTransferRecords(params?: GetInternalTransferParamsV5): Promise<APIResponseV3WithTime<CursorListV5<InternalTransferRecordV5[]>>>;
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
    enableUniversalTransferForSubUIDs(subMemberIds: string[]): Promise<APIResponseV3WithTime<{}>>;
    /**
     * Transfer between sub-sub or main-sub. Please make sure you have enabled universal transfer on your sub UID in advance.
     */
    createUniversalTransfer(params: UniversalTransferParamsV5): Promise<APIResponseV3WithTime<{
        transferId: string;
        status: string;
    }>>;
    /**
     * Query universal transfer records
     *
     * CAUTION
     * Can query by the master UID's API key only
     */
    getUniversalTransferRecords(params?: GetUniversalTransferRecordsParamsV5): Promise<APIResponseV3WithTime<CursorListV5<UniversalTransferRecordV5[]>>>;
    /**
     * Query allowed deposit coin information.
     * To find out paired chain of coin, please refer to the coin info api.
     */
    getAllowedDepositCoinInfo(params?: GetAllowedDepositCoinInfoParamsV5): Promise<APIResponseV3WithTime<{
        configList: AllowedDepositCoinInfoV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Set auto transfer account after deposit. The same function as the setting for Deposit on web GUI
     */
    setDepositAccount(params: {
        accountType: AccountTypeV5;
    }): Promise<APIResponseV3WithTime<{
        status: 0 | 1;
    }>>;
    /**
     * Query deposit records.
     *
     * TIP
     * endTime - startTime should be less than 30 days. Query last 30 days records by default.
     *
     * Can use main or sub UID api key to query deposit records respectively.
     */
    getDepositRecords(params?: GetDepositRecordParamsV5): Promise<APIResponseV3WithTime<{
        rows: DepositRecordV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Query subaccount's deposit records by MAIN UID's API key.
     *
     * TIP: Query deposit records of SPOT only
     *      endTime - startTime should be less than 30 days.
     *      Queries for the last 30 days worth of records by default.
     */
    getSubAccountDepositRecords(params: GetSubAccountDepositRecordParamsV5): Promise<APIResponseV3WithTime<{
        rows: DepositRecordV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Get Internal Deposit Records (across Bybit)
     * Query deposit records through Bybit platform
     *
     * RULES
     * The maximum difference between the start time and the end time is 30 days.
     * Support to get deposit records by Master or Sub Member Api Key
     */
    getInternalDepositRecords(params?: GetInternalDepositRecordParamsV5): Promise<APIResponseV3WithTime<{
        rows: InternalDepositRecordV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Query the deposit address information of MASTER account.
     */
    getMasterDepositAddress(coin: string, chainType?: string): Promise<APIResponseV3WithTime<{
        coin: string;
        chains: DepositAddressChainV5[];
    }>>;
    /**
     * Query the deposit address information of SUB account.
     */
    getSubDepositAddress(coin: string, chainType: string, subMemberId: string): Promise<APIResponseV3WithTime<{
        coin: string;
        chains: DepositAddressChainV5;
    }>>;
    /**
     * @deprecated - duplicate function, use getSubDepositAddress() instead
     * Query the deposit address information of SUB account.
     * @deprecated Duplicate endpoint - Use getSubDepositAddress() instead
     *
     * CAUTION
     * Can use master UID's api key only
     */
    querySubMemberAddress(coin: string, chainType: string, subMemberId: string): Promise<APIResponseV3<{
        coin: string;
        chains: DepositAddressChainV5;
    }>>;
    /**
     * Query withdrawal records.
     */
    getWithdrawalRecords(params?: GetWithdrawalRecordsParamsV5): Promise<APIResponseV3<CursorRowsV5<WithdrawalRecordV5[]>>>;
    /**
     * Get Exchange Entity List.
     *
     * This endpoint is particularly used for kyc=KOR users. When withdraw funds, you need to fill entity id.
     */
    getExchangeEntities(): Promise<APIResponseV3WithTime<{
        vasp: VaspEntityV5[];
    }>>;
    /**
     * Withdraw assets from the SPOT account.
     *
     * CAUTION: Make sure you have whitelisted your wallet address before calling this endpoint.
     *
     * You can make an off-chain transfer if the target wallet address is from Bybit. This means that no blockchain fee will be charged.
     */
    submitWithdrawal(params: WithdrawParamsV5): Promise<APIResponseV3WithTime<{
        id: string;
    }>>;
    /**
     * Cancel the withdrawal
     *
     * CAUTION: Can query by the master UID's api key only
     */
    cancelWithdrawal(id: string): Promise<APIResponseV3WithTime<{
        status: 0 | 1;
    }>>;
    /**
     * Query the coin list of convert from (to).
     */
    getConvertCoins(params: ConvertCoinsParamsV5): Promise<APIResponseV3WithTime<{
        coins: ConvertCoinSpecV5[];
    }>>;
    /**
     * Request a quote for converting coins.
     */
    requestConvertQuote(params: RequestConvertQuoteParamsV5): Promise<APIResponseV3WithTime<ConvertQuoteV5>>;
    /**
     * Confirm a quote for converting coins.
     */
    confirmConvertQuote(params: {
        quoteTxId: string;
    }): Promise<APIResponseV3WithTime<{
        quoteTxId: string;
        exchangeStatus: 'init' | 'processing' | 'success' | 'failure';
    }>>;
    /**
     * Query the exchange result by sending quoteTxId.
     */
    getConvertStatus(params: {
        quoteTxId: string;
        accountType: 'eb_convert_funding' | 'eb_convert_uta' | 'eb_convert_spot' | 'eb_convert_contract' | 'eb_convert_inverse';
    }): Promise<APIResponseV3WithTime<{
        result: ConvertStatusV5;
    }>>;
    /**
     * Query the conversion history.
     */
    getConvertHistory(params?: GetConvertHistoryParamsV5): Promise<APIResponseV3WithTime<{
        list: ConvertHistoryRecordV5[];
    }>>;
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
    createSubMember(params: CreateSubMemberParamsV5): Promise<APIResponseV3WithTime<CreateSubMemberResultV5>>;
    /**
     * To create new API key for those newly created sub UID. Use master user's api key only.
     *
     * TIP: The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     */
    createSubUIDAPIKey(params: CreateSubApiKeyParamsV5): Promise<APIResponseV3WithTime<CreateSubApiKeyResultV5>>;
    /**
     * This endpoint allows you to get a list of all sub UID of master account. At most 10k subaccounts.
     */
    getSubUIDList(): Promise<APIResponseV3WithTime<{
        subMembers: SubMemberV5[];
    }>>;
    /**
     * This endpoint allows you to get a list of all sub UID of master account. No limit on the number of subaccounts.
     */
    getSubUIDListUnlimited(params?: {
        pageSize?: string;
        nextCursor?: string;
    }): Promise<APIResponseV3WithTime<{
        subMembers: SubMemberV5[];
        nextCursor: string;
    }>>;
    /**
     * Froze sub uid. Use master user's api key only.
     *
     * TIP: The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     */
    setSubUIDFrozenState(subuid: number, frozen: 0 | 1): Promise<APIResponseV3WithTime<{}>>;
    /**
     * Get the information of the api key. Use the api key pending to be checked to call the endpoint.
     * Both master and sub user's api key are applicable.
     *
     * TIP: Any permission can access this endpoint.
     */
    getQueryApiKey(): Promise<APIResponseV3WithTime<ApiKeyInfoV5>>;
    /**
     * Query all api keys information of a sub UID.
     */
    getSubAccountAllApiKeys(params: GetSubAccountAllApiKeysParamsV5): Promise<APIResponseV3WithTime<{
        result: ApiKeyInfoV5[];
        nextPageCursor: string;
    }>>;
    getUIDWalletType(params: {
        memberIds: string;
    }): Promise<APIResponseV3WithTime<{
        accounts: {
            uid: string;
            accountType: string[];
        }[];
    }>>;
    /**
     * Modify the settings of a master API key. Use the API key pending to be modified to call the endpoint. Use master user's API key only.
     *
     * TIP: The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     */
    updateMasterApiKey(params: UpdateApiKeyParamsV5): Promise<APIResponseV3WithTime<UpdateApiKeyResultV5>>;
    /**
     * This endpoint modifies the settings of a sub API key.
     * Use the API key pending to be modified to call the endpoint or use master account api key to manage its sub account api key.
     * The API key must have one of the below permissions in order to call this endpoint
     *
     *  - sub API key: "Account Transfer", "Sub Member Transfer"
     *  - master API Key: "Account Transfer", "Sub Member Transfer", "Withdrawal"
     */
    updateSubApiKey(params: UpdateApiKeyParamsV5): Promise<APIResponseV3<UpdateApiKeyResultV5>>;
    /**
     * Delete a sub UID. Before deleting the UID, please make sure there are no assets.
     *
     * TIP:
     * The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     */
    deleteSubMember(params: DeleteSubMemberParamsV5): Promise<APIResponseV3WithTime<{}>>;
    /**
     * Delete the api key of master account. Use the api key pending to be delete to call the endpoint. Use master user's api key only.
     *
     * TIP:
     * The API key must have one of the permissions to be allowed to call the following API endpoint.
     * - master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"
     *
     * DANGER: BE CAREFUL! The API key used to call this interface will be invalid immediately.
     */
    deleteMasterApiKey(): Promise<APIResponseV3WithTime<{}>>;
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
    deleteSubApiKey(params?: {
        apikey?: string;
    }): Promise<APIResponseV3WithTime<{}>>;
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
    getAffiliateUserList(params?: {
        size?: number;
        cursor?: string;
    }): Promise<APIResponseV3WithTime<{
        list: AffiliateUserListItemV5[];
        nextPageCursor: string;
    }>>;
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
    getAffiliateUserInfo(params: {
        uid: string;
    }): Promise<APIResponseV3WithTime<AffiliateUserInfoV5>>;
    /**
     *
     ****** Spot Leverage Token APIs
     *
     */
    /**
     * Query leverage token information
     */
    getLeveragedTokenInfo(ltCoin?: string): Promise<APIResponseV3WithTime<{
        list: LeverageTokenInfoV5[];
    }>>;
    /**
     * Get leverage token market information.
     */
    getLeveragedTokenMarket(ltCoin: string): Promise<APIResponseV3WithTime<LeveragedTokenMarketResultV5>>;
    /**
     * This endpoint allows you to purchase a leveraged token with a specified amount.
     */
    purchaseSpotLeveragedToken(params: PurchaseSpotLeveragedTokenParamsV5): Promise<APIResponseV3WithTime<PurchaseSpotLeveragedTokenResultV5>>;
    /**
     * Redeem leveraged token.
     */
    redeemSpotLeveragedToken(params: RedeemSpotLeveragedTokenParamsV5): Promise<APIResponseV3WithTime<RedeemSpotLeveragedTokenResultV5>>;
    /**
     * Get purchase or redemption history
     */
    getSpotLeveragedTokenOrderHistory(params?: GetSpotLeveragedTokenOrderHistoryParamsV5): Promise<APIResponseV3WithTime<{
        list: SpotLeveragedTokenOrderHistoryV5[];
    }>>;
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
    getVIPMarginData(params?: GetVIPMarginDataParamsV5): Promise<APIResponseV3WithTime<VIPMarginDataV5>>;
    /**
     * Get Historical Interest Rate
     * You can query up to six months borrowing interest rate of Margin trading.
     * INFO: Need authentication, the api key needs "Spot" permission. Only supports Unified account.
     */
    getHistoricalInterestRate(params: {
        currency: string;
        vipLevel?: string;
        startTime?: number;
        endTime?: number;
    }): Promise<APIResponseV3WithTime<{
        list: {
            timestamp: number;
            currency: string;
            hourlyBorrowRate: string;
            vipLevel: string;
        }[];
    }>>;
    /**
     * Turn spot margin trade on / off in your UTA account.
     *
     * CAUTION
     * Your account needs to turn on spot margin first.
     */
    toggleSpotMarginTrade(spotMarginMode: '1' | '0'): Promise<APIResponseV3WithTime<{
        spotMarginMode: '1' | '0';
    }>>;
    /**
     * Set the user's maximum leverage in spot cross margin.
     * CAUTION: Your account needs to enable spot margin first; i.e., you must have finished the quiz on web / app.
     */
    setSpotMarginLeverage(leverage: string): Promise<APIResponseV3WithTime<{}>>;
    /**
     * Query the Spot margin status and leverage of Unified account.
     *
     * Covers: Margin trade (Unified Account)
     */
    getSpotMarginState(): Promise<APIResponseV3WithTime<SpotMarginStateV5>>;
    /**
     *
     ****** Spot Margin Trade APIs (Normal)
     *
     */
    /**
     * Get Margin Coin Info
     */
    getSpotMarginCoinInfo(coin?: string): Promise<APIResponseV3WithTime<{
        list: {
            coin: string;
            conversionRate: string;
            liquidationOrder: number;
        }[];
    }>>;
    /**
     * Get Borrowable Coin Info
     */
    getSpotMarginBorrowableCoinInfo(coin?: string): Promise<APIResponseV3WithTime<{
        list: {
            coin: string;
            borrowingPrecision: number;
            repaymentPrecision: number;
        }[];
    }>>;
    /**
     * Get Interest & Quota
     */
    getSpotMarginInterestAndQuota(coin: string): Promise<APIResponseV3WithTime<{
        list: {
            coin: string;
            interestRate: string;
            loanAbleAmount: string;
            maxLoanAmount: string;
        }[];
    }>>;
    /**
     * Get Loan Account Info
     */
    getSpotMarginLoanAccountInfo(): Promise<APIResponseV3WithTime<{
        acctBalanceSum: string;
        debtBalanceSum: string;
        loanAccountList: {
            free: string;
            interest: string;
            loan: string;
            remainAmount: string;
            locked: string;
            tokenId: string;
            total: string;
        }[];
        riskRate: string;
        status: number;
        switchStatus: number;
    }>>;
    /**
     * Borrow
     */
    spotMarginBorrow(params: {
        coin: string;
        qty: string;
    }): Promise<APIResponseV3WithTime<{
        transactId: string;
    }>>;
    /**
     * Repay
     */
    spotMarginRepay(params: {
        coin: string;
        qty?: string;
        completeRepayment: 0 | 1;
    }): Promise<APIResponseV3WithTime<{
        repayId: string;
    }>>;
    /**
     * Get Borrow Order Detail
     */
    getSpotMarginBorrowOrderDetail(params?: {
        startTime?: number;
        endTime?: number;
        coin?: string;
        status?: 0 | 1 | 2;
        limit?: number;
    }): Promise<APIResponseV3WithTime<{
        list: {
            accountId: string;
            coin: string;
            createdTime: number;
            id: string;
            interestAmount: string;
            interestBalance: string;
            loanAmount: string;
            loanBalance: string;
            remainAmount: string;
            status: string;
            type: string;
        }[];
    }>>;
    /**
     * Get Repayment Order Detail
     */
    getSpotMarginRepaymentOrderDetail(params?: {
        startTime?: number;
        endTime?: number;
        coin?: string;
        limit?: number;
    }): Promise<APIResponseV3WithTime<{
        list: {
            accountId: string;
            coin: string;
            repaidAmount: string;
            repayId: string;
            repayMarginOrderId: string;
            repayTime: string;
            transactIds: {
                repaidInterest: string;
                repaidPrincipal: string;
                repaidSerialNumber: string;
                transactId: string;
            }[];
        }[];
    }>>;
    /**
     * Turn spot margin trade on / off in your NORMAL account.
     */
    toggleSpotCrossMarginTrade(params: {
        switch: 1 | 0;
    }): Promise<APIResponseV3WithTime<{
        switchStatus: '1' | '0';
    }>>;
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
    getCollateralCoins(params?: {
        vipLevel?: string;
        currency?: string;
    }): Promise<APIResponseV3WithTime<{
        vipCoinList: VipCollateralCoinsV5[];
    }>>;
    /**
     * Get Borrowable Coins
     *
     * INFO: Do not need authentication
     */
    getBorrowableCoins(params?: {
        vipLevel?: string;
        currency?: string;
    }): Promise<APIResponseV3WithTime<{
        vipCoinList: VipBorrowableCoinsV5[];
    }>>;
    /**
     * Get Account Borrow/Collateral Limit
     * Query the account borrowable/collateral limit
     *
     * Permission: "Spot trade"
     */
    getAccountBorrowCollateralLimit(params: {
        loanCurrency: string;
        collateralCurrency: string;
    }): Promise<APIResponseV3WithTime<AccountBorrowCollateralLimitV5>>;
    /**
     * Borrow Crypto Loan
     *
     * Permission: "Spot trade"
     *
     * INFO:
     * The loan funds are released to the Funding account
     * The collateral funds are deducted from the Funding account, so make sure you have enough collateral amount in the funding wallet
     */
    borrowCryptoLoan(params: BorrowCryptoLoanParamsV5): Promise<APIResponseV3WithTime<{
        orderId: string;
    }>>;
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
    repayCryptoLoan(params: {
        orderId: string;
        amount: string;
    }): Promise<APIResponseV3WithTime<{
        repayId: string;
    }>>;
    /**
     * Get Unpaid Loan Orders
     * Query the ongoing loan orders, which are not fully repaid
     *
     * Permission: "Spot trade"
     */
    getUnpaidLoanOrders(params?: GetUnpaidLoanOrdersParamsV5): Promise<APIResponseV3WithTime<{
        list: UnpaidLoanOrderV5[];
        nextPageCursor: string;
    }>>;
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
    getRepaymentHistory(params?: GetRepaymentHistoryParamsV5): Promise<APIResponseV3WithTime<{
        list: RepaymentHistoryV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Get Completed Loan Order History
     * Query the completed loan orders
     *
     * Permission: "Spot trade"
     *
     * INFO:
     * Support querying last 6 months completed loan orders
     */
    getCompletedLoanOrderHistory(params?: GetCompletedLoanOrderHistoryParamsV5): Promise<APIResponseV3WithTime<{
        list: CompletedLoanOrderV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Get Max. Allowed Reduction Collateral Amount
     * Query the maximum allowed reduction collateral amount
     *
     * Permission: "Spot trade"
     */
    getMaxAllowedReductionCollateralAmount(params: {
        orderId: string;
    }): Promise<APIResponseV3WithTime<{
        maxCollateralAmount: string;
    }>>;
    /**
     * Adjust Collateral Amount
     * You can increase or reduce collateral amount. When you reduce, please follow the max. allowed reduction amount.
     *
     * Permission: "Spot trade"
     *
     * INFO:
     * The adjusted collateral amount will be returned to or deducted from Funding account
     */
    adjustCollateralAmount(params: {
        orderId: string;
        amount: string;
        direction: '0' | '1';
    }): Promise<APIResponseV3WithTime<{
        adjustId: string;
    }>>;
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
    getLoanLTVAdjustmentHistory(params?: GetLoanLTVAdjustmentHistoryParamsV5): Promise<APIResponseV3WithTime<{
        list: LoanLTVAdjustmentHistoryV5[];
        nextPageCursor: string;
    }>>;
    /**
     *
     ****** Institutional Lending
     *
     */
    /**
     * Get Product Info
     */
    getInstitutionalLendingProductInfo(productId?: string): Promise<APIResponseV3WithTime<{
        marginProductInfo: any[];
    }>>;
    /**
     * Get Margin Coin Info
     * @deprecated
     */
    getInstitutionalLendingMarginCoinInfo(productId?: string): Promise<APIResponseV3WithTime<{
        marginToken: any[];
    }>>;
    /**
     * Get Margin Coin Info With Conversion Rate
     */
    getInstitutionalLendingMarginCoinInfoWithConversionRate(productId?: string): Promise<APIResponseV3WithTime<{
        marginToken: any[];
    }>>;
    /**
     * Get Loan Orders
     */
    getInstitutionalLendingLoanOrders(params?: {
        orderId?: string;
        startTime?: number;
        endTime?: number;
        limit?: number;
    }): Promise<APIResponseV3WithTime<{
        loanInfo: any[];
    }>>;
    /**
     * Get Repay Orders
     */
    getInstitutionalLendingRepayOrders(params?: {
        startTime?: number;
        endTime?: number;
        limit?: number;
    }): Promise<APIResponseV3WithTime<{
        repayInfo: any[];
    }>>;
    /**
     * Get LTV
     * @deprecated
     */
    getInstitutionalLendingLTV(): Promise<APIResponseV3WithTime<{
        ltvInfo: any[];
    }>>;
    /**
     * Get LTV with Ladder Conversion Rate
     */
    getInstitutionalLendingLTVWithLadderConversionRate(): Promise<APIResponseV3WithTime<{
        ltvInfo: any[];
    }>>;
    /**
     * Bind or unbind UID for the institutional loan product.
     *
     * INFO
     * Risk unit designated UID cannot be unbound
     * This endpoint can only be called by uids in the risk unit list
     * The UID must be upgraded to UTA Pro if you try to bind it.
     * When the API is operated through the API Key of any UID in the risk unit, the UID is bound or unbound in the risk unit.
     */
    bindOrUnbindUID(params: {
        uid: string;
        operate: '0' | '1';
    }): Promise<APIResponseV3WithTime<{
        uid: string;
        operate: '0' | '1';
    }>>;
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
    getExchangeBrokerEarnings(params?: GetExchangeBrokerEarningsParamsV5): Promise<APIResponseV3WithTime<ExchangeBrokerEarningResultV5>>;
    /**
     * Get Exchange Broker Account Info.
     *
     * INFO
     * Use exchange broker master account to query
     * API rate limit: 10 req / sec
     */
    getExchangeBrokerAccountInfo(): Promise<APIResponseV3WithTime<ExchangeBrokerAccountInfoV5>>;
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
    getBrokerSubAccountDeposits(params?: GetBrokerSubAccountDepositsV5): Promise<APIResponseV3WithTime<{
        rows: ExchangeBrokerSubAccountDepositRecordV5[];
        nextPageCursor: string;
    }>>;
    /**
     * Query Voucher Spec
     */
    getBrokerVoucherSpec(params: {
        id: string;
    }): Promise<APIResponseV3WithTime<BrokerVoucherSpecV5>>;
    /**
     * Issue a voucher to a user
     *
     * INFO
     * Use exchange broker master account to issue
     */
    issueBrokerVoucher(params: IssueVoucherParamsV5): Promise<APIResponseV3<undefined>>;
    /**
     * Query an issued voucher
     *
     * INFO
     * Use exchange broker master account to query
     */
    getBrokerIssuedVoucher(params: GetBrokerIssuedVoucherParamsV5): Promise<APIResponseV3<BrokerIssuedVoucherV5>>;
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
    getEarnProduct(params: {
        category: string;
        coin?: string;
    }): Promise<APIResponseV3WithTime<{
        list: EarnProductV5[];
    }>>;
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
    submitStakeRedeem(params: SubmitStakeRedeemParamsV5): Promise<APIResponseV3WithTime<{
        orderId: string;
        orderLinkId: string;
    }>>;
    /**
     * Get Stake/Redeem Order History
     *
     * INFO: API key needs "Earn" permission
     *
     * Note: Either orderId or orderLinkId is required. If both are passed,
     * make sure they're matched, otherwise returning empty result
     */
    getEarnOrderHistory(params: GetEarnOrderHistoryParamsV5): Promise<APIResponseV3WithTime<{
        list: EarnOrderHistoryV5[];
    }>>;
    /**
     * Get Staked Position
     *
     * INFO: API key needs "Earn" permission
     *
     * Note: Fully redeemed position is also returned in the response
     */
    getEarnPosition(params: GetEarnPositionParamsV5): Promise<APIResponseV3WithTime<{
        list: EarnPositionV5[];
    }>>;
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
    getP2PAccountCoinsBalance(params: GetP2PAccountCoinsBalanceParamsV5): Promise<APIResponseV3WithTime<P2PAccountCoinsBalanceV5>>;
    /**
     *
     * Advertisement P2P
     */
    /**
     * Get market online ads list
     */
    getP2POnlineAds(params: GetP2POnlineAdsParamsV5): Promise<APIResponseV3WithTime<P2POnlineAdsResponseV5>>;
    /**
     * Post new P2P advertisement
     */
    createP2PAd(params: CreateP2PAdParamsV5): Promise<APIResponseV3WithTime<P2PCreateAdResponseV5>>;
    /**
     * Cancel P2P advertisement
     */
    cancelP2PAd(params: {
        itemId: string;
    }): Promise<APIResponseV3WithTime<{
        securityRiskToken: string;
        riskTokenType: string;
        riskVersion: string;
        needSecurityRisk: boolean;
    }>>;
    /**
     * Update or relist P2P advertisement
     */
    updateP2PAd(params: UpdateP2PAdParamsV5): Promise<APIResponseV3WithTime<P2PCreateAdResponseV5>>;
    /**
     * Get personal P2P ads list
     *
     */
    getP2PPersonalAds(params: GetP2PPersonalAdsParamsV5): Promise<APIResponseV3WithTime<P2PPersonalAdsResponseV5>>;
    /**
     * Get P2P ad details
     */
    getP2PAdDetail(params: {
        itemId: string;
    }): Promise<APIResponseV3WithTime<P2PAdDetailV5>>;
    /**
     *
     * Orders P2P
     */
    /**
     * Get all P2P orders
     *
     */
    getP2POrders(params: GetP2POrdersParamsV5): Promise<APIResponseV3WithTime<P2POrdersResponseV5>>;
    /**
     * Get P2P order details
     *
     */
    getP2POrderDetail(params: {
        orderId: string;
    }): Promise<APIResponseV3WithTime<P2POrderDetailV5>>;
    /**
     * Get pending P2P orders
     */
    getP2PPendingOrders(params: GetP2PPendingOrdersParamsV5): Promise<APIResponseV3WithTime<P2POrdersResponseV5>>;
    /**
     * Mark P2P order as paid
     */
    markP2POrderAsPaid(params: MarkP2POrderAsPaidParamsV5): Promise<APIResponseV3WithTime<null>>;
    /**
     * Release digital assets in a P2P order
     */
    releaseP2POrder(params: {
        orderId: string;
    }): Promise<APIResponseV3WithTime<null>>;
    /**
     * Send chat message in a P2P order
     */
    sendP2POrderMessage(params: SendP2POrderMessageParamsV5): Promise<APIResponseV3WithTime<null>>;
    /**
     * Upload chat file for P2P order
     */
    uploadP2PChatFile(params: {
        upload_file: File;
    }): Promise<APIResponseV3WithTime<null>>;
    /**
     * Get chat messages in a P2P order
     */
    getP2POrderMessages(params: GetP2POrderMessagesParamsV5): Promise<APIResponseV3WithTime<P2POrderMessageV5[]>>;
    /**
     *
     * User P2P
     */
    /**
     * Get P2P user account information
     */
    getP2PUserInfo(): Promise<APIResponseV3WithTime<P2PUserInfoV5>>;
    /**
     * Get counterparty user information in a P2P order
     */
    getP2PCounterpartyUserInfo(params: GetP2PCounterpartyUserInfoParamsV5): Promise<APIResponseV3WithTime<P2PCounterpartyUserInfoV5>>;
    /**
     * Get user payment information
     */
    getP2PUserPayments(): Promise<APIResponseV3WithTime<P2PUserPaymentV5[]>>;
}
