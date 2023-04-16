import { clearDatabase, seedUsers } from '../tools/testData.tools';
import { dbClose, dbConn } from './db.config';

const runSeeds = async (isClean: boolean, testData?: string) => {
    try {
        if (isClean) {
            console.log('Cleaning the database...');
            await clearDatabase();
            console.log('Database cleaned successfully.');
        }

        if (testData === 'users') {
            console.log('Seeding users data...');
            await seedUsers();
            console.log('Users data seeded successfully.');
        }
    } catch (error) {
        console.error('Error while seeding the database!');
        console.log(error);
    }
};

const seed = async () => {
    dbConn();
    const argv = process.argv.slice(2);
    const isClean = argv.includes('clean');
    const testData = argv.includes('users') ? 'users' : undefined;

    await runSeeds(isClean, testData);

    dbClose();
};

seed();
