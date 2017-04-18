# Node Timers

Evaluate timer performance in Node.js.

Have you ever wandered which is more efficient strategy to handle item expiration in node?
- use a separate timer for each item
- use one timer to check all items regularly

Here we have two scripts that test these two approaches.
Each script creates a new item on each event loop iteration (using `setImmediate`). This allows pending timers to execute between item creation.

Each item stores the time it was created and the time it was deactivated (due to expiration).

## [multi-timer.js](multi-timer.js)

A new timer is created for each item to handle its expiration.

Run the script like this:
```
$ node multi-timer.js [<number-of-items>] [<expiration-time-ms>] 
```

## [single-timer.js](single-timer.js)

This time a single timer is used to check active items at regular intervals. The check interval is 1/10 of the expiration time, so the actual expiration time deviation should be at most 10%.

Run the script like this:
```
$ node single-timer.js [<number-of-items>] [<expiration-time-ms>]
```

## Results

Here are the results when running both scripts with 10M items and different expiration times.
The table contains the total time for each script execution together with the process memory at completion.

Expiry   | Multi-timer (RSS)   | Single-timer (RSS)
--------:|---------------------|-------------------
100 ms   | 21307 ms (1197 MB)  | 11891 ms (1106 MB)
200 ms   | 20552 ms (1154 MB)  | 12775 ms (1111 MB)
500 ms   | 20467 ms (1263 MB)  | 11696 ms (1086 MB)
1000 ms  | 22871 ms (1219 MB)  | 11317 ms (1054 MB)
2000 ms  | 22698 ms (1204 MB)  | 11122 ms (1046 MB)
5000 ms  | 25548 ms (1371 MB)  | 10330 ms (809 MB)

The performance of _multi-timer_ decreases slightly with the increase of the expiration time. This can be explained with the increased number of pending timers, which node has to check on each event loop iteration.

The performance of _single-timer_ increases slightly with the increase of the expiration time. This is hard to explain as while the number of active items to check increases, the chek period also increases with the same ratio.

In the end it seems like the single timer approach yields better performance.
Also its memory footprint is smaller.
Still this comes at the cost of increased code complexity.

For this test the scripts are executed with the following commands:
```
$ for i in 100 200 500 1000 2000 5000; do node multi-timer.js 1e7 $i; done
```
```
$ for i in 100 200 500 1000 2000 5000; do node single-timer.js 1e7 $i; done
```

```
$ node -v
v7.6.0
```
