import descriptorToExecutableTree from '../src/descriptorToExecutableTree';
import * as api from '../src/bddApi';

export const getFn = (function(){
    let cache = {};
    return (name) => {
        if (!(cache[name])) {
            cache[name] = () => {};
        }

        return cache[name];
    }
})();

export function inSandbox(cb) {
    const {stopAndReturnDescriptor} = api.capture();
    cb();
    const descriptor = stopAndReturnDescriptor();
    const tree = descriptorToExecutableTree(descriptor, 500);
    return {descriptor, tree};
}
