import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generateUser = () => {
  const hashedPassword = bcrypt.hashSync('coder123', 10);

  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 70 }),
    password: hashedPassword,
    role: faker.helpers.arrayElement(['user', 'admin']),
    cart: faker.database.mongodbObjectId(),
    phone: faker.phone.number(),
    __v: 0,
  };
};

export const generateProduct = () => ({
  _id: faker.database.mongodbObjectId(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price()),
  category: faker.commerce.department(),
  stock: faker.number.int({ min: 0, max: 100 }),
  code: faker.string.alphanumeric(10).toUpperCase(),
  thumbnails: [faker.image.url()],
});