/** Defines factories for middleware for dealing with per-request namespaces. */

/** Imports. Also so typedoc works correctly. */
import * as express from 'express'
import { Namespace } from 'continuation-local-storage'

import { Request } from './request'


/**
 * Create a namespace middleware. This binds the current request with a "namespace" provided
 * via a [Continuation local storage]{@link https://www.npmjs.com/package/continuation-local-storage}.
 * This allows us to associate some data with a request, but have it accessible from a non-request
 * context. This is mostly used by frontend servers to populate data at the request level, which
 * is then accessible in the shared UI components for server-side rendering. So a pretty specialized
 * role.
 * @param ns - a namespace object created via {@link createNamespace}.
 * @returns an {@link express.RequestHandler} which does all of the above.
 */
export function newNamespaceMiddleware(ns: Namespace): express.RequestHandler {
    return (req: Request, res: express.Response, next: express.NextFunction): any => {
        ns.bindEmitter(req);
        ns.bindEmitter(res);

        ns.run(function() {
            next();
        });
    };
};
