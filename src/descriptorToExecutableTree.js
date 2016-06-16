import mapValues from 'lodash/mapValues';

const emptyContext = {
    isSkipped: false, isExclusive: false, defaultTimeoutDuration: null,
    beforeEachHooks: [], afterEachHooks: [],
    address: []
};

export default function descriptorToExecutableTree(rootSuite, defaultTimeoutDuration) {
    return suiteToExecTree(rootSuite,
        {...emptyContext, isSkipped: false, isExclusive: false, defaultTimeoutDuration}
        );
}

function suiteToExecTree(descriptor, context) {
    const isSkipped = descriptor.isSkipped || context.isSkipped;
    const defaultTimeoutDuration = descriptor.defaultTimeoutDuration || context.defaultTimeoutDuration;
    const address = [...context.address, descriptor.name];

    const newContext = {
        defaultTimeoutDuration,
        isSkipped,
        address,
        isExclusive: (!isSkipped && (descriptor.isExclusive || context.isExclusive)),
        beforeEachHooks: [...context.beforeEachHooks, ...descriptor.beforeEachHooks.map((fn, i) => ({
            address: [...address, `beforeEachHook#${i}`],
            fn
        }))],
        afterEachHooks: [...context.afterEachHooks, ...descriptor.afterEachHooks.map((fn, i) => ({
            address: [...address, `afterEachHook#${i}`],
            fn
        }))]
    };

    return {
        type: 'suite',
        name: descriptor.name,
        ...newContext,
        specs: mapValues(descriptor.specs,
            (specDescriptor) => specToExecTree(specDescriptor, newContext)
        ),
        subSuites: mapValues(descriptor.subSuites,
            (subSuiteDescriptor) => suiteToExecTree(subSuiteDescriptor, newContext)
        ),
        beforeAllHooks: descriptor.beforeAllHooks.map((fn, i) => ({
            address: [...newContext.address, `beforeAllHook#${i}`],
            fn
        })),
        afterAllHooks: descriptor.afterAllHooks.map((fn, i) => ({
            address: [...newContext.address, `afterAllHook#${i}`],
            fn
        }))
    };
}

function specToExecTree(specDescriptor, context) {
    const isSkipped = specDescriptor.isSkipped || context.isSkipped;
    return {
        type: 'spec',
        name: specDescriptor.name,
        fn: specDescriptor.fn,
        address: [...context.address, specDescriptor.name],
        isSkipped,
        isExclusive: (!isSkipped && (context.isExclusive || specDescriptor.isExclusive)),
        defaultTimeoutDuration: context.defaultTimeoutDuration,
        beforeEachHooks: context.beforeEachHooks,
        afterEachHooks: context.afterEachHooks,
        isParallel: specDescriptor.isParallel,
    };
}
