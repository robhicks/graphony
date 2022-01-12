const { GraphonyServer, MemoryStore } = require('./dist/graphony-server.js');

const store = new MemoryStore();

new GraphonyServer({port: 3001, store });

