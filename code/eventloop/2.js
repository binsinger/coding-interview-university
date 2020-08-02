async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}

console.log('illegalscript start')

setTimeout(function () { 
    console.log('setTimeout') 
}, 0)

new Promise(resolve => {
    console.log('promise1')
    resolve()
}).then(function () {
    console.log('promise2')
})
async1()
console.log('illegalscript end')  


// illegalscript start  
// promise1  
// async1 start  
// async2  
// illegalscript end  
// promise2  
// async1 end  
// setTimeout

// async1 相当于如下写法
// async function async1() {    
//     console.log('async1 start')    
//     new Promise(function (resolve) {      
//         resolve(async2());    
//     }).then(function () {      
//         console.log('async1 end')    
//     })  
// }
