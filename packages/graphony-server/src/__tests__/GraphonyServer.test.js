import { GraphonyServer } from '../index.js'


describe('GraphonyServer', () => {
  const server = new GraphonyServer({
    google: {
      clientID: '',
      clientSecret: '',
      callbackURL: ''
    }
  });

  it('should quack', () => {
    
  });
});