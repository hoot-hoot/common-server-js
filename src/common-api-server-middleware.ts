/** Defines a factory for middleware which ensures the basic structure of any `truesparrow` API server. */

/** Imports. Also so typedoc works correctly. */
import * as bodyParser from 'body-parser'
import * as express from 'express'

import { Request } from './request'


/**
 * Create an express middleware component which takes care of common structure for API servers.
 * It ensures that there is an Origin header and that it one of a set of allowed origins. It also
 * sets the response content type to JSON, as all our API servers write JSON. It also parses the
 * request body as a JSON object so it is available to components upstream of this one via the
 * body property.
 * @note A limit of 100kb is placed on inputs.
 * @remark The check is textual, so anyone can fake such a request if they're in the proper
 * position, but it is a start to identity based checks.
 *     which can contact this API.
 * @returns an {@link express.RequestHandler} which does all of the above.
 */
export function newCommonApiServerMiddleware(): express.RequestHandler {
    const bodyParserMiddleware = bodyParser.json({ limit: '100kb' });

    return (req: Request, res: express.Response, next: express.NextFunction) => {
        bodyParserMiddleware(req, res, () => {
            res.type('json');
            // Fire away.
            next();
        });
    };
}
