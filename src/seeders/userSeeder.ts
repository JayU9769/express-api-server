import { faker } from '@faker-js/faker';
import {User} from "@/models/user.model";

export async function seed(count: number) {
  const users = [];
  const status = ['active', 'inactive'];
  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      status: status[Math.floor(Math.random() * status.length)]
    });
  }
  await User.bulkCreate(users);
  console.log(`${count} users have been seeded successfully.`);
}