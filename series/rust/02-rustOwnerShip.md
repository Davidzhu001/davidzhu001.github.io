---
title: 2. Ownership
date: 2024-12-05 15:32:51
---

## Ownership

### Ownership in Variable

1. Each value has a variable that's its "owner."

2. A value can have only one owner at a time.

3. If the owner goes out of scope, the value is cleaned up.

| 数据类型            | 是否自动实现 `Copy` | 示例                   | 说明                                   |
|---------------------|---------------------|------------------------|----------------------------------------|
| 基本整数类型        | ✅                  | `i8`, `i32`, `u64`    | 固定大小，按位复制                     |
| 浮点数类型          | ✅                  | `f32`, `f64`          | 固定大小，按位复制                     |
| 布尔类型            | ✅                  | `bool`                | 简单值，`true` 或 `false`，按位复制    |
| 字符类型            | ✅                  | `char`                | Unicode 标量值，固定大小，按位复制     |
| 不可变引用          | ✅                  | `&T`                  | 指针复制，不涉及所有权转移             |
| 可变引用            | ❌                  | `&mut T`              | 涉及所有权约束，不能复制               |
| 函数指针            | ✅                  | `fn(T) -> U`          | 简单指针，按位复制                     |
| 固定大小数组        | ✅                  | `[i32; 4]`            | 仅当元素类型 `T` 实现 `Copy` 时适用    |
| 元组                | ✅                  | `(i32, f64)`          | 仅当所有元素类型实现 `Copy` 时适用     |
| 字符串字面量        | ✅                  | `&str`                | 静态不可变引用，复制指针               |
| 动态字符串          | ❌                  | `String`              | 堆分配，涉及资源管理，不能复制         |
| 动态数组            | ❌                  | `Vec<T>`              | 堆分配，涉及资源管理，不能复制         |
| 结构体              | ❌                  | `struct MyStruct`     | 默认不实现，需手动派生且字段支持 `Copy` |
| 枚举                | ❌                  | `enum MyEnum`         | 默认不实现，需手动派生且变体支持 `Copy` |

```rs
fn main() {
    let s1 = String::from("world");
    {
        let s2 = s1;
    }
    //println!("s1 is: {s2}");

    let x = 15;
    let y = x;
    println!("x is: {x}");
}
```

### Ownership in Functions

```rs

fn main() {
    let vec_1 = vec![1, 2, 3];
    takes_ownership(vec_1.clone());
    println!("vec 1 is: {:?}", vec_1);

    let vec_2 = gives_onwership();
    println!("vec 2 is: {:?}", vec_2);

    let vec_3 = takes_and_gives_ownership(vec_2);
    //println!("vec 2 is: {:?}", vec_2);
    println!("vec 3 is: {:?}", vec_3);

    let x = 10;
    stack_function(x);
    println!("In main, x is: {x}");
}

fn takes_ownership(vec: Vec<i32>) {
    println!("vec is: {:?}", vec);
}

fn gives_onwership() -> Vec<i32> {
    vec![4, 5, 6]
}

fn takes_and_gives_ownership(mut vec: Vec<i32>) -> Vec<i32> {
    vec.push(10);
    vec
}

fn stack_function(mut var: i32) {
    var = 56;
    println!("In func, var is: {var}");
}

```

## Borrowing

- Borrrowing Rules
    1. At any time, you can have either one mutable reference or any number of immutable references.
    2. References must always be valid.

- Solve out two problems
    1. Data race
    2. Dangling references

```rs
fn main() {
    let mut vec_1 = vec![4, 5, 6];
    let ref1 = &vec_1;
    let ref2 = &vec_1;
    println!("ref1: {:?}, ref2: {:?}", ref1, ref2);
    let ref3 = &mut vec_1;

    let vec_2 = {
        let vec_3 = vec![1, 2, 3];
        &vec_3
    };
}
```

### Borrowing in Function

```rs
fn main() {
    let mut vec_1 = vec![1, 2, 3];
    let ref1 = &vec_1;
    borrows_vec(ref1);
    let ref2 = &mut vec_1;
    mutably_borrows_vec(ref2);
    println!("vec 1 is: {:?}", vec_1);
}
fn borrows_vec(vec: &Vec<i32>) {
    println!("vec is: {:?}", vec);
}

fn mutably_borrows_vec(vec: &mut Vec<i32>) {
    vec.push(10);
}

fn gives_onwership() -> Vec<i32> {
    vec![4, 5, 6]
}
```

### Dereferencing

```rs
fn main() {
    let mut some_data = 42;
    let ref_1 = &mut some_data;
    let deref_copy = *ref_1;
    *ref_1 = 13;
    println!("some_data is: {some_data}, deref_copy is: {deref_copy}");

    let mut heap_data = vec![5, 6, 7];
    let ref_1 = &heap_data;
    let ref_2 = ref_1;
    let ref_3 = ref_1;
    let deref_copy = ref_1.clone();

    let move_out = ref_1;
    // let move_out_again = ref_1;
}
```
