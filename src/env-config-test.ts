import { expect } from 'chai'
import 'mocha'

import { getFromEnv } from './env-config'


describe('getFromEnv', () => {
    it('should allow a value which exists', () => {
        process.env.EXODUS = 'Movement of the people';
        expect(getFromEnv('EXODUS')).to.eql('Movement of the people');
    });

    it('should trim extra whitespace for an existing value', () => {
        process.env.EXODUS = '  Movement of  the people\t';
        expect(getFromEnv('EXODUS')).to.eql('Movement of  the people');
    });

    it('should throw for a missing value', () => {
        process.env.EXODUS = 'Movement of the people';
        expect(() => getFromEnv('JAMMING')).to.throw('Config value JAMMING is not specified');
    });

    it('should throw for an empty value', () => {
        process.env.EXODUS = ' ';
        expect(() => getFromEnv('EXODUS')).to.throw('Config value EXODUS is not specified');
    });
});
