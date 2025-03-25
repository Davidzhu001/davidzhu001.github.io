---
title: 1. Rust Basics
date: 2024-12-04 15:32:51
---

##  Variables

### Var
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