import { expect } from 'chai'
import 'mocha'
import * as td from 'testdouble'

import { Env } from '@truesparrow/common-js'

import { newLocalCommonServerMiddleware, newCommonServerMiddleware } from './common-server-middleware'


describe('LocalCommonServerMiddleware', () => {
    it('should create a completed request object', (done) => {
        const serverMiddleware = newLocalCommonServerMiddleware('truesparrow', Env.Local, true);

        const rightNow = new Date(Date.now());

        const mockReq = td.object({
            requestTime: null,
            log: null,
            errorLog: null,
            header: () => { }
        });
        const mockRes = td.object(['on']);

        serverMiddleware(mockReq as any, mockRes as any, () => {
            expect(mockReq.requestTime).to.be.not.null;
            expect((mockReq as any).requestTime.getTime()).to.be.gte(rightNow.getTime());
            expect((mockReq as any).requestTime.getTime()).to.be.approximately(rightNow.getTime(), 10);
            expect(mockReq.log).to.be.not.null;
            expect(mockReq.errorLog).to.be.not.null;
            done();
        });
    });
});


describe('CommonServerMiddleware', () => {
    it('should create a completed request object', (done) => {
        const serverMiddleware = newCommonServerMiddleware('truesparrow', Env.Prod, 'BAD', 'BAD', 'BAD');

        const rightNow = new Date(Date.now());

        const mockReq = td.object({
            requestTime: null,
            log: null,
            errorLog: null,
            header: () => { }
        });
        const mockRes = td.object(['on']);

        serverMiddleware(mockReq as any, mockRes as any, () => {
            expect(mockReq.requestTime).to.be.not.null;
            expect((mockReq as any).requestTime.getTime()).to.be.gte(rightNow.getTime());
            expect((mockReq as any).requestTime.getTime()).to.be.approximately(rightNow.getTime(), 10);
            expect(mockReq.log).to.be.not.null;
            expect(mockReq.errorLog).to.be.not.null;
            done();
        });
    });
});
