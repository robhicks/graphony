import { Graphony } from '../Graphony';
import { MemoryStore } from '../utils/MemoryStore';

describe('get()', () => {
  let graphony;

  beforeEach(() => {
    graphony = new Graphony({ store: new MemoryStore() });
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.get).toBeDefined()
  });

  it.only('should get/create a root path', () => {
    graphony.get();
    expect(graphony.nodes.length).toBe(1);
  });

  // it('should create a nested path', () => {
  //   const foo = graphony.get().get('user').get('rob');
  //   expect(foo.currentPath).toBe('root.user.rob');
  // });

  // it('should create a deeply nested path', () => {

  //   const bar = graphony.get().get('user').get('rob').get('wife');
  //   expect(bar.currentPath).toBe('root.user.rob.wife');
  // });

  // it('should create another deeply nested path', () => {

  //   graphony.get().get('users').get('rob@gmail.com');
  //   expect(graphony.nodes.length).toBe(3);
  // });

  // it('should get a complex path (one with periods)', () => {

  //   graphony.get('root.user.rob');
  //   expect(graphony.currentPath).toBe('root.user.rob');
  //   const node = graphony.nodes.get(graphony.currentPath);
  //   expect(node.path).toBe('root.user.rob');
  // });
});