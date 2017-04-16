'use strict';

const {
  run,
  expiryTime
} = require('./common');

function visit(item) {
  setTimeout(() => item.end = Date.now(), expiryTime);
}

run(visit);
