import {number, select} from "@inquirer/prompts";

async function seed() {
  try {

    const entity = await select({
      message: 'What would you like to seed?',
      choices: [
        {
          name: 'Users',
          value: 'users',
          description: 'Create Dummy users',
        },
        {
          name: 'Admins',
          value: 'admins',
          description: 'Create Dummy Admins',
        },
      ],
    })

    const countNumber = await number({
      message: "How many records would you like to create?",
    });

    // Dynamically import the correct seeder module
    const seederMap: { [key: string]: string } = {
      users: './userSeeder',
      admins: './adminSeeder',
    };

    const seederModule = seederMap[entity];
    if (seederModule) {
      const { seed } = await import(seederModule);
      await seed(countNumber);
    } else {
      console.error('Unknown entity selected.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

seed();
