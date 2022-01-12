import { Channel } from '../utils/Channel';

describe('Channel()', () => {
  it('should quack', (done) => {
    setTimeout(() => {
      done();
    }, 2000);
  });
});

const channel = new Channel();

function A(index) {
  (async() => {
    await channel.put(index);
    const value = await channel.take();
    console.log(`Fibonacci number for index ${index} is ${value}`);
  })();
}


function B() {
  (async() => {
    const fibonacci = num => {
      if (num <= 1) return 1;
      return fibonacci(num - 1) + fibonacci(num - 2);
    };
    const index = await channel.take();
    setTimeout(() => {
      channel.put(fibonacci(index));
    }, 100);
  })();
}

A(10);
B();
B();
A(0);
A(3);
B();
A(4);
B();