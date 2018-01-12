/** Defines factories for middleware which ensures the basic structure of any `hoot-hoot` server. */

/** Imports. Also so typedoc works correctly. */
import * as express from 'express'
import * as Rollbar from 'rollbar'

import { Env, envToString } from '@hoot-hoot/common-js'

import { Request } from './request'

/** @private */
const newBunyanLoggerMiddleware = require('express-bunyan-logger');
/** @private */
const Bunyan2Loggly = require('bunyan-loggly');


/** @private */
const LOGGLY_BUFFER_SIZE = 10;
/** @private */
const LOGGLY_TIMEOUT_MS = 1000;


/**
 * Create an express middleware component which takes care of the common structure of servers.
 * This is meant for local usage - that is Local or Dev, but not Staging or Prod.
 * Should be the first middleware used in a middleware chain. It ensures that the later routers,
 * handlers and middleware receive a properly formatted {@link Request}. More precisely, it
 * populates the {@link Request.requestTime} field with the current time in UTC, configures
 * {@link Request.logger} to be a bunyan logger instance configured for STDOUT logging and
 * configures {@link Request.errorLog} to be a Rollbar instance with remote recording disabled.
 * @param name - the name of the service.
 * @param env - the environment in which the code is running.
 * @param testDisable - disable logging for testing.
 * @returns an {@link express.RequestHandler} which does all of the above.
 */
export function newLocalCommonServerMiddleware(name: string, env: Env, testDisable: boolean): express.RequestHandler {
    const bunyanLoggerMiddleware = newBunyanLoggerMiddleware({
        name: name,
        streams: testDisable ? [] : [{
            level: 'info',
            stream: process.stdout
        }],
        "hoot-hoot": {
            serviceName: name,
            env: envToString(env)
        }
    });

    const rollbar = new Rollbar({
        accessToken: 'FAKE_TOKEN_WONT_BE_USED_IN_LOCAL_OR_TEST',
        logLevel: 'warning',
        reportLevel: 'warning',
        captureUncaught: true,
        captureUnhandledRejections: true,
        enabled: false,
        payload: {
            // TODO: fill in the person field!
            serviceName: name,
            environment: envToString(env)
        }
    });

    return function(req: Request, res: express.Response, next: express.NextFunction): any {
        req.requestTime = new Date(Date.now());
        req.errorLog = rollbar;
        bunyanLoggerMiddleware(req, res, next);
    };
}


/**
 * Create an express middleware component which takes care of the common structure of servers.
 * Should be the first middleware used in a middleware chain. It ensures that the later routers,
 * handlers and middleware receive a properly formatted {@link Request}. More precisely, it
 * populates the {@link Request.requestTime} field with the current time in UTC, configures
 * {@link Request.logger} to be a bunyan logger instance configured for STDOUT and Loggly logging
 * and configures {@link Request.errorLog} to be a Rollbar instance with remote recording enabled.
 * @param name - the name of the service.
 * @param env - the environment in which the code is running.
 * @param logglyToken - the secret token required for Loggly communication.
 * @param logglySubdomain - the subdomain assigned to us by Loggly.
 * @param rollbarToken - the secret token required for Rollbar communication.
 * @returns an {@link express.RequestHandler} which does all of the above.
 */
export function newCommonServerMiddleware(
    name: string,
    env: Env,
    logglyToken: string,
    logglySubdomain: string,
    rollbarToken: string): express.RequestHandler {
    const bunyanLoggerMiddleware = newBunyanLoggerMiddleware({
        name: name,
        streams: [{
            level: 'info',
            stream: process.stdout
        }, {
            level: 'info',
            type: 'raw',
            stream: new Bunyan2Loggly({ token: logglyToken, subdomain: logglySubdomain }, LOGGLY_BUFFER_SIZE, LOGGLY_TIMEOUT_MS)
        }],
        "hoot-hoot": {
            serviceName: name,
            env: envToString(env)
        }
    });

    const rollbar = new Rollbar({
        accessToken: rollbarToken,
        logLevel: 'warning',
        reportLevel: 'warning',
        captureUncaught: true,
        captureUnhandledRejections: true,
        enabled: true,
        payload: {
            // TODO: fill in the person field!
            serviceName: name,
            environment: envToString(env)
        }
    });

    return function(req: Request, res: express.Response, next: express.NextFunction): any {
        req.requestTime = new Date(Date.now());
        req.errorLog = rollbar;
        bunyanLoggerMiddleware(req, res, next);
    };
}
