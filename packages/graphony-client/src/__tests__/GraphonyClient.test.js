/* eslint-disable */

import { GraphonyClient } from '../GraphonyClient';
import { MemoryStore } from 'graphony-core';

const gc = new GraphonyClient({ baseUrl: 'http://localhost:3001', store: new MemoryStore() });

describe('GraphonyClient', () => {
  it('should have certain properties after instantiation', (done) => {
    setTimeout(() => {
      expect(gc.client).toBeDefined();
      done();
    }, 0);
  });
});
