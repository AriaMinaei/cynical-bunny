import determineExclusivenessOfExecutableTree from '../src/determineExclusivenessOfExecutableTree';
import descriptorToExecutableTree from '../src/descriptorToExecutableTree';
import * as api from '../src/bddApi';

describe('determineExclusivenessOfExecutableTree()', () => {
    it('should return true where exclusive suites exist', () => {
        const tree = (function(){
            const {stopAndReturnDescriptor} = api.capture();
            api.describe('A', () => {
                api.describe('AA', () => {})
                api.describe.only('AB', () => {})
            })
            return descriptorToExecutableTree(stopAndReturnDescriptor(), 500);
        })();

        expect(determineExclusivenessOfExecutableTree(tree)).to.equal(true);
    });

    it('should return true where exclusive specs exist', () => {
        const tree = (function(){
            const {stopAndReturnDescriptor} = api.capture();
            api.describe('A', () => {
                api.describe('AA', () => {
                    api.it('AAa', () => {})
                    api.it.only('AAb', () => {})
                })
                api.describe('AB', () => {})
            })
            return descriptorToExecutableTree(stopAndReturnDescriptor(), 500);
        })();

        expect(determineExclusivenessOfExecutableTree(tree)).to.equal(true);
    });

    it('should return false where no exclusive specs or suites exist', () => {
        const tree = (function(){
            const {stopAndReturnDescriptor} = api.capture();
            api.describe('A', () => {
                api.describe.skip('AA', () => {
                    api.it('AAa', () => {})
                    api.it.only('AAb', () => {})
                })
                api.describe('AB', () => {})
            })
            return descriptorToExecutableTree(stopAndReturnDescriptor(), 500);
        })();

        expect(determineExclusivenessOfExecutableTree(tree)).to.equal(false);
    });

});
