---
title: 5. Moudles & Packages
date: 2024-12-05 15:32:51
---

## Moudles

Package -> Crates -> Mods

```rs
// use crate::product::category;
mod product {
    use category::Category;

    pub struct Product {
        id: u64,
        name: String,
        price: f64,
        category: Category,
    }

    mod category {
        pub enum Category {
            Electronics,
            Clothing,
            Books,
        }
    }

    impl Product {
        fn calculate_tax(&self) -> f64 {
            self.price * 0.1
        }

        pub fn product_price(&self) -> f64 {
            self.price + self.calculate_tax()
        }
    }
}

mod customer {
    pub struct Customer {
        id: u64,
        name: String,
        email: String,
    }
}

mod order {
    use crate::customer::Customer;
    use crate::product::Product;
    struct Order {
        id: u64,
        product: Product,
        customer: Customer,
        quantity: u32,
    }

    impl Order {
        fn calculate_discount(&self) -> f64 {
            if self.quantity > 5 {
                0.1
            } else {
                0.0
            }
        }

        fn total_bill(&self) -> f64 {
            let discount = self.calculate_discount();
            let total_before_discount = self.product.product_price() * self.quantity as f64;
            total_before_discount - (total_before_discount * discount)
        }
    }
}

```

### Privacy in Modules

Rust 的文件结构:
mod 名字底下的mod.rs 是主文件入口，其他的属于子文件入口

```rs
// -------------------------------------------
// Exporting and Privacy in Modules
// -------------------------------------------
use my_package::{Category, Customer, Order, Product};

fn main() {
    let product = Product::new(1, String::from("Laptop"), 799.99, Category::Electronics);
    let customer = Customer::new(1, String::from("Alice"), String::from("alice@example.com"));
    let order = Order::new(1, product, customer, 2);
    println!("Total cost of the order: ${}", order.total_bill());
}
```

```rs
// -------------------------------------------
// Extenal Dependencies
// -------------------------------------------
use array_tool::vec::*;
use my_package::{Category, Customer, Order, Product};
fn main() {
    let product1 = Product::new(1, String::from("Laptop"), 799.99, Category::Electronics);
    let product2 = Product::new(2, String::from("T-Shirt"), 20.0, Category::Clothing);
    let product3 = Product::new(3, String::from("Book"), 10.0, Category::Books);

    let set1: Vec<&Product> = vec![&product1, &product2];
    let set2: Vec<&Product> = vec![&product2, &product3];
    let intersection = set1.intersect(set2);
    println!("The intersection is: {:?}", intersection);
}
```
