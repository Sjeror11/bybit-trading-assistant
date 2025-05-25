export type SignEncodeMethod = 'hex' | 'base64';
export type SignAlgorithm = 'SHA-256' | 'SHA-512';
/**
 * Similar to node crypto's `createHash()` function
 */
export declare function hashMessage(message: string, method: SignEncodeMethod, algorithm: SignAlgorithm): Promise<string>;
/**
 * Sign a message, with a secret, using the Web Crypto API
 */
export declare function signMessage(message: string, secret: string, method: SignEncodeMethod, algorithm: SignAlgorithm): Promise<string>;
