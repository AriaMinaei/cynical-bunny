import wn from 'when';
import runExecutableTree from '../src/runExecutableTree';
import {inSandbox} from './helpers';
import * as api from '../src/bddApi';

describe('runExecutableTree()', () => {
    let timeline;

    beforeEach(() => {
        timeline = [];
    });

    function synclySucceed(msg) {
        return () => timeline.push(['synclySucceed', msg]);
    }

    function synclyFail(msg) {
        return () => {
            timeline.push(['synclyFail', msg]);
            throw new Error(msg);
        }
    }

    function asynclySucceed(msg, delay) {
        const preTask = delay ? (() => wn().delay(delay)) : (() => wn())
        return () => preTask().then(() => {
            timeline.push(['asynclySucceed', msg]);
        });
    }

    function asynclyFail(msg, delay) {
        const preTask = delay ? (() => wn().delay(delay)) : (() => wn())
        return () => preTask().then(() => {
            timeline.push(['asynclyFail', msg]);
            return wn.reject(new Error(msg));
        });
    }

    it('should work', () => {
        const {tree} = inSandbox(() => {
            api.beforeAll(asynclySucceed('root/beforeAll1'));
            api.beforeAll(asynclySucceed('root/beforeAll2'));
            api.afterAll(asynclySucceed('root/afterAll1'));
            api.it('root/a', asynclySucceed('root/a'));
            api.it('root/b', synclySucceed('root/b'));
            api.it('root/c', asynclyFail('root/c'));
            api.describe('root/A', () => {
                api.it('root/A/a', asynclySucceed('root/A/a'));
                api.beforeAll(asynclyFail('root/A/beforeAll'));
            });

            api.describe('root/B', () => {
                api.beforeAll(asynclySucceed('root/B/beforeAll'));
                api.beforeEach(asynclySucceed('root/B/beforeEach1'));
                api.beforeEach(asynclySucceed('root/B/beforeEach2'));
                api.it('root/B/a', asynclyFail('root/B/a', 400));
                api.afterEach(asynclySucceed('root/B/afterEach'));
                api.it('root/B/b', synclySucceed('root/B/b'));
                api.it.skip('root/B/c', synclySucceed('root/B/b'));
                api.describe.skip('root/B/A', () => {
                    api.it.parallel('root/B/A/a', asynclySucceed('root/B/A/a'));
                })
            })
        });

        // debugger;

        function log(...args) {
            // console.log.apply(console, ['log', ...args]);
        }

        return runExecutableTree(tree, log).then((result) => {
            // console.log('result', result);
            // console.log('timeline', timeline);
            expect(timeline).to.deep.match([
                ['asynclySucceed', 'root/beforeAll1'],
                ['asynclySucceed', 'root/beforeAll2'],
                ['asynclySucceed', 'root/a'],
                ['synclySucceed', 'root/b'],
                ['asynclyFail', 'root/c'],
                ['asynclyFail', 'root/A/beforeAll'],
                ['asynclySucceed', 'root/B/beforeAll'],
                ['asynclySucceed', 'root/B/beforeEach1'],
                ['asynclySucceed', 'root/B/beforeEach2'],
                ['asynclyFail', 'root/B/a'],
                ['asynclySucceed', 'root/B/afterEach'],
                ['asynclySucceed', 'root/B/beforeEach1'],
                ['asynclySucceed', 'root/B/beforeEach2'],
                ['synclySucceed', 'root/B/b'],
                ['asynclySucceed', 'root/B/afterEach'],
                ['asynclySucceed', 'root/afterAll1']
            ]);
        });
    });
});
