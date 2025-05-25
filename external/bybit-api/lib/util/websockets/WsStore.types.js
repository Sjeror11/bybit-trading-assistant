"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsConnectionStateEnum = void 0;
var WsConnectionStateEnum;
(function (WsConnectionStateEnum) {
    WsConnectionStateEnum[WsConnectionStateEnum["INITIAL"] = 0] = "INITIAL";
    WsConnectionStateEnum[WsConnectionStateEnum["CONNECTING"] = 1] = "CONNECTING";
    WsConnectionStateEnum[WsConnectionStateEnum["CONNECTED"] = 2] = "CONNECTED";
    WsConnectionStateEnum[WsConnectionStateEnum["CLOSING"] = 3] = "CLOSING";
    WsConnectionStateEnum[WsConnectionStateEnum["RECONNECTING"] = 4] = "RECONNECTING";
    // ERROR_RECONNECTING = 5,
    // ERROR = 5,
})(WsConnectionStateEnum || (exports.WsConnectionStateEnum = WsConnectionStateEnum = {}));
//# sourceMappingURL=WsStore.types.js.map