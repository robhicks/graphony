import { Graphony } from '../Graphony.js';
import { MemoryStore } from '../utils/MemoryStore';

describe('set()', () => {
  const graphony = new Graphony({store: new MemoryStore()});

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.set).toBeDefined();
  });

  it('should set a simple object', (done) => {
    const obj = { name: 'foo' };
    graphony
    .get()
    .set(obj)
    .once((val) => {
      expect(val).toEqual(obj);
      done();
    })
  });

  it('should set an empty array', (done) => {
    const obj = [];
    graphony
      .get()
      .set(obj)
      .once((val) => {
        expect(val).toEqual(obj);
        done();
      })
    });
    
  it('should add a deeply nested object', (done) => {
    const obj = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };
    graphony
    .get()
    .set(obj)
    .once((val) => {
      expect(val).toEqual(obj);
      done();
    })
  });
    
  it('should set an array with items', (done) => {
    const obj = [{ name: 'foo' }, { name: 'bar' }];
    graphony
    .get()
    .set(obj)
    .once((val) => {
      expect(val).toEqual(obj);
      done();
    })
  });
});
