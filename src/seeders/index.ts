import sequelize from "@/models";
import {number, select} from "@inquirer/prompts";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync the models with the database
    await sequelize.sync();

    const entity = await select({
      message: 'What would you like to seed?',
      choices: [
        {
          name: 'Users',
          value: 'users',
          description: 'Create Dummy users',
        },
      ],
    })

    const countNumber = await number({
      message: "How many records would you like to create?",
    });

    // Dynamically import the correct seeder module
    const seederMap: { [key: string]: string } = {
      users: './userSeeder',
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
  } finally {
    await sequelize.close();
  }
}

seed();
