---
title: 02. Rust Sequences and Maps
date: 2024-12-12 15:32:51
---

## 📒 Rust Sequences and Maps

**Date**: December 12, 2024  

This guide provides an overview of Rust's common sequence and map data structures: `Vector`, `VecDeque`, `LinkedList`, and `HashMap`. Each section includes a detailed description, use cases, and clear, annotated code examples to help you understand and use these structures effectively.

---

## 1. Vector

### Description
A `Vector` (`Vec<T>`) is Rust's dynamic array, similar to Python's list or C++'s `std::vector`. It stores elements contiguously in memory, providing fast indexing and iteration but slower insertions/removals in the middle. Vectors are ideal for scenarios where you need a growable, ordered collection with frequent access by index.

### Use Cases
- Storing a list of items that grows dynamically (e.g., user inputs, records).
- Fast random access to elements.
- Iterating over a collection in order.

### Example Code
The following example demonstrates creating a vector, adding an element, and printing its contents.

```rs
fn main() {
    // Create a vector using the `vec!` macro
    let mut fruits: Vec<&str> = vec!["apple", "banana", "cherry"];

    // Add an element to the end
    fruits.push("orange");

    // Print the vector
    println!("Fruit vector: {:?}", fruits);
    // Output: Fruit vector: ["apple", "banana", "cherry", "orange"]
}
```

### Key Methods
- `push`: Adds an element to the end.
- `pop`: Removes and returns the last element.
- `get`: Accesses an element by index (returns `Option`).
- `len`: Returns the number of elements.

---

## 2. VecDeque

### Description
A `VecDeque` (`std::collections::VecDeque<T>`) is a double-ended queue, allowing fast appends and pops at both ends. It’s implemented as a circular buffer, making it more efficient than a `Vec` for operations at the front. Use `VecDeque` when you need queue-like behavior or frequent modifications at both ends.

### Use Cases
- Implementing a queue or deque (e.g., task scheduling, sliding window algorithms).
- Efficiently adding/removing elements at the start or end.
- Circular buffer applications.

### Example Code
This example shows how to create a `VecDeque`, add elements to both ends, and display the result.

```rs
use std::collections::VecDeque;

fn main() {
    // Create an empty VecDeque
    let mut fruit_deque: VecDeque<&str> = VecDeque::new();

    // Add to the back
    fruit_deque.push_back("apple");

    // Add to the front
    fruit_deque.push_front("cherry");

    // Print the deque
    println!("Fruit deque: {:?}", fruit_deque);
    // Output: Fruit deque: ["cherry", "apple"]
}
```

### Key Methods
- `push_back` / `pop_back`: Add/remove at the end.
- `push_front` / `pop_front`: Add/remove at the start.
- `len`: Returns the number of elements.
- `get`: Accesses an element by index.

---

## 3. Linked List

### Description
A `LinkedList` (`std::collections::LinkedList<T>`) is a doubly-linked list, offering efficient insertions and removals at any position but slower indexing due to non-contiguous memory. Rust’s standard `LinkedList` is less commonly used because `Vec` or `VecDeque` often perform better, but it’s useful for specific cases requiring frequent splicing or middle insertions.

### Use Cases
- Scenarios requiring frequent insertions/removals in the middle.
- Implementing certain algorithms (e.g., LRU cache with custom node management).
- When memory allocation must be non-contiguous.

### Example Code
Below is a simplified custom singly-linked list implementation for clarity, demonstrating appending, removing, and traversing elements. (Note: The standard `std::collections::LinkedList` is more feature-rich but complex for a basic example.)

```rs
use std::cell::RefCell;
use std::rc::Rc;

// Define a type alias for links
type Link<T> = Option<Rc<RefCell<Node<T>>>>;

// Node structure
struct Node<T> {
    value: T,
    next: Link<T>,
}

// LinkedList structure
struct LinkedList<T> {
    head: Link<T>,
}

impl<T: std::fmt::Display> LinkedList<T> {
    // Create an empty list
    fn new() -> Self {
        LinkedList { head: None }
    }

    // Append a new node at the head
    fn append(&mut self, value: T) {
        let new_node = Rc::new(RefCell::new(Node {
            value,
            next: self.head.clone(),
        }));
        self.head = Some(new_node);
    }

    // Remove the head node
    fn remove_head(&mut self) {
        if let Some(node) = self.head.clone() {
            self.head = node.borrow().next.clone();
        }
    }

    // Traverse and print the list
    fn traverse(&self) {
        let mut current = self.head.clone();
        while let Some(node) = current {
            print!("{} -> ", node.borrow().value);
            current = node.borrow().next.clone();
        }
        println!("None");
    }
}

fn main() {
    // Create a new linked list
    let mut list: LinkedList<i32> = LinkedList::new();

    // Append elements
    list.append(1);
    list.append(2);
    list.append(3);

    // Traverse the list
    list.traverse();
    // Output: 3 -> 2 -> 1 -> None

    // Remove the head
    list.remove_head();
    list.traverse();
    // Output: 2 -> 1 -> None
}
```

### Notes
- This example uses `Rc` and `RefCell` for shared ownership and mutability, common in Rust for linked lists.
- The standard `LinkedList` provides methods like `push_front`, `push_back`, `pop_front`, and `pop_back`.

---

## 4. HashMap

### Description
A `HashMap` (`std::collections::HashMap<K, V>`) is a key-value store, similar to Python’s dictionary or Java’s `HashMap`. It provides average O(1) time complexity for lookups, insertions, and deletions, using a hash table internally. Use `HashMap` when you need fast key-based access to values.

### Use Cases
- Storing key-value pairs (e.g., configuration settings, lookup tables).
- Counting occurrences (e.g., word frequency in text).
- Caching results by key.

### Example Code
This example creates a `HashMap`, inserts a key-value pair, and retrieves a value.

```rs
use std::collections::HashMap;

fn main() {
    // Create a new HashMap
    let mut fruit_calories: HashMap<&str, i32> = HashMap::new();

    // Insert a key-value pair
    fruit_calories.insert("apple", 95);

    // Access and print a value
    println!("Apple calories: {}", fruit_calories["apple"]);
    // Output: Apple calories: 95
}
```

### Key Methods
- `insert`: Adds or updates a key-value pair.
- `get`: Retrieves a value by key (returns `Option`).
- `remove`: Deletes a key-value pair.
- `contains_key`: Checks if a key exists.

---

## Summary
- **Vector**: Best for dynamic arrays with fast indexing.
- **VecDeque**: Ideal for queue-like structures with fast operations at both ends.
- **LinkedList**: Useful for frequent middle insertions/removals, though less common.
- **HashMap**: Perfect for key-value storage with fast lookups.

Each data structure has unique strengths, so choose based on your specific performance and functionality needs. For further details, refer to the [Rust documentation](https://doc.rust-lang.org/std/collections/).