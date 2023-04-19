import { ObjectId } from 'mongodb';
import Tweet from 'src/model/tweet.model';
import User from 'src/model/user.model';

const users = [
    {
        _id: new ObjectId(),
        email: 'a@a.com',
        avatar: 'avatar-1.jpg',
        coverImage: 'cover-1.jpg',
        password: '123',
    },
    {
        _id: new ObjectId(),
        email: 'b@b.com',
        avatar: 'avatar-2.jpg',
        coverImage: 'cover-2.jpg',
        password: '123',
    },
    {
        _id: new ObjectId(),
        email: 'c@c.com',
        avatar: 'avatar-3.jpg',
        coverImage: 'cover-3.jpg',
        password: '123',
    },
];

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
            const newUser = new User({
                email: user.email,
                avatar: user.avatar,
                coverImage: user.coverImage,
            });
            await User.register(newUser, user.password);
            console.log(`User with ID '${user._id}' created successfully...`);
        }
    } catch (error) {
        console.error(
            'Something went wrong while seeding the "User" collection'
        );
        console.error(error);
    }
};

export const clearDatabase = async () => {
    try {
        const users = await User.deleteMany({});
        const tweets = await Tweet.deleteMany({});
        console.log(users);
        console.log(tweets);
    } catch (err) {
        console.error(err);
    }
};
