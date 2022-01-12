export class Channel {
  constructor(node) {
    this.node = node;
    this.puts = [];
    this.takes = [];
  }

  put(data) {
    return new Promise(resolvePut => {
      if (this.takes.length > 0) {
        this.takes.shift()(data);
        resolvePut();
      } else {
        this.puts.push(() => {
          resolvePut();
          return data;
        });
      }
    });
  }

  take(remove = true) {
    return new Promise(resolveTake => {
      if (this.puts.length > 0) {
        if (remove) {
          const t = this.puts.shift();
          const tv = t();
          resolveTake(tv);
        } else {
          const t = this.puts(0);
          const tv = t();
          resolveTake(tv);
        }
      } else {
        this.takes.push(resolveTake);
      }
    });
  }
}

