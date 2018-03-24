/** Defines a factory for a router which responds to GCP healthchecks. */

/** Imports. Also so typedoc works correctly. */
import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import { Request } from './request'


/**
 * Create a health-check router.
 * @note This simply is a router with a '/check' path, which, when called with GET
 *     returns a 200 OK status. It _could_ become more complicated. But it's purpose is to
 *     very much fail loudly when the whole service fails, so that other pieces of the
 *     infrastructure take notice and act on it.
 * @return A new router.
 */
export function newHealthCheckRouter(): express.Router {
    const healthCheckRouter = express.Router();

    healthCheckRouter.get('/check', (_req: Request, res: express.Response) => {
        res.status(HttpStatus.OK);
        res.type('.txt');
        res.send('Everything looks A-OK');
        res.end();
    });

    return healthCheckRouter;
}
