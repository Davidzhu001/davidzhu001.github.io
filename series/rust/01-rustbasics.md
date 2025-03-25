---
title: 1. Rust Basics
date: 2024-12-04 15:32:51
---

##  Variables && Constance

### Variables
1. Definition
    ```rs
        let x = 10;
        let x: i16 = 10;
        println!("x is {x}");
    ```
2. Mutability
    ```rs
        let mut y = 5;
        y = 10;
    ```
3. Scope
    ```rs
        {
            let z = 50;
        }
    ```
4. Shadowing
    ```rs
        // Shadowing
        let t = 10;
        let t = t + 10;
        println!("t is {t}");

        let u = 3;
        let u = 3.0;

        let v = 30;
        {
            let v = 40;
            println!("inner v is: {v}");
        }
        println!("v is: {v}");
    ```
### Constants


 ```rs
    // Constants
    const MAX_VALUE: u32 = 100;
```

## DataTypes

### Primitive Data Types
####  Scalar Data Types

1. Integers
2. Floats
3. Chars
4. Boolean


```rs
fn main() {
    // Unsigned integers
    let unsigned_num: u8 = 5; 

    // Signed integers
    let signed_num: i8 = 5; 

    // Floating point numbers
    let float_num: f32 = 5.0; 

    // Platform specific integers
    let arch_1: usize = 5;
    let arch_2: isize = 5;

    // Characters
    let char = 'a';

    // Boolean
    let b: bool = true;

    // Type aliasing
    type Age = u8; 
    let peter_age: Age = 42;

    // Type Conversion
    let a = 10; 
    let b = a as f64;
}
```

### Compound Data Types

1. &str and String
2. Arrays
3. Vectors
4. Tuples
5. Empty Tuple

```rs

fn main() {
    // &str and String
    let fixed_str = "Fixed length string";
    let mut flexible_str = String::from("This string will grow");
    flexible_str.push('s');

    // Arrays
    let mut array_1 = [4, 5, 6, 8, 9];
    let num = array_1[3];

    println!("{:?}", array_1);
    let array_2 = [0; 10];

    // Vectors
    let vec_1: Vec<i32> = vec![4, 5, 6, 8, 9];
    let num = vec_1[3];

    // Tuples
    let my_info = ("Salary", 40000, "Age", 40);
    let salary_value = my_info.1;
    let (salary, salary_value, age, age_value) = my_info;

    let unit = ();
}
```