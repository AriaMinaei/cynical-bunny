import wn from 'when';

function noop() {}

export default class SequentialQueue {
    constructor() {
        this._queue = [];
        this._isIterating = false;
    }

    push(fn) {
        const deferred = wn.defer();

        this._queue.push(() => {
            const functionPromise = wn.try(fn);

            functionPromise.done(
                () => {deferred.resolve()},
                (reason) => {deferred.reject(reason)}
            );

            return functionPromise.then(noop, noop);
        });

        this._drain();

        return deferred.promise;
    }

    _drain() {
        if (this._isIterating || this._queue.length === 0) {
            return;
        }

        this._isIterating = true;

        const top = this._queue.shift();

        top().done(() => {
            this._isIterating = false;
            this._drain();
        });
    }
}
