export function add(a: i32, b: i32): f64 {
  return a ** b
}

export function fibonacci(a: i32): f64 {
  if (a <= 1) {
    return 1
  }

  return a + fibonacci(a - 1)
}
