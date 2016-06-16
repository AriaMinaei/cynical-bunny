import wn from 'when';

function noop() {}

export default class PrallelQueue {
    constructor(maxConcurrentTasks = 10) {
        this._maxConcurrentTasks = parseInt(maxConcurrentTasks);
        this._queue = [];
        this._numberOfCurrentlyRunningTasks = 0;
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
        if (
            this._queue.length === 0 ||
            this._numberOfCurrentlyRunningTasks === this._maxConcurrentTasks
        ) {
            return;
        }

        this._numberOfCurrentlyRunningTasks++;

        const top = this._queue.shift();

        top().done(() => {
            this._numberOfCurrentlyRunningTasks--;
            this._drain();
        });
    }
}
