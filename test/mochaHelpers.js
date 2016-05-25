import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiFuzzy from 'chai-fuzzy';
import chaiDeepMatch from 'chai-deep-match';

chai.use(chaiFuzzy);
chai.use(chaiAsPromised);
chai.use(chaiDeepMatch);
global.expect = chai.expect;
