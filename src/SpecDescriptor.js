export default class SpecDescriptor {
    constructor({name, fn, isParallel, isSkipped, isExclusive}) {
        this._name = name;
        this._fn = fn;
        this._isParallel = !!isParallel;
        this._isSkipped = !!isSkipped;
        this._isExclusive = !!isExclusive;
    }

    get name() {
        return this._name;
    }

    get fn() {
        return this._fn;
    }

    get isParallel() {
        return this._isParallel;
    }

    get isSkipped() {
        return this._isSkipped;
    }

    get isExclusive() {
        return this._isExclusive;
    }
}
