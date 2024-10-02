import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seed(count: number) {
  const prisma = new PrismaClient();
  const users = [];
  const status = [0, 1];

  // Generate a salt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('12345678', salt);

  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phoneNo: faker.phone.number(),
      password: hashedPassword,
      status: status[Math.floor(Math.random() * status.length)],
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log(`${count} users have been seeded successfully.`);
  await prisma.$disconnect(); // Close the Prisma client connection
}
