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
exports.hashMessage = hashMessage;
exports.signMessage = signMessage;
const typeGuards_1 = require("./typeGuards");
function bufferToB64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return globalThis.btoa(binary);
}
/**
 * Similar to node crypto's `createHash()` function
 */
function hashMessage(message, method, algorithm) {
    return __awaiter(this, void 0, void 0, function* () {
        const encoder = new TextEncoder();
        const buffer = yield globalThis.crypto.subtle.digest(algorithm, encoder.encode(message));
        switch (method) {
            case 'hex': {
                return Array.from(new Uint8Array(buffer))
                    .map((byte) => byte.toString(16).padStart(2, '0'))
                    .join('');
            }
            case 'base64': {
                return bufferToB64(buffer);
            }
            default: {
                throw (0, typeGuards_1.neverGuard)(method, `Unhandled sign method: "${method}"`);
            }
        }
    });
}
/**
 * Sign a message, with a secret, using the Web Crypto API
 */
function signMessage(message, secret, method, algorithm) {
    return __awaiter(this, void 0, void 0, function* () {
        const encoder = new TextEncoder();
        const key = yield globalThis.crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: algorithm }, false, ['sign']);
        const buffer = yield globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(message));
        switch (method) {
            case 'hex': {
                return Array.from(new Uint8Array(buffer))
                    .map((byte) => byte.toString(16).padStart(2, '0'))
                    .join('');
            }
            case 'base64': {
                return bufferToB64(buffer);
            }
            default: {
                throw (0, typeGuards_1.neverGuard)(method, `Unhandled sign method: "${method}"`);
            }
        }
    });
}
//# sourceMappingURL=webCryptoAPI.js.map