import { IdbKeyValStore } from '../utils/IdbKeyValStore';

describe('IdbKeyValStore', () => {
  const store = new IdbKeyValStore('testDbName', 'testStoreName');
  const daughter = { name: 'Crystal', order: 1 };

  afterEach(async () => {
    await store.clear();
  });

  describe('clear()', () => {
    it('should clear all of the data of a store', async () => {
      await store.set('daughter', daughter);
      let d = await store.get('daughter');
      expect(d.name).toEqual('Crystal');
      expect(d.order).toEqual(1);

      await store.clear();
      d = await store.get('daughter');
      expect(d).to.be.undefined;
    });
  });

  describe('del()', () => {
    it('should delete the value of a key', async () => {
      await store.set('daughter', daughter);
      let d = await store.get('daughter');
      expect(d.name).toEqual('Crystal');
      expect(d.order).toEqual(1);
      await store.del('daughter');
      d = await store.get('daughter');
      expect(d).to.be.undefined;
    });
  });

  describe('get()', () => {
    it('should get the value of a key', async () => {
      await store.set('daughter', daughter);
      const d = await store.get('daughter');
      expect(d.name).toEqual('Crystal');
      expect(d.order).toEqual(1);
    });
  });

  describe('put()', () => {
    it('should set (overwrite) a value', async () => {
      await store.set('daughter', daughter);
      let d = await store.get('daughter');
      expect(d.name).toEqual('Crystal');
      expect(d.order).toEqual(1);
      await store.put('daughter', { lives: 'Fort Worth' }, true);
      d = await store.get('daughter');
      expect(d.lives).toEqual('Fort Worth');
    });
    it('should put (update) a value', async () => {
      await store.set('daughter', daughter);
      let d = await store.get('daughter');
      expect(d.name).toEqual('Crystal');
      expect(d.order).toEqual(1);
      await store.put('daughter', { lives: 'Fort Worth' });
      d = await store.get('daughter');
      expect(d.name).toEqual('Crystal');
      expect(d.order).toEqual(1);
      expect(d.lives).toEqual('Fort Worth');
    });
  });

  describe('set', () => {
    it('should set a value', async () => {
      await store.set('daughter', daughter);
      const d = await store.get('daughter');
      expect(d.name).toEqual('Crystal');
      expect(d.order).toEqual(1);
    });
  });
});
