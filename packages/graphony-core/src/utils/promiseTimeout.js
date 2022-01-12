  export default function promiseTimeout(prom, time) {
    return Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time))])
  }