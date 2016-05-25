import descriptorToExecutableTree from '../src/descriptorToExecutableTree';
import * as api from '../src/bddApi';
import {getFn} from './helpers';

describe('descriptorToExecutableTree()', () => {
    let descriptor, tree;
    beforeEach(() => {
        const {stopAndReturnDescriptor} = api.capture();
        api.beforeAll(getFn('rootBeforeAll1'));
        api.beforeAll(getFn('rootBeforeAll2'));
        api.afterAll(getFn('rootAfterAll'));
        api.beforeEach(getFn('rootBeforeEach1'));
        api.beforeEach(getFn('rootBeforeEach2'));
        api.afterEach(getFn('rootAfterEach'));
        api.createSuite({name: 'A'}, function() {
            this.timeout(600);
            api.beforeEach(getFn('ABeforeEach'));
            api.afterEach(getFn('AAfterEach'));
            api.describe.only('AA', () => {
                api.beforeAll(getFn('AA-beforeAll'))
                api.it('AAa', () => {});
                api.it.skip('AAb', () => {});
            });
        });
        // api.afterAll({name: 'root$b_'}, () => {});
        descriptor = stopAndReturnDescriptor();
        tree = descriptorToExecutableTree(descriptor, 500);
    });
    it('should not throw (duh!)', () => {
        // if this doesn't throw, then we're good.
        // console.log(tree); //@todo: remove
    });

    it('should accept a default timeout duration', () => {
        expect(tree).to.deep.match({defaultTimeoutDuration: 500});
    });

    it('should have `isSkipped` and `isExclusive` off by default', () => {
        expect(tree).to.deep.match({isExclusive: false, isSkipped: false});
    });

    it('should return the correct tree (we should break this up into smaller test cases)', () => {
        expect(tree).to.deep.match({
            type: 'suite',
            name: '$$$root',
            address: ['$$$root'],
            defaultTimeoutDuration: 500,
            isSkipped: false,
            isExclusive: false,
            specs: {},
            beforeAllHooks: [getFn('rootBeforeAll1'), getFn('rootBeforeAll2')].map((fn, i) => ({fn, address: ['$$$root', 'beforeAllHook#' + i]})),
            afterAllHooks: [getFn('rootAfterAll')].map((fn, i) => ({fn, address: ['$$$root', 'afterAllHook#' + i]})),
            beforeEachHooks: [getFn('rootBeforeEach1'), getFn('rootBeforeEach2')].map((fn, i) => ({fn, address: ['$$$root', 'beforeEachHook#' + i]})),
            afterEachHooks: [getFn('rootAfterEach')].map((fn, i) => ({fn, address: ['$$$root', 'afterEachHook#' + i]})),
            subSuites: {
                A: {
                    type: 'suite',
                    address: ['$$$root', 'A'],
                    defaultTimeoutDuration: 600,
                    isSkipped: false,
                    isExclusive: false,
                    // beforeEachHooks: [getFn('rootBeforeEach1'), getFn('rootBeforeEach2'), getFn('ABeforeEach')].map((fn, i) => ({fn, address: ['$$$root', 'A' 'beforeEachHook#' + i]})),
                    // afterEachHooks: [getFn('rootAfterEach'), getFn('AAfterEach')],
                    subSuites: {
                        AA: {
                            address: ['$$$root', 'A', 'AA'],
                            isExclusive: true,
                            // beforeAllHooks: [getFn('AA-beforeAll')],
                            specs: {
                                AAa: {
                                    address: ['$$$root', 'A', 'AA', 'AAa'],
                                    isExclusive: true
                                },
                                AAb: {
                                    isExclusive: false,
                                    defaultTimeoutDuration: 600,
                                    address: ['$$$root', 'A', 'AA', 'AAb']
                                }
                            }

                        }
                    }
                }
            }
        });
    });
});
