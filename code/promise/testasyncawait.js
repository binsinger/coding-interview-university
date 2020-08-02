async function test() {
    console.log(100)
    let x = await 200
    console.log(x)
    console.log(200)
  }
  console.log(0)
  test()
  console.log(300)