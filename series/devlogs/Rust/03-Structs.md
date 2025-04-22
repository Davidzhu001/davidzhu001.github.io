---
title: 3. Structs Enum, Option, Result
date: 2024-12-05 15:32:51
---

## Structs Enum, Option, Result

### Structs and its Types

```rs

struct Car {
    owner: String,
    year: u32,
    fuel_level: f32,
    price: u32,
}
fn main() {
    let mut my_car = Car {
        owner: String::from("ABC"),
        year: 2010,
        fuel_level: 0.0,
        price: 5_000,
    };
    let car_year = my_car.year;
    my_car.fuel_level = 30.0;
    let extracted_owner = my_car.owner.clone();
    println!("Owner is: {}", my_car.owner);

    let another_car = Car {
        owner: "new_name".to_string(),
        ..my_car
    };

    //println!("Owner is: {}", my_car.owner);

    // Tuple Structs
    let point_2D = (1, 3);
    let point_3D = (4, 10, 13);

    struct Point_2D(i32, i32);
    struct Point_3D(i32, i32, i32);

    let point1 = Point_2D(1, 3);
    let point2 = Point_3D(4, 10, 13);

    // Unit Struct
    struct ABC;
}
```

### Functionality to Structs

```rs

struct Car {
    owner: String,
    year: u32,
    fuel_level: f32,
    price: u32,
}
impl Car {
    fn monthly_insurance() -> u32 {
        123
    }

    fn selling_price(&self) -> u32 {
        self.price + Car::monthly_insurance()
    }

    fn new(name: String, year: u32) -> Self {
        Self {
            owner: name,
            year: year,
            fuel_level: 0.0,
            price: 0,
        }
    }

    fn display_car_info(&self) {
        println!(
            "Owner: {}, Year: {}, Price: {}",
            self.owner, self.year, self.price
        );
    }

    fn refuel(&mut self, gallons: f32) {
        self.fuel_level += gallons;
    }

    fn sell(self) -> Self {
        self
    }
}

fn main() {
    let mut my_car = Car {
        owner: String::from("ABC"),
        year: 2010,
        fuel_level: 0.0,
        price: 5_000,
    };

    my_car.display_car_info();
    // display_car_info(&my_car);

    my_car.refuel(10.5);
    let new_owner = my_car.sell();
    // my_car.refuel(10.5);

    let new_car = Car::new("XYZ".to_string(), 2020);
}
```

## Enums

```rs

/* 
// Example 1: 

enum WeekDay {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sundary,
}
fn main() {
    let mut day = "Saturday".to_string();

    let week_day = vec![
        "Monday".to_string(),
        "Tuesday".to_string(),
        "Wednesday".to_string(),
        "Thursday".to_string(),
        "Friday".to_string(),
        "Saturday".to_string(),
        "Sundary".to_string(),
    ];
    day = week_day[1].clone();

    let day = WeekDay::Saturday;
}
*/


// Example 2:
enum TravelType {
    Car(f32),
    Train(f32),
    Aeroplane(f32),
}

impl TravelType {
    fn travel_allowance(&self) -> f32 {
        let allowance = match self {
            TravelType::Car(miles) => miles * 2.0,
            TravelType::Train(miles) => miles * 3.0,
            TravelType::Aeroplane(miles) => miles * 5.0,
        };
        allowance
    }
}
fn main() {
    let participant = TravelType::Car(60.0);
    println!(
        "Allowance of participant is: {}",
        participant.travel_allowance()
    );
}
```

### Option

```rs

struct Student {
    name: String,
    grade: Option<u32>,
}
fn get_grade(student_name: &String, student_db: &Vec<Student>) -> Option<u32> {
    for student in student_db {
        if student.name == *student_name {
            return student.grade;
        }
    }
    None
}
fn main() {
    let student_db = vec![
        Student {
            name: String::from("Alice"),
            grade: Some(95),
        },
        Student {
            name: String::from("Bob"),
            grade: Some(87),
        },
        Student {
            name: String::from("Charlie"),
            grade: None,
        },
    ];

    let student_name = String::from("Bob");
    let student_grade = get_grade(&student_name, &student_db);

    // match student_grade {
    //     Some(grade) => println!("Grade is: {grade}"),
    //     None => {}
    // }

    if let Some(grade) = student_grade {
        println!("Grade is: {grade}");
    }
}

// enum Option<T> {
//     None,
//     Some(T),
// }
```

### Result

```rs
------------------------------------

struct Student {
    name: String,
    grade: Option<u32>,
}
// fn get_grade(student_name: &String, student_db: &Vec<Student>) -> Option<u32> {
//     for student in student_db {
//         if student.name == *student_name {
//             return student.grade;
//         }
//     }
//     None // not reachable
// }
// enum Result<T, E> {
//     Ok(T),
//     Err(E),
// }

// fn check_student(student_name: &String, student_db: &Vec<Student>) -> Result<(), String> {
//     for student in student_db {
//         if student.name == *student_name {
//             return Ok(());
//         }
//     }
//     Err(String::from("Student not found"))
// }

fn check_student_get_grade(
    student_name: &String,
    student_db: &Vec<Student>,
) -> Result<Option<u32>, String> {
    for student in student_db {
        if student.name == *student_name {
            return Ok(student.grade);
        }
    }
    Err(String::from("Student not found"))
}
fn main() {
    let student_db = vec![
        Student {
            name: String::from("Alice"),
            grade: Some(95),
        },
        Student {
            name: String::from("Bob"),
            grade: Some(87),
        },
        Student {
            name: String::from("Charlie"),
            grade: None,
        },
    ];

    let student_name = String::from("Adam");
    let student_status = check_student_get_grade(&student_name, &student_db);

    match student_status {
        Ok(option_grade) => {
            if let Some(grade) = option_grade {
                println!("Grade is: {grade}");
            }
        }
        Err(error_msg) => println!("{error_msg}"),
    }
    // let student_grade = get_grade(&student_name, &student_db);

    // match student_grade {
    //     Some(grade) => println!("Grade is: {grade}"),
    //     None => {}
    // }

    // if let Some(grade) = student_grade {
    //     println!("Grade is: {grade}");
    // }
}
```