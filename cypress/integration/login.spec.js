import { GraphonyClient } from '../../packages/graphony-client/src/GraphonyClient';
import { MemoryStore } from '../../packages/graphony-core/src/utils/MemoryStore';
import User from '../../packages/graphony-client/src/User'

describe('User', () => {
  const gc = new GraphonyClient({ baseUrl: 'http://localhost:3001', store: new MemoryStore() });
  const email = 'rob@hixfamily.org';
  const password = 'pass1234';

  beforeEach(() => {
    gc.store.clear()
  });

  it('should be an instance of User', () => {
    expect(gc.user instanceof User).to.equal(true);
  });

  it('should have certain properties and methods', () => {
    expect(gc.user.authenticated).to.be.a('boolean');
    expect(gc.user.uid).to.be.a('string');
    expect(gc.user.authChange).to.be.a('function');
    expect(gc.user.register).to.be.a('function');
    expect(gc.user.createProfile).to.be.a('function');
    expect(gc.user.deleteAccount).to.be.a('function');
    expect(gc.user.deleteProfile).to.be.a('function');
    expect(gc.user.login).to.be.a('function');
    expect(gc.user.logout).to.be.a('function');
    expect(gc.user.updateProfile).to.be.a('function');
  });

  describe('register()', () => {
    // it('should register a user', async () => {
    //   const resp = await gc.user.register(email, password);
    //   console.log(`describe::register::resp`, resp)
    // });
    // it('should not register an existing user', () => {
      
    // });
  })

  describe('login()', () => {
    it.only('should fail login', async () => {
      await gc.user.login(email, password);
      gc.get().get('users').get(email).once((usr) => {
        console.log(`usr`, usr)
      })
    });
    // it('should fail login', async () => {
    //   const resp = await gc.user.login(email, password);
    //   expect(resp).to.be.undefined;
    // });
  });
});