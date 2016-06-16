import traverseExecutableTree from './traverseExecutableTree';

export default function countTests(tree) {
    let count = 0;
    traverseExecutableTree(tree, (type) => {
        if (type === 'spec') {
            count++;
        }
    });

    return count;
}
