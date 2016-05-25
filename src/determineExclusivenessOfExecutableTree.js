import traverseExecutableTree from './traverseExecutableTree';

export default function determineExclusiveneessOfExecutableTree(tree) {
    let isExclusive = false;
    traverseExecutableTree(tree, (type, node) => {
        if (node.isExclusive === true) {
            isExclusive = true;
            return false;
        }
    });

    return isExclusive;
}
