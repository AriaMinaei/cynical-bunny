import wn from 'when';

// function createDefaultTimeout(dur = 500) {
//     const rejectingPromise =


//     rejectingPromise.catch(() => {}); // we don't need this rejection to show up in the list of unhandled rejections
//     return rejectingPromise;
// }

export default function runSpecFunction(fn, defaultTimeoutDuration = 500) {
    if (typeof fn !== 'function') {
        throw Error("Function expected");
    }

    const deferred = wn.defer();
    let returnValue;
    let threw = false;
    let theException;

    let timeoutDuration = defaultTimeoutDuration;
    const context = {
        timeout: (dur) => {
            timeoutDuration = dur;
        }
    }

    try {
        returnValue = fn.apply(context);
    } catch (e) {
        threw = true;
        theException = e;
    }

    if (threw) {
        deferred.reject(theException);
    } else if (returnValue && typeof returnValue.then === 'function') {
        const fnPromise = returnValue;
        wn
            .race([
                fnPromise,
                new wn.Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error(`Expected function to run for ${timeoutDuration} milliseconds.`));
                    }, timeoutDuration);
                })
            ])
            .then(() => {deferred.resolve()}, deferred.reject);
    } else {
        deferred.resolve();
    }

    return deferred.promise;
}
