import { Graphony } from '../Graphony';
import { MemoryStore } from '../utils/MemoryStore';

describe('once()', () => {
  let graphony;

  beforeEach(() => {
    graphony = new Graphony({store: new MemoryStore()});
  });
  afterEach(async () => {
    await graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.once).toBeDefined();
  });

  it('should return null or undefined in data does not exist for the node', (done) => {
    const obj = { name: 'foo' };
    graphony
      .get()
      .get('users')
      .get('rob@mail.com')
      .once((val) => {
        expect(val).toBeUndefined();
        done();
      });
  });

  it('should get the value of an object stored at the root', (done) => {
    const obj = { name: 'foo' };
    graphony
      .get()
      .set(obj)
      .once((val) => {
        expect(val).toEqual(obj);
        done();
      });
  });

  it('should get the value of deeply stored object', (done) => {
    const obj = { name: 'foo' };
    graphony
      .get('users')
      .get('rob')
      .set(obj)
      .once((val) => {expect(val).toEqual(obj); done()});
  });

  it('should get the value of an object stored at the root', (done) => {
    const obj = { name: 'foo', location: 'bar' };
    graphony
      .get()
      .set(obj)
      .once((val) => {expect(val).toEqual(obj); done()});
  });

  it('should get the value of a deeply nested object', (done) => {
    const obj = { name: 'foo', location: 'bar' };
    graphony
      .get('users')
      .get('rob')
      .set(obj)
      .once((val) => {expect(val).toEqual(obj); done()});
  });

  it('should get the value of an object stored by reference', (done) => {
    const obj = { name: 'rob' };
    graphony
      .get()
      .get('users')
      .get('rob')
      .set([])
      .push(obj)
      .once((val) => {
        expect(val).toEqual([obj])
        done();
      });
  });

  it('should get a user by email', (done) => {
    graphony.get().get('users').get('rob@mail.com').once((user) => {
      expect(user).toBeUndefined();
      done();
    })
  });

  it('should handle a set followed by a push followed by once', (done) => {
    const name = { name: 'rob' };
    const address = { address: '123 Main Street'};
    graphony
      .get()
      .get('users')
      .get('rob')
      .set(name)
      .put(address)
      .once((val) => {
        expect(val).toEqual({name: 'rob', address: '123 Main Street'})
        done();
      })

  });
});
