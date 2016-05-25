import SpecDescriptor from './SpecDescriptor';

export default class SuiteDescriptor {
    constructor({name, isSkipped, isExclusive}) {
        this._name = name;
        this._isSkipped = !!isSkipped;
        this._isExclusive = !!isExclusive;
        this._subSuites = {};
        this._specs = {};
        this._hooks = {
            beforeEach: [],
            afterEach: [],
            beforeAll: [],
            afterAll: []
        };
        this._defaultTimeoutDuration = null;
    }

    get defaultTimeoutDuration() {
        return this._defaultTimeoutDuration;
    }

    set defaultTimeoutDuration(newDur) {
        this._defaultTimeoutDuration = newDur;
    }

    get name() {
        return this._name;
    }

    get specs() {
        return {...this._specs};
    }

    get subSuites() {
        return {...this._subSuites};
    }

    get beforeEachHooks() {
        return [...this._hooks.beforeEach];
    }

    get afterEachHooks() {
        return [...this._hooks.afterEach];
    }

    get beforeAllHooks() {
        return [...this._hooks.beforeAll];
    }

    get afterAllHooks() {
        return [...this._hooks.afterAll];
    }

    addSubSuite(suite) {
        if (!(suite instanceof SuiteDescriptor)) {
            throw Error(`subSuite must be an instance of SuiteDescriptor`);
        }

        if (this._subSuites[suite.name]) {
            throw new Error(`Suite '${this.name}' already has a sub-suite named '${suite.name}'`);
        }

        this._subSuites[suite.name] = suite;
        return this;
    }

    addSpec(spec) {
        if (!(spec instanceof SpecDescriptor)) {
            throw Error(`spec must be an instance of SpecDescriptor`);
        }

        if (this._specs[spec.name]) {
            throw new Error(`Suite '${this.name}' already has a spec named '${spec.name}'`);
        }

        this._specs[spec.name] = spec;
        return this;
    }

    addHook(placement, hook) {
        if (!this._hooks[placement]) {
            throw new Error(`Unkown hook placement '${placement}'`);
        }

        this._hooks[placement].push(hook);
        return this;
    }

    get isSkipped() {
        return this._isSkipped;
    }

    get isExclusive() {
        return this._isExclusive;
    }
}
