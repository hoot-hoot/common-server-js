/** Defines {@link Request}. */

/** Imports. Also so typedoc works correctly. */
import * as Logger from 'bunyan'
import * as express from 'express'
import * as Rollbar from 'rollbar'


/**
 * The `truesparrow` standard request. It is an extension to the {@link express.Request}, which is itself
 * based off of the node one.
 */
export interface Request extends express.Request {
    /**
     * The time at which the request was recorded by the system. Time is UTC and recorded as the
     * local time of the machine handling the request.
     */
    requestTime: Date;
    /**
     * An instance of a [bunyan]{@link https://github.com/trentm/node-bunyan} {@link Logger}. In
     * a production context (either Staging or Prod), this is hooked up to the
     * [Loggly]{@link https://www.loggly.com/} log collection service.
     */
    log: Logger;
    /**
     * An instance of a [Rollbar]{@link https://rollbar.com/} error collector. In a production
     * context (either Staging or Prod), this is hooked up to the actual service.
     */
    errorLog: Rollbar;
}
