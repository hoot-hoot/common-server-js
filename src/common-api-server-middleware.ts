/** Defines a factory for middleware which ensures the basic structure of any `truesparrow` API server. */

/** Imports. Also so typedoc works correctly. */
import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import { Request } from './request'


/**
 * Create an express middleware component which takes care of common structure for API servers.
 * It ensures that there is an Origin header and that it one of a set of allowed origins. It also
 * sets the response content type to JSON, as all our API servers write JSON.
 * @remark The check is textual, so anyone can fake such a request if they're in the proper
 * position, but it is a start to identity based checks.
 * @param clients - an array of hostnames, indicating the allowed services, both client and server
 *     which can contact this API.
 * @returns an {@link express.RequestHandler} which does all of the above.
 */
export function newCommonApiServerMiddleware(clients: string[]): express.RequestHandler {
    const localClients = clients.slice(0);

    return (req: Request, res: express.Response, next: express.NextFunction) => {
        const origin = req.header('Origin') as string;

        if (localClients.indexOf(origin) == -1) {
            req.log.warn('Origin is not allowed');
            res.status(HttpStatus.BAD_REQUEST);
            res.end();
            return;
        }

        res.type('json');

        // Fire away.
        next();
    };
}
