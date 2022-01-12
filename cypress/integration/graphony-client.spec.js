import { GraphonyClient } from '../../packages/graphony-client/src/GraphonyClient';
import { MemoryStore } from '../../packages/graphony-core/src/utils/MemoryStore';

const gc = new GraphonyClient({ baseUrl: 'http://localhost:3001', store: new MemoryStore() });

describe('GraphonyClient', () => {
  it('should have certain properties after instantiation', (done) => {
    setTimeout(() => {
      expect(gc.client).to.be.ok;
      done();
    }, 0);
  });
});
