import { EventEmitter } from '../utils/EventEmitter';
describe(`EventEmitter`, () => {
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  it(`should have certain properties when instantiated`, () => {
    expect(emitter instanceof EventEmitter).toBeTruthy();
    expect(emitter.events instanceof Map);
    expect(typeof emitter.clear).toBe('function');
    expect(typeof emitter.emit).toBe('function');
    expect(typeof emitter.off).toBe('function');
    expect(typeof emitter.on).toBe('function');
    expect(emitter.size).toBe(0);
  });

  it(`should register a listener`, () => {
    let cb = () => { };
    expect(emitter.size).toBe(0);
    emitter.on('foo', cb);
    expect(emitter.size).toBe(1);
    emitter.off('foo', cb);
    expect(emitter.size).toBe(0);
  });

  it(`should register a listener once`, () => {
    let cb = () => { };
    expect(emitter.size).toBe(0);
    emitter.on('foo', cb);
    emitter.on('foo', cb);
    emitter.on('foo', cb);
    emitter.on('foo', cb);
    emitter.on('foo', cb);
    expect(emitter.size).toBe(1);
  });

  it(`should create different instances`, () => {
    let emitter1 = new EventEmitter();
    expect(emitter).not.toBe(emitter1);
  });


  it(`should not create duplicate event listeners`, () => {
    const path = 'foo';
    let cb = () => { };
    let cb1 = () => {};
    emitter.on(path, cb);
    emitter.on(path, cb);
    emitter.on(path, cb);
    emitter.on(path, cb);
    emitter.on(path, cb);
    expect(emitter.size).toBe(1);
    expect(emitter.eventSize(path)).toBe(1)
    emitter.on(path, cb1);
    emitter.on(path, cb1);
    emitter.on(path, cb1);
    emitter.on(path, cb1);
    expect(emitter.size).toBe(1);
    expect(emitter.eventSize(path)).toBe(2)
  });

  it(`should remove the events channel when the last listener is removed`, () => {
    const p = 'foo';
    let cb = () => { };
    let cb1 = () => { };
    emitter.on(p, cb);
    emitter.on(p, cb1);
    expect(emitter.size).toBe(1);
    expect(emitter.eventSize(p)).toBe(2);
    emitter.off(p, cb);
    expect(emitter.eventSize(p)).toBe(1);
    emitter.off(p, cb1);
    expect(emitter.events.size).toBe(0);
  });

  it('should emit for a single listener', () => {
    const p = 'foo';
    const listener = jest.fn((val) => val);
    emitter.on(p, listener);
    emitter.emit(p, 'bad');

    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.results[0].value).toBe('bad');
  });

  it('should emit for several listener', () => {
    const p = 'foo';
    const listener = jest.fn((val) => val);
    const listener1 = jest.fn((val) => val);
    const listener2 = jest.fn((val) => val);
    emitter.on(p, listener);
    emitter.on(p, listener1);
    emitter.on(p, listener2);
    emitter.emit(p, 'bad');

    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.results[0].value).toBe('bad');
    expect(listener1.mock.calls.length).toBe(1);
    expect(listener1.mock.results[0].value).toBe('bad');
    expect(listener2.mock.calls.length).toBe(1);
    expect(listener2.mock.results[0].value).toBe('bad');
  });

  it('should emit only once', () => {
    const p = 'foo';
    const listener = jest.fn((val) => val);
    emitter.once(p, listener);
    expect(emitter.size).toBe(1);
    expect(emitter.eventSize(p)).toBe(1);
    emitter.emit(p);
    emitter.emit(p);
    emitter.emit(p);
    emitter.emit(p);
    emitter.emit(p);
    expect(listener.mock.calls.length).toBe(1);
  });

});
