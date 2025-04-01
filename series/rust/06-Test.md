---
title: 6. Testing
date: 2024-12-05 15:32:51
---

## Commands
 
```bash
cargo test {{testname}}
 
Set the number of simultaneous running test cases:
 
cargo test -- --test-threads={{count}}
 
Require that Cargo.lock is up to date:
 
cargo test --locked
 
Test artifacts in release mode, with optimizations:
 
cargo test --release
 
Test all packages in the workspace:
 
cargo test --workspace
 
Run tests for a package:
 
cargo test --package {{package}}
 
Run tests without hiding output from test executions:
 
cargo test -- --nocapture
```
## Unit Test

```rs
mod shapes {
    pub struct Circle {
        radius: f32,
    }
    impl Circle {
        pub fn new(radius: f32) -> Circle {
            Circle { radius }
        }

        pub fn new_1(radius: f32) -> Result<Circle, String> {
            if radius >= 0.0 {
                Ok(Circle { radius })
            } else {
                Err(String::from("radius should be positive"))
            }
        }

        pub fn new_2(radius: f32) -> Circle {
            match radius {
                -10.0..=0.0 => panic!("is between -10.0 and 0.0"),
                ..=10.0 => panic!("is lesser then -10.0"),
                _ => Circle { radius },
            }
        }
        pub fn contains(&self, other: &Circle) -> bool {
            self.radius > other.radius
        }
    }
}

fn some_fn() {}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn larger_circle_should_contain_smaller() {
        some_fn();
        let larger_circle = shapes::Circle::new(5.0);
        let smaller_circle = shapes::Circle::new(2.0);
        assert_eq!(
            larger_circle.contains(&smaller_circle),
            true,
            "Custom failure message"
        );

        assert_ne!(larger_circle.contains(&smaller_circle), false);
        assert!(larger_circle.contains(&smaller_circle));
    }

    #[test]
    fn smaller_circle_should_not_contain_larger() {
        let larger_circle = shapes::Circle::new(5.0);
        let smaller_circle = shapes::Circle::new(2.0);
        assert_eq!(!smaller_circle.contains(&larger_circle), true);
    }

    #[test]
    fn should_not_create_circle() -> Result<(), String> {
        let some_circle = shapes::Circle::new_1(-1.0)?;
        Ok(())
    }
    #[test]
    #[should_panic(expected = "is lesser then -10.0")]
    fn should_not_create_and_panic() {
        let some_circle = shapes::Circle::new_2(-11.0);
    }
}
```

## How Test runs

```rs
/*
cargo test --lib
cargo test --lib -- --show-output
cargo test --lib larger_circle_should_contain_smaller
cargo test --lib should_not
cargo test --lib -- --ignored
 */


mod shapes {
    pub struct Circle {
        radius: f32,
    }
    impl Circle {
        pub fn new(radius: f32) -> Circle {
            println!("Congratulations! Circle is created");
            Circle { radius }
        }

        pub fn new_1(radius: f32) -> Result<Circle, String> {
            if radius >= 0.0 {
                Ok(Circle { radius })
            } else {
                Err(String::from("radius should be positive"))
            }
        }

        pub fn new_2(radius: f32) -> Circle {
            match radius {
                -10.0..=0.0 => panic!("is between -10.0 and 0.0"),
                ..=10.0 => panic!("is lesser then -10.0"),
                _ => Circle { radius },
            }
        }
        pub fn contains(&self, other: &Circle) -> bool {
            self.radius > other.radius
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn larger_circle_should_contain_smaller() {
        let larger_circle = shapes::Circle::new(5.0);
        let smaller_circle = shapes::Circle::new(2.0);
        assert_eq!(
            larger_circle.contains(&smaller_circle),
            true,
            "Custom failure message"
        );

        assert_ne!(larger_circle.contains(&smaller_circle), false);
        assert!(larger_circle.contains(&smaller_circle));
    }

    #[test]
    fn smaller_circle_should_not_contain_larger() {
        let larger_circle = shapes::Circle::new(5.0);
        let smaller_circle = shapes::Circle::new(2.0);
        assert_eq!(!smaller_circle.contains(&larger_circle), true);
    }

    #[test]
    fn should_not_create_circle() -> Result<(), String> {
        let some_circle = shapes::Circle::new_1(1.0)?;
        Ok(())
    }
    #[test]
    #[should_panic(expected = "is lesser then -10.0")]
    fn should_not_create_and_panic() {
        let some_circle = shapes::Circle::new_2(-11.0);
    }

    #[test]
    #[ignore]
    fn huge_test() {
        // code that run for hours
    }
}
```

## Integret 

```rs
use testing::{Category, Customer, Order, Product};
mod helpers;
#[test]
fn test_total_bill_without_discount() {
    helpers::common_setup();
    let product = Product::new(1, String::from("Book"), 19.9, Category::Books);
    let customer = Customer::new(1, String::from("Bob"), String::from("bob@example.com"));
    let order = Order::new(2, product, customer, 3);

    assert_eq!(format!("{:.2}", order.total_bill()), "65.67");
}

#[test]
fn test_total_bill_with_discount() {
    let product = Product::new(1, String::from("Book"), 19.99, Category::Books);
    let customer = Customer::new(1, String::from("Bob"), String::from("bob@example.com"));
    let order = Order::new(2, product, customer, 10); // change to 10 later on
    assert_eq!(format!("{:.2}", order.total_bill()), "197.90"); // change to 197.90
}


// store in a separate file inside the tests/helpers/mod.rs 
pub fn common_setup();
```

## Benchmark

```rs
// -------------------------------------------
// 			Benchmarking using Criterion
// -------------------------------------------

// Dependencies
// [dev-dependencies]
// criterion = "0.4.0"
// [[bench]]
// name = "sorting_benchmark"
// harness = false

// code for sorting_benchmark.rs file

use learning_rust::{sort_algo_1, sort_algo_2};

use criterion::{criterion_group, criterion_main, Criterion};

fn sort_benchmark(c: &mut Criterion) {
    let mut numbers: Vec<i32> = vec![
        1, 2, 3, 6, 5, 4, 8, 52, 2, 1, 5, 4, 4, 5, 8, 54, 2, 0, 55, 5, 2, 0, 5, 5, 5, 21,
    ];

    // This creates a benchmark
    c.bench_function("Sorting Algorithm", |b| {
        b.iter(|| sort_algo_2(&mut numbers))
    });
}

criterion_group!(benches, sort_benchmark);
criterion_main!(benches);

// Code for lib.rs
pub fn sort_algo_1<T: PartialOrd>(arr: &mut Vec<T>) {
    let mut swapped = false;
    for i in 0..(arr.len() - 1) {
        if arr[i] > arr[i + 1] {
            arr.swap(i, i + 1);
            swapped = true;
        }
    }
    if swapped {
        sort_algo_1(arr);
    }
}

pub fn sort_algo_2<T: Ord>(arr: &mut Vec<T>) {
    let len = arr.len();
    for left in 0..len {
        let mut smallest = left;
        for right in (left + 1)..len {
            if arr[right] < arr[smallest] {
                smallest = right;
            }
        }
        arr.swap(smallest, left);
    }
}
```