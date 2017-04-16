'use strict';

const nItems = +process.argv[2] || 1e7;
const expiryTime = +process.argv[3] || 2000;
const items = [];

module.exports = {
  run,
  items,
  expiryTime
};


function run(visit, done) {
  console.log('Creating %d items...', nItems);
  var start = Date.now();
  loop();

  function loop() {
    if (items.length >= nItems) {
      console.log('Total time: %d ms', Date.now() - start);
      complete();
      done && done();
      return;
    }
    let x = {
      start: Date.now()
    };
    visit && visit(x);
    items.push(x);
    if (items.length % 1e6 === 0) {
      console.log('%d items', items.length);
    }
    setImmediate(loop);
  }
}

function complete() {
  let finished = 0;
  let time = 0;
  for (let x of items) {
    if (x.end) {
      ++finished;
      time += x.end - x.start;
    }
  }
  console.log('Total items: %d', items.length);
  console.log('Expired items: %d (%d%%)', finished, finished / items.length * 100);
  console.log('Average item expiration time: %d ms', time / finished);
  console.log('Target item expiration time: %d ms', expiryTime);
  console.log('Proces memory: %d MB', Math.round(process.memoryUsage().rss / (2**20)));
}
