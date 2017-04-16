'use strict';

const {
  run,
  items,
  expiryTime
} = require('./common');

function checkItems() {
  let now = Date.now();
  for (let i = items.length - 1; i >= 0 && !items[i].end; --i) {
    let x = items[i];
    if (now - x.start >= expiryTime) {
      x.end = now;
    }
  }
}

const checkPeriod = expiryTime / 10;
var checkTimer = setInterval(checkItems, checkPeriod);

run(null, () => clearInterval(checkTimer));
console.log('Checking for expired items each %d ms', checkPeriod);
