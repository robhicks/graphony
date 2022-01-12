import {merge} from '../utils/merge';

describe('merge', () => {
  it('should merge two objects', () => {
    let obj = {firstname: 'foo'};
    let obj1 = {lastname: 'bar'};
    let results = merge(obj, obj1);
    expect(typeof results).toBe('object');
    expect(results).toEqual({
      firstname: 'foo',
      lastname: 'bar'
    });
  });
  it('should merge 3 objects', () => {
    let obj = {firstname: 'foo'};
    let obj1 = {lastname: 'bar'};
    let obj2 = {address: {city: 'The Fark', state: 'Utah'}};
    let results = merge(obj, obj1, obj2);
    expect(typeof results).toBe('object');
    expect(results).toEqual({
      firstname: 'foo',
      lastname: 'bar',
      address: {
        city: 'The Fark',
        state: 'Utah'
      }
    });
  });
});
