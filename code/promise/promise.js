import { strict } from "assert";

/**
 *  1. new Promise是，需要传递一个executor执行器，执行器立刻执行
 *  2. executor接受两个参数，分别是resolve和reject
 *  3. promise 只能从 pending 到 rejected， 或者从 pending 到 fulfilled
 *  4. pormise 的状态一旦确认，就不回再改变
 *  5. promise 都有then 方法，then接受两个参数，分别是promise成功的回调 onFulfilled, 和 promise 失败的回到 onRejected
 *  6. 如果调用 then 时，promise 已经成功，那么执行 onFulfilled，并将 promise 的值作为参数传递
 *     如果promise 已经失败，那么执行 onRejected，并将 promise 失败的原因作为参数传递进去
 *     如果 promise 的状态是pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数只想（发布订阅）
 *  7. then的参数onFulfilled和onRejected可以省略
 *  8. promise可以then多次，promise的then方法返回一个promise
 *  9. 如果then返回的是一个结果，那么就会把这个结果作为参数，传递给下一个then的成功的回调（onFulfilled）
 *  10. 如果then中抛出了异常，那么会把这个异常作为参数，传递给下一个then的失败的回调（onRejected）
 *  11. 如果then返回的是一个promise，那么需要等这个promise执行完，promise如果成功就走下一个then的成功，
 *      如果失败，就走下一个then的失败
  */

'use strict'

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function Promise(executor) {
    let self = this;
    self.status = PENDING;
    self.onFulfilled = []; // 成功的回调
    self.onRejected = []; // 失败的回调
    // PromiseA+ 2.1
    function resolve(value) {
        if (self.status === PENDING) {
            self.status = FULFILLED;
            self.value = value;
            self.onFulfilled.forEach(fn => fn()); // PromisieA+ 2.2.6.1
        }
    }
    function reject(reason) {
        if (self.status === PENDING) {
            self.status = REJECTED;
            self.reason = reason;
            self.onRejected.forEach(fn => fn()); // PromiseA+ 2.2.6.2
        }
    }

    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }

}

Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
    let self = this;
    let promise2 = new promise((resolve, reject) => {
        if (self.status === FULFILLED) {
            // PromiseA+ 2.2.2
            // PromiseA+ 2.2.4 --- setTimeout
            setTimeout(() => {
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        } else if (self.status === REJECTED) {
            setTimeout(() => {
                try {
                    let x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        } else if (self.status === PENDING) {
            self.onFulfilled.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.valeu);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            });
            self.onRejected.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            })
        }
    })
    return promise2;
}

function resolvePromise(promise2, x, resolve, reject) {
    let self = this;
    // PromsieA+ 2.3.1
    if (promise2 === x) {
        reject(new TypeError('Chaining cycle'));
    }
    if (x && typeof x === 'object' || typeof x === 'function') {
        let used; // PromsieA+ 2.3.3.3.3 只能调用一次
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, (y) => {
                    if (used) return;
                    used = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, (r) => {
                    if (used) return;
                    used = true;
                    reject(r);
                })
            } else {
                if (used) return;
                used = true;
                resolve(x);
            }
        } catch (e) {
            if (used) return;
            used = true;
            reject(e);
        }
    } else {
        resolve(x)
    }
}

Promise.resolve = function(param) {
    if (param instanceof Promise) {
        return param;
    }
    return new Promise((resolve, reject) => {
        if (param && param.then && typeof param === 'function') {
            setTimeout(() => {
                param.then(resolve, reject);
            })
        } else {
            resolve(param);
        }
    })
}

Promise.reject = function(reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    })
}

Promise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected)
}

Promise.prototype.finally = function(callback) {
    return this.then(value => {
        Promise.resovle(callback()).then(() => value);
    }, err => {
        return Promise.resolve(callbck()).then(() => {
            throw err;
        })
    })
}


Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let index = 0;
        let result = [];
        if (promises.length === 0) {
            resolve(result);
        } else {
            function processValue(i, data) {
                result[i] = data;
                if (++index === promises.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(data => {
                    processValue(i, data);
                }, err => {
                    reject(err);
                    return;
                })
            }
        }
    })
}

Promise.race = function(promises) {
    return new Promise((resovle, reject) => {
        if (promises.length === 0) {
            return;
        } else {
            for (let i = 0; i < promises.length; i++) {
                pormise.resolve(promises[i]).then(data => {
                    resolve(data);
                    return;
                }, err => {
                    reject(err);
                    return;
                })
            }
        }
    })
}