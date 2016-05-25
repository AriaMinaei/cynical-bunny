import traverseExecutableTree from '../src/traverseExecutableTree';
import descriptorToExecutableTree from '../src/descriptorToExecutableTree';
import * as api from '../src/bddApi';
import {getFn} from './helpers';

describe('traverseExecutableTree()', () => {
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
            api.it('Aa', () => {});
        });
        // api.afterAll({name: 'root$b_'}, () => {});
        descriptor = stopAndReturnDescriptor();
        tree = descriptorToExecutableTree(descriptor, 500);
    });
    it('should iterate in the correct order', () => {
        let nodesIterated = [];
        traverseExecutableTree(tree, (type, node, parent) => {
            nodesIterated.push({type: type, name: node.name});
        });

        expect(nodesIterated).to.deep.match([
            {type: 'suite', name: '$$$root'},
            {type: 'suite', name: 'A'},
            {type: 'spec', name: 'Aa'},
            {type: 'suite', name: 'AA'},
            {type: 'spec', name: 'AAa'},
            {type: 'spec', name: 'AAb'}
        ]);
    });

    it('should exit iteration when iteratee returns false', () => {
        let length = 0;
        traverseExecutableTree(tree, () => {length++});
        expect(length).to.be.above(4, 'not enough nodes');

        for (let i = 1; i < length; i++) {
            let counted = 0;
            traverseExecutableTree(tree, () => {
                counted++;
                if (counted === i) {
                    return false;
                }
            });

            expect(counted).to.equal(i);
        }
    });
});
