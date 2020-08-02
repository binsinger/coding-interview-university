
// 1 1 2 3 5 8 13 21 34 55
const fib = (n) => {
    if (n <= 1) return n;
    let a = 0, b =1;
    for (let i = 2; i <=n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}
// console.log(fib(10))
const currying = function(fn, ...args) {
    return function(m) {
        return fn.call(this, m, ...args)
    }
}
const fibtail = (n, a = 0, b=1) => {
    if (n <=1) return b;
    return fibtail(n-1, b, b+a)
}
const fib1 = currying(fibtail, 1, 1)
console.log(fibtail(100))
