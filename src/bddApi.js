import SuiteDescriptor from './SuiteDescriptor';
import SpecDescriptor from './SpecDescriptor';

const stackOfSuiteDescriptors = [];
const getTopSuite = () => {
    return stackOfSuiteDescriptors[stackOfSuiteDescriptors.length - 1];
};

function startCapturingSuite(opts) {
    const suiteDescriptor = new SuiteDescriptor(opts);

    let timeoutForCheckingIfWeHaveStopped = setTimeout(() => {
        console.error(`Suite '${suiteDescriptor.name}' is still capturing.`);
    }, 0);

    stackOfSuiteDescriptors.push(suiteDescriptor);

    const stopAndReturnDescriptor = () => {
        if (typeof timeoutForCheckingIfWeHaveStopped === 'undefined') {
            throw new Error(`Already stopped capturing suite '${suiteDescriptor.name}'`);
        } else {
            clearTimeout(timeoutForCheckingIfWeHaveStopped);
            timeoutForCheckingIfWeHaveStopped = void 0;
        }

        stackOfSuiteDescriptors.pop();
        return suiteDescriptor;
    }

    return {stopAndReturnDescriptor};
}

export function capture() {
    const {stopAndReturnDescriptor} =
        startCapturingSuite({name: '$$$root'});

    return {stopAndReturnDescriptor};
}

export function createSuite(partialDescription, cb) {
    const {stopAndReturnDescriptor} = startCapturingSuite(partialDescription);
    let defaultTimeoutDuration;
    const context = {
        timeout: (dur) => {
            defaultTimeoutDuration = dur;
        }
    }
    cb.call(context);
    const suiteDescriptor = stopAndReturnDescriptor();
    if (defaultTimeoutDuration) {
        suiteDescriptor.defaultTimeoutDuration = defaultTimeoutDuration;
    }
    getTopSuite().addSubSuite(suiteDescriptor);
}

export function createSpec(config, fn) {
    const spec = new SpecDescriptor({...config, fn})
    getTopSuite().addSpec(spec);
}

export function beforeEach(fn) {
    getTopSuite().addHook('beforeEach', fn);
}

export function afterEach(fn) {
    getTopSuite().addHook('afterEach', fn);
}

export function beforeAll(fn) {
    getTopSuite().addHook('beforeAll', fn);
}

export function afterAll(fn) {
    getTopSuite().addHook('afterAll', fn);
}

export function it(name, fn) {
    if (typeof fn !== 'function') {
        it.skip(name, fn);
    } else {
        createSpec({name}, fn);
    }
}

it.skip = (name, fn) => {
    createSpec({name, isSkipped: true}, fn);
}

it.only = (name, fn) => {
    createSpec({name, isExclusive: true}, fn);
}

it.parallel = (name, fn) => {
    if (typeof fn !== 'function') {
        it.parallel.skip(name, fn);
    } else {
        createSpec({name, isParallel: true}, fn);
    }
}

it.parallel.skip = (name, fn) => {
    createSpec({name, isParallel: true, isSkipped: true}, fn);
}

it.parallel.only = (name, fn) => {
    createSpec({name, isParallel: true, isExclusive: true}, fn);
}

export function describe(name, fn) {
    createSuite({name}, fn);
}

describe.only = (name, fn) => {
    createSuite({name, isExclusive: true}, fn);
}

describe.skip = (name, fn) => {
    createSuite({name, isSkipped: true}, fn);
}
