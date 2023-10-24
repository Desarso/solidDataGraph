export class Helper {
  static generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }
  static generateCarPrice(): number {
    return Math.floor(Math.random() * 100000);
  }
  static generateCarYear(): number {
    return Math.floor(Math.random() * 20) + 2000;
  }
  static generateCarColor(): string {
    const colors = ["red", "blue", "green", "black", "white"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  static generateCarModel(): string {
    const models = ["BMW", "Mercedes", "Audi", "Toyota", "Honda"];
    return models[Math.floor(Math.random() * models.length)];
  }
  static generateAge(): number {
    return Math.floor(Math.random() * 100);
  }
  static generateJob(): string {
    const jobs = ["Programmer", "Teacher", "Doctor", "Lawyer", "Engineer"];
    return jobs[Math.floor(Math.random() * jobs.length)];
  }
  static generateName(): string {
    const names = ["John", "Jane", "Jack", "Jill", "James"];
    return names[Math.floor(Math.random() * names.length)];
  }
  static generateUser(): User {
    return new User(
      Helper.generateId(),
      Helper.generateName(),
      Helper.generateAge(),
      Helper.generateJob(),
      Helper.generateCarModel(),
      Helper.generateCarYear(),
      Helper.generateCarColor(),
      Helper.generateCarPrice()
    );
  }

  //generate 100 users and return them as json
  static generateUsers(amount: number): string {
    let users = [];
    for (let i = 0; i < amount; i++) {
      users.push(Helper.generateUser());
    }
    return JSON.stringify(users);
  }
}

class User {
  id: number;
  name: string;
  age: number;
  job: string;
  carModel: string;
  carYear: number;
  carColor: string;
  carPrice: number;
  constructor(
    id: number,
    name: string,
    age: number,
    job: string,
    carModel: string,
    carYear: number,
    carColor: string,
    carPrice: number
  ) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.job = job;
    this.carModel = carModel;
    this.carYear = carYear;
    this.carColor = carColor;
    this.carPrice = carPrice;
  }
}
