import { GraphonyClient } from '../GraphonyClient';
import User from '../User'

describe('User', () => {
  const gc = new GraphonyClient({baseUrl: 'http://localhost:3001'});
  const email = 'rob@mail.com';
  const password = 'pass1234';

  it('should be an instance of User', () => {
    expect(gc.user instanceof User).toBe(true);
  });

  it('should have certain properties and methods', () => {
    expect(typeof gc.user.authenticated).toBe('boolean');
    expect(typeof gc.user.uid).toBe('string');
    expect(typeof gc.user.authChange).toBe('function');
    expect(typeof gc.user.createAccount).toBe('function');
    expect(typeof gc.user.createProfile).toBe('function');
    expect(typeof gc.user.deleteAccount).toBe('function');
    expect(typeof gc.user.deleteProfile).toBe('function');
    expect(typeof gc.user.login).toBe('function');
    expect(typeof gc.user.logout).toBe('function');
    expect(typeof gc.user.updateProfile).toBe('function');
  });

  describe('login()', () => {
    it.only('log a user with valid credentials in', async() => {

      const resp = gc.user.login(email, password);
    });
  });

});