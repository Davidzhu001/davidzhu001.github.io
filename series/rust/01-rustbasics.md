---
title: 1. Rust Basics
date: 2024-12-05 15:32:51
---

## Variables && Constance

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

#### Scalar Data Types

:::info
使用 signed 类型时，可以处理负数，适合需要表示负值的场景。

使用 unsigned 类型时，可以获得更大的正数范围，适合只需要非负值的场景。
:::

1. Integers
2. Floats
3. Chars ''
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

1. &str and String  ""
2. Arrays 固定的集合
3. Vectors 非固定的集合
4. Tuples 是一种可以包含不同类型元素的固定大小集合。
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

## Function and Code Block

Code Block 不可复用， 不能传参；

```rs
fn main() {
    my_fn("This is my function");
    let str = "Function call with a variable";
    my_fn(str);

    let answer = multiplication(10, 15);

    let result = basic_math(10, 15);
    let (multiplication, addition, subtraction) = basic_math(10, 15);

    let full_name = {
        let first_name = "Nouman";
        let last_name = "Azam";
        format!("{first_name} {last_name}")
    };
}

fn my_fn(s: &str) {
    println!("{s}");
}

fn multiplication(num1: i32, num2: i32) -> i32 {
    println!("Computing multiplication");
    num1 * num2
}

fn basic_math(num1: i32, num2: i32) -> (i32, i32, i32) {
    (num1 * num2, num1 + num2, num1 - num2)
}
```

## Conditions

```rs

fn main() {
    let num = 40;
    if num < 50 {
        println!("The number is less than 50");
    } else {
        println!("The number is greater than or equal to 50");
    }

    let marks = 95;
    //let mut grade = 'N';

    let grade = if marks >= 90 {
        'A'
    } else if marks >= 80 {
        'B'
    } else if marks >= 70 {
        'C'
    } else {
        'F'
    };

    let marks = 95;
    //let mut grade = 'N';

    // 90..=100 表达range
    let grade = match marks {
        90..=100 => 'A',
        80..=89 => 'B',
        70..=79 => 'C',
        _ => 'F',
    };
}

```

## Loops / Control Flow

```rs
fn main() {
    //loop的标签；
    'outer: loop {
        loop {
            println!("Inner loop");
            break 'outer; // 跳出外层的循环
        }
    }

    let a = loop {
        break 5;
    };

    let vec = vec![45, 30, 85, 90, 41, 39];

    for i in vec {
        println!("{i}");
    }

    let mut num = 0;
    while num < 10 {
        num = num + 1;
    }
}
```
