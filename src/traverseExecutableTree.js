import forOwn from 'lodash/forOwn';

export default function traverseExecutableTree(tree, iteratee) {
    return traverseSuite(tree, iteratee);
}

function traverseSuite(suite, iteratee, parent) {
    if (iteratee('suite', suite, parent) === false) {
        return false;
    }

    let shouldExit = false;
    forOwn(suite.specs, (spec) => {
        if (iteratee('spec', spec, suite) === false) {
            shouldExit = true;
            return false;
        }
    });

    if (shouldExit) {
        return false;
    }

    forOwn(suite.subSuites, (subSuite) => {
        if (traverseSuite(subSuite, iteratee, suite) === false) {
            shouldExit = true;
            return false;
        }
    });

    if (shouldExit) {
        return false;
    }
}
