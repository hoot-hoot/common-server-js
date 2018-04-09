/** Defines a factory for middleware which ensures the basic structure of any `truesparrow` frontend server. */

/** Imports. Also so typedoc works correctly. */
import * as express from 'express'

import { Env, isOnServer } from '@truesparrow/common-js'

import { Request } from './request'

const newSslifyMiddlware = require('express-sslify');
const newHstsMiddleware = require('hsts');


/**
 * Create an express middleware component which takes care of common structure for frontend servers.
 * Does a redirect to HTTPS from HTTP if we're in a production setup with the X-Forwarded-Proto header.
 * This only happens for safe requests - GET & HEAD. All of the others get 403ed by default, since we
 * don't want people making them over HTTP to begin with and they can only occur after a GET anyway.
 * Also enables HSTS and will send that header for subdomains and 30 days.
 * @note Will only apply this in a "server" context - the staging and live environments.
 * @param exceptionPaths - a set of paths to not use HTTPS on or enable HSTS. These are usually things
 *     used internally, such as health checks or dev routes which are called over simple HTTP.
 * @returns an {@link express.RequestHandler} which does all of the above.
 */
export function newCommonFrontendServerMiddleware(env: Env, exceptionPaths: string[]): express.RequestHandler {
    const sslifyMiddleware = newSslifyMiddlware.HTTPS({ trustProtoHeader: true });
    const hstsMiddleware = newHstsMiddleware({
        maxAge: 43200,
        includeSubdomains: true,
        preload: false
    });

    return (req: Request, res: express.Response, next: express.NextFunction) => {
        if (exceptionPaths.indexOf(req.originalUrl) != -1) {
            next();
            return;
        }

        if (!isOnServer(env)) {
            next();
            return;
        }

        sslifyMiddleware(req, res, () => {
            hstsMiddleware(req, res, () => {
                next();
            });
        });
    };
}
