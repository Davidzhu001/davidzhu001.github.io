---
title: 07. Intermediate 进阶技巧
date: 2024-12-05 15:32:51
---

## Rust 泛型与特性

### Generics

泛型是一个编程语言不可或缺的机制。

C++ 语言中用"模板"来实现泛型，而 C 语言中没有泛型的机制，这也导致 C 语言难以构建类型复杂的工程。

泛型机制是编程语言用于表达类型抽象的机制，一般用于功能确定、数据类型待定的类，如链表、映射表等。

在函数中定义泛型
这是一个对整型数字选择排序的方法：

```rs
struct Point<T> {
    x: T,
    y: T
}
let p1 = Point {x: 1, y: 2};
let p2 = Point {x: 1.0, y: 2.0};

// 使用时并没有声明类型，这里使用的是自动类型机制，但不允许出现类型不匹配的情况如下：
// x 与 1 绑定时就已经将 T 设定为 i32，所以不允许再出现 f64 的类型。如果我们想让 x 与 y 用不同的数据类型表示，可以使用两个泛型标识符：


let p = Point {x: 1, y: 2.0};
struct Point<T1, T2> {
    x: T1,
    y: T2
}
```

在枚举类中表示泛型的方法诸如 Option 和 Result：

```rs
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

### impl and Function

```rs
// -------------------------------------------
// 			Generics
// -------------------------------------------

struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    fn new(x: T, y: U) -> Point<T, U> {
        Point { x, y }
    }
}

impl Point<i32, i32> {
    fn printing(&self) {
        println!("The values of the coordinates are {}, {}", self.x, self.y);
    }

    fn new_1(x: i32, y: i32) -> Point<i32, i32> {
        Point { x, y }
    }
}

impl Point<f64, f64> {
    fn printing(&self) {
        println!("The values of the coordinates are {}, {}", self.x, self.y);
    }
}

fn add_points<T, U>(p1: &Point<T, U>, p2: &Point<T, U>) -> Point<T, U> {
    unimplemented!();
}

fn add_points_i32(p1: &Point<i32, i32>, p2: &Point<i32, i32>) -> Point<i32, i32> {
    unimplemented!();
}

fn add_points_f64(p1: &Point<f64, f64>, p2: &Point<f64, f64>) -> Point<f64, f64> {
    unimplemented!();
}

fn main() {
    let origin = Point::new(0, 0);
    let p1 = Point::new(1.0, 4.0);

    let p2 = Point::new(5, 5.0);

    origin.printing();
    // p1.printing();

    add_points(&origin, &origin); // add_points_i32(&origin, &origin);
    add_points(&p1, &p1); // add_points_f64(&p1, &p1);
}

```
