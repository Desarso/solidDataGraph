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
    const colors = [
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Orange",
      "Purple",
      "Pink",
      "Brown",
      "Gray",
      "Black",
      "White",
      "Cyan",
      "Magenta",
      "Lavender",
      "Turquoise",
      "Indigo",
      "Violet",
      "Teal",
      "Maroon",
      "Gold",
      "Silver",
      "Bronze",
      "Crimson",
      "Olive",
      "Navy",
      "Beige",
      "Slate",
      "Plum",
      "Charcoal",
      "Lime",
      "Ruby",
      "Ivory",
      "Coral",
      "Azure",
      "Aqua",
      "Fuchsia",
      "Saffron",
      "Lilac",
      "Mint",
      "Mustard",
      "Periwinkle",
      "Mauve",
      "Peach",
      "Tangerine",
      "Salmon",
      "Champagne",
      "Sky Blue",
      "Moss Green",
      "Amber",
      "Ebony",
      "Amethyst",
      "Magenta",
      "Ochre",
      "Lemon",
      "Cerulean",
      "Siena",
      "Sepia",
      "Turquoise",
      "Viridian",
      "Cream",
      "Wheat",
      "Tan",
      "Burgundy",
      "Denim",
      "Cobalt",
      "Khaki",
      "Lavender",
      "Cyan",
      "Olive Drab",
      "Terra Cotta",
      "Fandango",
      "Orchid",
      "Harlequin",
      "Sapphire",
      "Aquamarine",
      "Russet",
      "Cordovan",
      "Beaver",
      "Rust",
      "Topaz",
      "Pewter",
      "Ebony",
      "Lavender Blush",
      "Tea Green",
      "Brick Red",
      "Amaranth",
      "Mikado Yellow",
      "Eton Blue",
      "Lavender Gray",
      "Pale Brown",
      "Dark Blue",
      "Sea Green",
      "Vivid Violet",
      "Electric Blue",
      "Flame",
      "Spring Green",
      "Sapphire",
      "Cadmium Orange",
      "Raspberry",
      "Goldenrod",
      "Baby Blue",
      "Silver",
      "Baby Pink",
      "Deep Pink",
      "Salmon Pink",
      "Olive Green",
      "Fandango",
      "Yellow Orange",
      "Gainsboro",
      "Vermilion",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  static generateCarModel(): string {
    const models = [
      "BMW",
      "Mercedes",
      "Audi",
      "Toyota",
      "Honda",
      "Ford",
      "Chevrolet",
      "Volkswagen",
      "Nissan",
      "Hyundai",
      "Kia",
      "Mazda",
      "Subaru",
      "Jeep",
      "Lexus",
      "Porsche",
      "Ferrari",
      "Tesla",
      "Volvo",
      "Acura",
      "Jaguar",
      "Land Rover",
      "Infiniti",
      "Mitsubishi",
      "Chrysler",
      "Dodge",
      "Ram",
      "Buick",
      "GMC",
      "Cadillac",
      "Mini",
      "Lincoln",
      "Aston Martin",
      "Bentley",
      "Rolls-Royce",
      "Maserati",
      "Fiat",
      "Alfa Romeo",
      "Genesis",
      "Suzuki",
      "Isuzu",
      "Scion",
      "Smart",
      "Saab",
      "Maybach",
      "McLaren",
      "Bugatti",
      "Koenigsegg",
      "Pagani",
      "Lamborghini",
      "Fisker",
      "Lotus",
      "Spyker",
      "Aston Martin",
      "Ferrari",
      "Alpine",
      "Dacia",
      "Skoda",
      "Citroën",
      "Peugeot",
      "Renault",
      "Opel",
      "Vauxhall",
      "Fiat",
      "Lancia",
      "Maserati",
      "Bugatti",
      "Alpine",
      "Lexus",
      "Scion",
      "Infiniti",
      "Acura",
      "Saturn",
      "Pontiac",
      "HUMMER",
      "Oldsmobile",
      "Mercury",
      "Eagle",
      "Plymouth",
      "Suzuki",
      "Aston Martin",
      "Mitsubishi",
      "Daihatsu",
      "Abarth",
      "Lada",
      "Moskvitch",
      "Trabant",
      "Wartburg",
      "Zaporozhets",
      "Tatra",
      "Daimler",
      "Rover",
      "Austin",
      "MG",
      "Morris",
      "Triumph",
      "Jensen",
      "Sunbeam",
      "Alvis",
      "Healey",
      "Dodge",
      "Chrysler",
      "Buick",
      "Pontiac",
      "Saturn",
      "GMC",
      "Mazda",
      "Mercury",
      "SsangYong",
      "Geely",
    ];
    return models[Math.floor(Math.random() * models.length)];
  }
  static generateAge(): number {
    //age between 18 and 100
    return Math.floor(Math.random() * 82) + 18;
  }
  static generateJob(): string {
    const jobs = [
      "Programmer",
      "Teacher",
      "Doctor",
      "Lawyer",
      "Engineer",
      "Nurse",
      "Graphic Designer",
      "Chef",
      "Scientist",
      "Electrician",
      "Dentist",
      "Accountant",
      "Architect",
      "Writer",
      "Police Officer",
      "Marketing Manager",
      "Pharmacist",
      "Mechanic",
      "Artist",
      "Psychologist",
    ];
    return jobs[Math.floor(Math.random() * jobs.length)];
  }
  static generateName(): string {
    const names = [
      "John",
      "Jane",
      "Jack",
      "Jill",
      "James",
      "Mary",
      "Robert",
      "Linda",
      "William",
      "Karen",
      "Michael",
      "Sarah",
      "David",
      "Emily",
      "Richard",
      "Susan",
      "Joseph",
      "Nancy",
      "Jennifer",
      "Daniel",
      "Thomas",
      "Patricia",
      "Christopher",
      "Elizabeth",
      "Matthew",
      "Lisa",
      "Kenneth",
      "Betty",
      "Steven",
      "Dorothy",
      "Brian",
      "Sandra",
      "George",
      "Jessica",
      "Edward",
      "Helen",
      "Paul",
      "Carol",
      "Mark",
      "Michelle",
      "Andrew",
      "Emily",
      "Charles",
      "Laura",
      "Joshua",
      "Amanda",
      "Kevin",
      "Melissa",
      "Donald",
      "Rebecca",
      "Ronald",
      "Cynthia",
      "Jason",
      "Kathleen",
      "Jeffrey",
      "Shirley",
      "Frank",
      "Deborah",
      "Scott",
      "Angela",
      "Eric",
      "Holly",
      "Stephen",
      "Maria",
      "Raymond",
      "Kimberly",
      "Gregory",
      "Stephanie",
      "Dennis",
      "Donna",
      "Timothy",
      "Lori",
      "Larry",
      "Amy",
      "Jose",
      "Teresa",
      "Jerry",
      "Pamela",
      "Ryan",
      "Catherine",
      "Nicholas",
      "Christine",
      "Ethan",
      "Martha",
      "Gary",
      "Heather",
      "Randy",
      "Diane",
      "Henry",
      "Virginia",
      "Franklin",
      "Janet",
      "Phillip",
      "Carolyn",
      "Patrick",
      "Christina",
      "Peter",
      "Rachel",
      "Paula",
      "Bobby",
      "Laura",
      "Ronnie",
      "Megan",
      "Roger",
      "Brenda",
      "Billy",
      "Natalie",
      "Larry",
      "Jacqueline",
      "Dennis",
      "Grace",
      "Samuel",
      "Diana",
      "Keith",
      "Victoria",
      "Billy",
      "Sharon",
    ];
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
  static generateUsers(amount: number): User[] {
    let users = [];
    for (let i = 0; i < amount; i++) {
      users.push(Helper.generateUser());
    }
    return users;
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
