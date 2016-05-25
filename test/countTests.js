import countTests from '../src/countTests';
import descriptorToExecutableTree from '../src/descriptorToExecutableTree';
import * as api from '../src/bddApi';

describe('countTests()', () => {
    it.only('should work', () => {
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

        expect(countTests(tree)).to.equal(2);
    });

});
