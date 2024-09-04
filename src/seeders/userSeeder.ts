import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export async function seed(count: number) {
  const prisma = new PrismaClient();
  const users = [];
  const status = ['active', 'inactive'];

  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      status: status[Math.floor(Math.random() * status.length)],
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log(`${count} users have been seeded successfully.`);
  await prisma.$disconnect(); // Close the Prisma client connection
}
