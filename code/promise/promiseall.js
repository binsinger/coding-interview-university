
let promiseAll = function (promises) {
    return new Promise((resolve, reject) => {
        let result = [];
        let len = promises.length;
        if (len === 0) {
            resolve(result);
            console.log('after resolve');
            return;
        }
        const handleData = (data, index) => {
            result[index] = data;
            // 最后一个 promise 执行完
            if (index == len - 1) resolve(result);
        }
        for (let i = 0; i < len; i++) {
            // 为什么不直接 promise[i].then, 因为promise[i]可能不是一个promise
            Promise.resolve(promise[i]).then(data => {
                handleData(data, i);
            }).catch(err => {
                reject(err);
            })
        }
    })
}

promiseAll([])