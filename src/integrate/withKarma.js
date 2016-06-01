import * as t from '../index';

export default function integrateWithKarma(cb) {
    const {stopAndReturnDescriptor} = t.bddApi.capture();

    function stop() {
        const descriptor = stopAndReturnDescriptor();
        const tree = t.descriptorToExecutableTree(descriptor, 500);

        return {descriptor, tree};
    }

    cb();

    window.__karma__.start = function() {
        const {tree} = stop();
        const log = (type, detes) => {
            switch (type) {
                case `success`:
                case `skip`:
                    this.result({
                        ...detesToResult(detes),
                        success: true,
                        skipped: type !== 'success',
                        log: []
                    });
                    break;
                case `fail`:
                    this.result({
                        ...detesToResult(detes),
                        success: false,
                        skipped: false,
                        log: [detes.error].map(formatError)
                    });
                    break;
                default:
                    console.error('Invalid log call', type, detes);
            }
        }

        this.info({total: t.countTests(tree)});

        t.runExecutableTree(tree, log)
        .then(() => {
            this.complete();
        });
    }
}

function detesToResult(detes) {
    return {
        id: detes.address.join('/'),
        description: detes.address[detes.address.length - 1],
        suite: detes.address.slice(1, detes.address.length - 1)
    }
}

function formatError(error) {
    if (typeof error === 'string') {
        return error;
    }

    let {stack, message} = error;

    if (stack) {
        if (message && stack.indexOf(message) === -1) {
            stack = message + '\n' + stack
        }

        // remove mocha stack entries
        return stack.replace(/\n.+\/the\-testing\-framework\/.+(?=(\n|$))/g, '')
    }

    return message;
}
