import 'isomorphic-fetch'


/**
 * Defines the {@link WebFetcher} interface, and the two standard implementations of it,
 * {@link InternalWebFetcher} and {@link ApiGatewayWebFetcher}.
 */

/**
 * The common interface for objects which can do a [fetch]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}.
 * Useful for inversion of control patterns and testing.
 */
export interface WebFetcher {
    /**
     * Perform a HTTP request like in [fetch]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}.
     * @param url - The address of the resource to perform the request to.
     * @param options - The various request options as documented [here]{@link https://developer.mozilla.org/en-US/docs/Web/API/Request/Request}.
     * @returns A {@link Promise} with a [Response]{@link https://developer.mozilla.org/en-US/docs/Web/API/Response} type.
     */
    fetch(uri: string, options: RequestInit): Promise<Response>;
}


/**
 * A {@link WebFetcher} for communication between services on the server side.
 */
export class InternalWebFetcher implements WebFetcher {
    /**
     * Perform a HTTP request like in [fetch]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}, but via Node, rather
     * than the browser-based one.
     * @param url - The address of the resource to perform the request to.
     * @param options - The various request options as documented [here]{@link https://developer.mozilla.org/en-US/docs/Web/API/Request/Request}.
     * @returns A {@link Promise} with a [Response]{@link https://developer.mozilla.org/en-US/docs/Web/API/Response} type.
     */
    async fetch(uri: string, options: RequestInit): Promise<Response> {
        return await fetch(uri, options);
    }
}


/**
 * A {@link WebFetcher} for communication between a client and a server-side service, via an
 * intermediary gateway. This gateway is usually just the client's corresponding backend service.
 * This mechanism is needed to (1) insulate the internal API services from external calls, (2)
 * perform a translation between the cookie-based auth present on the client side to the header
 * based on on internal calls, and (3) eliminate the need for CORS and it's not-so-nice interactions
 * with cross-domain authentication.
 */
export class ApiGatewayWebFetcher implements WebFetcher {
    private static readonly _options: any = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'error',
        referrer: 'client',
        credentials: 'include'
    };

    private readonly _apiGatewayHost: string;

    /**
     * Construct a {@link ApiGatewayWebFetcher}.
     * @param apiGatewayHost - the host which acts as the API gateway. The client's corresponding
     *     backend.
     */
    constructor(apiGatewayHost: string) {
        this._apiGatewayHost = apiGatewayHost;
    }

    /**
     * Perform a HTTP request like in [fetch]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}.
     * @param url - The address of the resource to perform the request to.
     * @param options - The various request options as documented [here]{@link https://developer.mozilla.org/en-US/docs/Web/API/Request/Request}.
     * @returns A {@link Promise} with a [Response]{@link https://developer.mozilla.org/en-US/docs/Web/API/Response} type.
     */
    async fetch(uri: string, options: any): Promise<Response> {
        const gatewayOptions = (Object as any).assign({}, ApiGatewayWebFetcher._options);
        gatewayOptions.headers = { 'Content-Type': 'application/json' };
        gatewayOptions.body = JSON.stringify({
            uri: uri,
            options: options
        });

        return await fetch(`${this._apiGatewayHost}/real/api-gateway`, gatewayOptions);
    }
}
