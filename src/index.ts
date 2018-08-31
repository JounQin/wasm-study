// tslint:disable no-console
export function _add(a: number, b: number): number {
  return a ** b
}

export function _fibonacci(a: number): number {
  if (a <= 1) {
    return 1
  }

  return a + _fibonacci(a - 1)
}

console.time('normal')
console.log(_add(9, 9))
console.log(_fibonacci(9999))
console.timeEnd('normal')
;(async () => {
  const { add, fibonacci } = await import('../asms/module')
  console.time('wasm')
  console.log(add(9, 9))
  console.log(fibonacci(9999))
  console.timeEnd('wasm')
})()
