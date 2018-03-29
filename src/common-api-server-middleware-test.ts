import 'mocha'
import * as td from 'testdouble'

import { newCommonApiServerMiddleware } from './common-api-server-middleware'


describe('CommonApiServerMiddleware', () => {
    it('should set json type', (done) => {
        const middleware = newCommonApiServerMiddleware();

        const mockReq = td.object({
            header: (_name: string) => { },
            headers: {}
        });
        const mockRes = td.object(['type']);

        middleware(mockReq as any, mockRes as any, () => {
            td.verify(mockRes.type('json'));
            done();
        });
    });
});
