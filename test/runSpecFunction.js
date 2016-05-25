import runSpecFunction from '../src/runSpecFunction';

describe('runSpecFunction()', () => {
    it('should throw if not given a function', () => {
        expect(
            () => runSpecFunction()
        ).to.throw();

        expect(
            () => runSpecFunction(() => {})
        ).to.not.throw();
    });

    describe('for sync specs', () => {
        describe('that pass', () => {
            it('should return a promise that fulfills', () => {
                return expect(
                    (runSpecFunction(() => {}))
                ).to.be.fulfilled;
            });
        });

        describe('that fail', () => {
            it('should return a promise that rejects', () => {
                let error = new Error("err");
                return expect(
                    (runSpecFunction(() => {throw error;}))
                ).to.be.rejectedWith(error);
            });
        });
    });

    describe('for async specs', () => {
        describe('that pass', () => {
            it('should return a promise that fulfills', () => {
                return expect(
                    (runSpecFunction(() => Promise.resolve()))
                ).to.be.fulfilled;
            });
        });

        describe('that fail', () => {
            it('should return a promise that rejects', () => {
                let error = new Error("err");
                return expect(
                    (runSpecFunction(() => Promise.reject(error)))
                ).to.be.rejectedWith(error);
            });
        });

        it('should have a default timeout of 500ms', () => {
            return expect(
                (runSpecFunction(() => new Promise((resolve) => setTimeout(resolve, 1000))))
            ).to.be.rejected;
        });

        it('should provide context.timeout()', () => {
            return expect(
                (runSpecFunction(() => {
                    this.timeout(50);2
                    return new Promise((resolve) => setTimeout(resolve, 100))
                }))
            ).to.be.rejected;
        });
    });
});
