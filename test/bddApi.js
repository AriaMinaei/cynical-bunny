import * as api from '../src/bddApi';

function noop(){}

describe('bddApi', () => {
    describe('.capture()', () => {
        // @todo: look below
        it('should work (should break this down into smaller cases)', () => {
            const {stopAndReturnDescriptor} = api.capture();
            api.beforeAll(noop);
            api.beforeAll(noop);
            api.afterAll(noop);
            api.afterEach(noop);
            api.beforeEach(noop);
            api.createSuite({name: 'A'}, () => {
                api.createSuite({name: 'AA'}, () => {
                    api.beforeEach(noop);
                    api.beforeEach(noop);
                    api.afterEach(noop);
                    api.afterAll(noop);
                    api.afterAll(noop);
                    api.createSpec({name: 'AAa'}, noop);
                    api.createSpec({name: 'AAb'}, noop);
                });
            });
            api.afterAll({name: 'root$b_'}, noop);
            const descriptor = stopAndReturnDescriptor();
            expect(descriptor).to.deep.match({
                name: '$$$root',
                specs: {},
                beforeEachHooks: [noop],
                afterEachHooks: [noop],
                beforeAllHooks: [noop],
                afterAllHooks: [noop],
                subSuites: {
                    A: {
                        subSuites: {
                            AA: {
                                beforeEachHooks: [noop, noop],
                                afterEachHooks: [noop],
                                beforeAllHooks: [],
                                afterAllHooks: [noop],
                                specs: {AAa: {}, AAb: {}}
                            }
                        }
                    }
                }
            });
        });
    });

    describe('public api', () => {
        const capture = cb => {
            const {stopAndReturnDescriptor} = api.capture();
            cb();
            return stopAndReturnDescriptor();
        }

        describe('.it()', () => {
            it('should be a regular case if supplied with an fn', () => {
                expect(
                    capture(() => {api.it('name', noop)})
                ).to.deep.match({specs: {name: {isParallel: false, isSkipped: false, isExclusive: false}}});
            });

            it('should be a skipped case if not supplied with an fn', () => {
                expect(
                    capture(() => {api.it('name')})
                ).to.deep.match({specs: {name: {isParallel: false, isSkipped: true, isExclusive: false}}});
            });

            describe('.skip()', () => {
                it('should be a skipped case', () => {
                    expect(
                        capture(() => {api.it.skip('name', noop)})
                    ).to.deep.match({specs: {name: {isParallel: false, isSkipped: true, isExclusive: false}}});
                });
            });

            describe('.only()', () => {
                it('should be an exlusive case', () => {
                    expect(
                        capture(() => {api.it.only('name', noop)})
                    ).to.deep.match({specs: {name: {isParallel: false, isSkipped: false, isExclusive: true}}});
                });
            });

            describe('.parallel()', () => {
                it('should be a parallel case', () => {
                    expect(
                        capture(() => {api.it.parallel('name', noop)})
                    ).to.deep.match({specs: {name: {isParallel: true, isSkipped: false, isExclusive: false}}});
                });

                describe('.skip()', () => {
                    it('should be a skipped parallel case', () => {
                        expect(
                            capture(() => {api.it.parallel.skip('name', noop)})
                        ).to.deep.match({specs: {name: {isParallel: true, isSkipped: true, isExclusive: false}}});
                    });
                });

                describe('.only()', () => {
                    it('should be an exlusive case', () => {
                        expect(
                            capture(() => {api.it.parallel.only('name', noop)})
                        ).to.deep.match({specs: {name: {isParallel: true, isSkipped: false, isExclusive: true}}});
                    });
                });
            });
        });

        describe('.describe()', () => {
            it('should be a regular suite', () => {
                expect(
                    capture(() => {api.describe('name', noop)})
                ).to.deep.match({subSuites: {name: {isSkipped: false, isExclusive: false}}});
            });

            it('should provide context.timeout()', () => {
                expect(
                    capture(() => {api.describe('name', function() {
                        this.timeout(1234);
                    })})
                ).to.deep.match({subSuites: {name: {defaultTimeoutDuration: 1234}}});
            });

            describe('.skip()', () => {
                it('should be a skipped suite', () => {
                    expect(
                        capture(() => {api.describe.skip('name', noop)})
                    ).to.deep.match({subSuites: {name: {isSkipped: true, isExclusive: false}}});
                });
            });

            describe('.only()', () => {
                it('should be an exlusive suite', () => {
                    expect(
                        capture(() => {api.describe.only('name', noop)})
                    ).to.deep.match({subSuites: {name: {isSkipped: false, isExclusive: true}}});
                });
            });
        });
    });
});
