import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import User from 'src/model/user.model';

dotenv.config();

const users = [
    {
        _id: new ObjectId(),
        email: 'a@a.com',
        password: '123',
    },
    {
        _id: new ObjectId(),
        email: 'b@b.com',
        password: '123',
    },
    {
        _id: new ObjectId(),
        email: 'c@c.com',
        password: '123',
    },
];

const followers = [
    {
        user: users[0]._id,
        followers: [users[1]._id, users[2]._id],
    },
    {
        user: users[1]._id,
        followers: [users[0]._id, users[2]._id],
    },
];

const following = [
    {
        user: users[0]._id,
        following: [users[1]._id, users[2]._id],
    },
    {
        user: users[1]._id,
        following: [users[0]._id, users[2]._id],
    },
];

export const clearDatabase = async () => {
    try {
        const result = await User.deleteMany({});
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};

export const seedUsers = async () => {
    try {
        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
                console.log(
                    `User with email '${user.email}' already exists, skipping...`
                );
                continue;
            }
            const newUser = new User({ email: user.email });
            await User.register(newUser, user.password);
            console.log(
                `User with email '${user.email}' created successfully...`
            );
        }
    } catch (error) {
        console.error('Something went wrong while seeding the database');
        console.error(error);
    }
};
