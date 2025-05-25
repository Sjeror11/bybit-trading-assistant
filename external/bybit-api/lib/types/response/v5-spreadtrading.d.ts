export interface SpreadInstrumentInfoV5 {
    symbol: string;
    contractType: 'FundingRateArb' | 'CarryTrade' | 'FutureSpread' | 'PerpBasis';
    status: 'Trading' | 'Settling';
    baseCoin: string;
    quoteCoin: string;
    settleCoin: string;
    tickSize: string;
    minPrice: string;
    maxPrice: string;
    lotSize: string;
    minSize: string;
    maxSize: string;
    launchTime: string;
    deliveryTime: string;
    legs: {
        symbol: string;
        contractType: 'LinearPerpetual' | 'LinearFutures' | 'Spot';
    }[];
}
export interface SpreadOrderbookResponseV5 {
    s: string;
    b: [string, string][];
    a: [string, string][];
    u: number;
    ts: number;
    seq: number;
    cts: number;
}
export interface SpreadTickerV5 {
    symbol: string;
    bidPrice: string;
    bidSize: string;
    askPrice: string;
    askSize: string;
    lastPrice: string;
    highPrice24h: string;
    lowPrice24h: string;
    prevPrice24h: string;
    volume24h: string;
}
export interface SpreadRecentTradeV5 {
    execId: string;
    symbol: string;
    price: string;
    size: string;
    side: 'Buy' | 'Sell';
    time: string;
}
export interface SpreadOpenOrderV5 {
    symbol: string;
    baseCoin: string;
    orderType: 'Market' | 'Limit';
    orderLinkId: string;
    side: 'Buy' | 'Sell';
    timeInForce: 'GTC' | 'FOK' | 'IOC' | 'PostOnly';
    orderId: string;
    leavesQty: string;
    orderStatus: 'New' | 'PartiallyFilled';
    cumExecQty: string;
    price: string;
    qty: string;
    createdTime: string;
    updatedTime: string;
}
export interface SpreadOrderHistoryV5 {
    symbol: string;
    orderType: 'Market' | 'Limit';
    orderLinkId: string;
    orderId: string;
    contractType: 'FundingRateArb' | 'CarryTrade' | 'FutureSpread' | 'PerpBasis';
    orderStatus: 'Rejected' | 'Cancelled' | 'Filled';
    price: string;
    orderQty: string;
    timeInForce: 'GTC' | 'FOK' | 'IOC' | 'PostOnly';
    baseCoin: string;
    createdAt: string;
    updatedAt: string;
    side: 'Buy' | 'Sell';
    leavesQty: string;
    settleCoin: string;
    cumExecQty: string;
    qty: string;
    leg1Symbol: string;
    leg1ProdType: 'Futures' | 'Spot';
    leg1OrderId: string;
    leg1Side: string;
    leg2ProdType: 'Futures' | 'Spot';
    leg2OrderId: string;
    leg2Symbol: string;
    leg2Side: string;
    cxlRejReason: string;
}
export interface SpreadTradeLegV5 {
    symbol: string;
    side: 'Buy' | 'Sell';
    execPrice: string;
    execTime: string;
    execValue: string;
    execType: string;
    category: 'linear' | 'spot';
    execQty: string;
    execFee: string;
    execId: string;
}
export interface SpreadTradeV5 {
    symbol: string;
    orderLinkId: string;
    side: 'Buy' | 'Sell';
    orderId: string;
    execPrice: string;
    execTime: string;
    execType: 'Trade';
    execQty: string;
    execId: string;
    legs: SpreadTradeLegV5[];
}
