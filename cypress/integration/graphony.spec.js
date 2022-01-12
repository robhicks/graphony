import { Graphony } from '../../packages/graphony-core/src/Graphony';


describe('Graphony class', () => {
  let g;

  beforeEach(() => {
    g = new Graphony();
  });
  it('should have certain properties when instatiated', () => {
    expect(g).to.be.instanceof(Graphony);
    expect(g.del).to.be.a('function');
    expect(g.get).to.be.a('function');
    expect(g.on).to.be.a('function');
    expect(g.once).to.be.a('function');
    expect(g.push).to.be.a('function');
    expect(g.put).to.be.a('function');
    expect(g.set).to.be.a('function');
  });

  describe('get()', () => {
    it('should return the graphony instance', () => {
      const gi = g.get();
      expect(gi).to.be.instanceof(Graphony);
      expect(gi).to.equal(g);
    });

    it('should get the root path', () => {
      const gi = g.get();
      const nodes = gi.nodes;
      expect(nodes.size).to.equal(1);
      const it = gi.nodes.values();
      expect(it.next().value.path).to.equal('root')
    });

    it('should get a deeper path', () => {
      const gi = g.get().get('users').get('rob');
      const nodes = gi.nodes;
      expect(nodes.size).to.equal(3);
      const it = gi.nodes.values();
      expect(it.next().value.path).to.equal('root')
      expect(it.next().value.path).to.equal('root.users')
      expect(it.next().value.path).to.equal('root.users.rob')
    });

    it('should get a users path', () => {
      const gi = g.get().get('users').get('rob@gmail.com');
      const nodes = gi.nodes;
      expect(nodes.size).to.equal(3);
      const it = gi.nodes.values();
      expect(it.next().value.path).to.equal('root')
      expect(it.next().value.path).to.equal('root.users')
      expect(it.next().value.path).to.equal('root.users.rob@gmail.com')
    });

    it('should get a users path by string', () => {
      const gi = g.get('root.users.rob@gmail.com.profile');
      const nodes = gi.nodes;
      expect(nodes.size).to.equal(1);
      const it = gi.nodes.values();
      expect(it.next().value.path).to.equal('root.users.rob@gmail.com.profile')
    });
  });

  describe('set()', () => {
    it('should set a simple object', () => {
      const obj = { name: 'foo' };
      g
        .get()
        .set(obj)
        .once((val) => {
          expect(val).to.be.equal(obj);

        })
    });

    it('should set an empty array', () => {
      const obj = [];
      g
        .get()
        .set(obj)
        .once((val) => {
          expect(val).to.be.eql(obj);
        })
    });

    it('should add a deeply nested object', () => {
      const obj = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };
      g
        .get()
        .set(obj)
        .once((val) => {
          expect(val).to.be.equal(obj);
        })
    });

    it('should set an array with items', () => {
      const obj = [{ name: 'foo' }, { name: 'bar' }];
      g
        .get()
        .set(obj)
        .once((val) => {
          expect(val).to.be.eql(obj);
        })
    });
  });

  describe('put()', () => {
    it('should update (put) a simple object', () => {
      const obj = { name: 'foo' };
      const update = { name: 'rob'}
      g
        .get()
        .set(obj)
        .put(update)
        .once((val) => {
          expect(val).to.be.eql(update);
        })
    });
    it('should update (put) a more complex object', () => {
      const obj = { name: 'foo' };
      const update = { address: { 
        street: '124 Main Street',
        city: `Everyone's town`,
        country: 'USA'
      } }
      g
        .get()
        .set(obj)
        .put(update)
        .once((val) => {
          expect(val).to.be.eql({...obj, ...update});
        })
    });
  });

  describe('del()', () => {
    it('should delete the value of a node', () => {
      const obj = { name: 'foo' };
      const update = {
        address: {
          street: '124 Main Street',
          city: `Everyone's town`,
          country: 'USA'
        }
      }
      g
        .get()
        .set(obj)
        .put(update)
        .del()
        .once((val) => {
          expect(val).to.be.null;
        })
    });
  });

  describe('on()', () => {

    it('should get fired immediately and on each subsequent data change event', () => {
      const set = { name: 'foo' };
      const change = { name: 'bar' };
      const change1 = { address: 'foobar' };
      const cb = cy.stub()
        .onCall(0).callsFake((val) => expect(val).to.eql(set))
        .onCall(1).callsFake((val) => expect(val).to.eql(change))
        .onCall(2).callsFake((val) => expect(val).to.eql({...change, ...change1}))

      g
        .get()
        .set(set)
        .on(cb, { immediate: true})
        .put(change)
        .put(change1)

    });
    
    it('should get fired on each subsequent data change event', () => {
      const set = { name: 'foo' };
      const change = { name: 'bar' };
      const change1 = { address: 'foobar' };
      const cb = cy.stub()
        .onCall(0).callsFake((val) => expect(val).to.eql(change))
        .onCall(1).callsFake((val) => expect(val).to.eql({ ...change, ...change1 }))
      g
        .get()
        .set(set)
        .on(cb)
        .put(change)
        .put(change1)
    });
  });

  describe('once()', () => {
    it('should return null or undefined in data does not exist for the node', () => {
      const obj = { name: 'foo' };
      g
        .get()
        .get('users')
        .get('rob@mail.com')
        .once((val) => {
          expect(val).to.be.undefined;
        });
    });

    it('should get the value of an object stored at the root', () => {
      const obj = { name: 'foo' };
      g
        .get()
        .set(obj)
        .once((val) => {
          expect(val).to.equal(obj);
        });
    });

    it('should get the value of deeply stored object', () => {
      const obj = { name: 'foo' };
      g
        .get('users')
        .get('rob')
        .set(obj)
        .once((val) => { expect(val).to.equal(obj);  });
    });

    it('should get the value of an object stored at the root', () => {
      const obj = { name: 'foo', location: 'bar' };
      g
        .get()
        .set(obj)
        .once((val) => { expect(val).to.equal(obj);  });
    });

    it('should get the value of a deeply nested object', () => {
      const obj = { name: 'foo', location: 'bar' };
      g
        .get('users')
        .get('rob')
        .set(obj)
        .once((val) => { expect(val).to.equal(obj);  });
    });

    it('should get the value of an object stored by reference', () => {
      const obj = { name: 'rob' };
      g
        .get()
        .get('users')
        .get('rob')
        .set([])
        .push(obj)
        .once((val) => {
          expect(val).to.eql([obj])
          ;
        });
    });

    it('should get a user by email', () => {
      g.get().get('users').get('rob@mail.com').once((user) => {
        expect(user).to.be.undefined;
        ;
      })
    });

    it('should handle a set followed by a push followed by once', () => {
      const name = { name: 'rob' };
      const address = { address: '123 Main Street' };
      g
        .get()
        .get('users')
        .get('rob')
        .set(name)
        .put(address)
        .once((val) => {
          expect(val).to.eql({ name: 'rob', address: '123 Main Street' })
          ;
        })

    });
  })

  describe.only('push', () => {
    it('should be created when Graphony is instantiated', () => {
      expect(g.push).to.exist();
    });

    it('should add a simple object to an array', () => {
      const obj = { name: 'foo' };
      g.get().set([]).push(obj).once((val) => {
        expect(val).to.equal([obj]);
      });
    });

    it('should add a deeply nested object', () => {
      const obj = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };
      g.get().get('foo').get('bar').set([])
        .push(obj)
        .once((val) => expect(val).to.equal([obj]));
    });

    it.only('should add items to an array', () => {
      const foo = { name: 'foo' };
      const bar = { name: 'bar' };
      g.get().set([]).push(foo).push(bar)
        .once((val) => expect(val).to.equal([foo, bar]));
    });

    it('should add an object to an array by reference', () => {
      const rob = {
        givenname: 'rob',
        surnname: 'hicks',
      };

      g.get().get('rob').set(rob);
      graphony.get().get('users').set([]).push(rob)
        .once((val) => expect(val).to.equal([rob]));
    });
  })
});
