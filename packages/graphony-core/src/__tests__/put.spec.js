import { Graphony } from '../Graphony';
import { MemoryStore } from '../utils/MemoryStore'

describe('put()', () => {
  let graphony;
  const sObject = { name: 'foo' };
  const nObject = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };

  beforeEach(() => {
    graphony = new Graphony({ store: new MemoryStore()});
  });
  afterEach(() => {
    graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.put).toBeTruthy();
  });

  it('should patch a simple object', (done) => {
    const set = { name: 'foo' };
    const put = { name: 'bar' };
    graphony
      .get()
      .set(set)
      .put(put)
      .once((val) => {
        expect(val).toEqual(put)
        done();
      })
  });

  it('should patch a more complex object', (done) => {
    const set = { name: 'foo' };
    const put = { location: 'bar' };
    const obj = { name: 'foo', location: 'bar' };
    graphony
      .get()
      .set(set)
      .put(put)
      .once((val) => {
        expect(val).toEqual(obj);
        done();
      })
  });

  it('should patch an object in a deeply nested node', (done) => {
    const set = { name: 'foo' };
    const put = { location: 'bar' };
    const obj = { name: 'foo', location: 'bar' };
    graphony
      .get()
      .get('users')
      .get('rob')
      .set(set)
      .put(put)
      .once((val) => {
        expect(val).toEqual(obj);
        done();
      })
  });

  it.skip('should set the unauthenticated state of a user', (done) => {
    const email = 'rob@mail.com';
    graphony
      .get()
      .get('users')
      .get(email)
      .put({email, authenticated: false}, 100, true)
      .once((usr) => {
        console.log(`usr`, usr)
        // expect(usr).toEqual({email});
        done();
      })
  });
});
