import {Graphony} from '../Graphony';
import { MemoryStore } from '../utils/MemoryStore'

describe('on()', () => {
  let graphony;

  beforeEach(() => {
    graphony = new Graphony({store: new MemoryStore()});
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.on).toBeDefined();
  });

  it.only(`should get an updated value from an object`, () => {
    const set = {name: 'foo'};
    const change = {name: 'bar'};
    const change1 = { address: 'foobar'};
    const cb = jest.fn(val => val);
    graphony
      .get()
      .set(set)
      .on((val) => console.log(`val`, val))
      // .on(cb)
      .put(change)
      .put(change1)

    console.log('calls', cb.mock.calls)
    // expect(cb.mock.results[1].value).toEqual(change);
  });

  it(`should get an updated value from an array`, () => {
    const foo = { name: 'foo' }
    const original = [foo];
    const change = {name: 'bar'};
    const cb = jest.fn(val => val);

    graphony
      .get()
      .set(original)
      .on(cb)
      .push(change);

    expect(cb.mock.results[0].value).toEqual([foo, change])
  });

  it(`should get an updated value from an array`, () => {
    let original = {name: 'foo'};
    let change = {name: 'bar'};
    const cb = jest.fn(val => val);
    graphony
      .get()
      .set([])
      .push(original)
      .on(cb)
      .push(change)

    expect(cb.mock.results[0].value).toEqual([original, change])
  });

  it('should get the value of an object stored by reference', () => {
    let obj = {name: 'foo'};
    const cb = jest.fn(val => val);
    graphony
      .get()
      .get('rob')
      .set(obj)
      .get()
      .get('users')
      .set([])
      .on(cb)
      .push('root.rob');

    expect(cb.mock.results[0].value).toEqual([obj])
  });
  
});
