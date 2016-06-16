import determineExclusivenessOfExecutableTree from './determineExclusivenessOfExecutableTree';
import SequentialQueue from './SequentialQueue';
import ParallelQueue from './ParallelQueue';
import runSpecFunction from './runSpecFunction';
import wn from 'when';
import sequenceTasks from 'when/sequence';
import map from 'lodash/map';

export default function runExecutableTree(tree, log) {
    const rootHasExclusiveTests = determineExclusivenessOfExecutableTree(tree);
    const sequentialQueue = new SequentialQueue();
    const parallelQueue = new ParallelQueue();

    const context = {
        rootHasExclusiveTests,
        log,
        sequentialQueue,
        pushTaskToSequentialQueue: sequentialQueue.push.bind(sequentialQueue),
        parallelQueue,
        pushTaskToParallelQueue: parallelQueue.push.bind(parallelQueue)
    };

    return runSuite(context, tree);
}

function addressToString(address) {
    return address.join(' ');
}

function runSuite(context, suite) {
    const hookToPromise =
        ({fn, address}) => context.pushTaskToSequentialQueue(fn).catch((reason) => {
            context.log('fail', {address, error: reason});
            throw new Error(`Error running ${addressToString(address)}`);
        });

    const donePromise =
        wn()
        .then(() => wn.all(suite.beforeAllHooks.map(hookToPromise)))
        .then(() => {
            const specsPromise =
                wn.all(map(suite.specs, (spec) => runSpec(context, spec)));

            const subSuitesPromise =
                wn.all(map(suite.subSuites, (subSuite) => runSuite(context, subSuite)));

            return wn.all([specsPromise, subSuitesPromise]);
        }, () => {})
        .then(() => wn.all(suite.afterAllHooks.map(hookToPromise)).catch(() => {}));

    return donePromise;
}

function runSpec(context, spec) {
    const shouldSkip =
        spec.isSkipped || (context.rootHasExclusiveTests && !context.isExclusive);

    if (shouldSkip) {
        context.log('skip', {address: spec.address});
        return wn.Promise.resolve();
    }

    const hookToTask = ({fn, address}) => () => wn.try(fn).catch((reason) => {
        context.log('fail', {address, error: reason});
        throw new Error(`Error running ${addressToString(address)}`);
    });

    const theTask = () => {
        return wn()
            .then(() => sequenceTasks(spec.beforeEachHooks.map(hookToTask)))
            .then(() => runSpecFunction(spec.fn, spec.defaultTimeoutDuration).then(
                () => {
                    context.log('success', {address: spec.address});
                },
                (reason) => {
                    context.log('fail', {address: spec.address, error: reason});
                }
            )).catch(() => {})
            .then(() => {
                return sequenceTasks(spec.afterEachHooks.map(hookToTask)).catch(() => {})
            })
    };

    if (spec.isParallel) {
        return context.pushTaskToParallelQueue(theTask);
    } else {
        return context.pushTaskToSequentialQueue(theTask);
    }
}
