import { ObjectId } from 'mongodb';
import Bookmark from 'src/model/bookmark.model';
import Follow from 'src/model/follow.model';
import Like from 'src/model/like.model';
import Notification from 'src/model/notification.model';
import Reply from 'src/model/reply.model';
import Tweet from 'src/model/tweet.model';
import TwitterCircle from 'src/model/twitterCircle.model';
import User from 'src/model/user.model';

const users = [
    {
        _id: new ObjectId(),
        email: 'a@a.com',
        name: 'Aïcha Haïdara',
        username: 'aicha_ngoma',
        avatar: 'avatar-1.jpg',
        coverImage: 'cover-1.jpg',
        password: '123',
    },
    {
        _id: new ObjectId(),
        email: 'e@e.com',
        name: 'Elisha Ngoma',
        username: 'e_ngoma26',
        avatar: 'avatar-2.jpg',
        coverImage: 'cover-2.jpg',
        password: '123',
    },
    {
        _id: new ObjectId(),
        email: 'c@c.com',
        name: 'Florence',
        username: 'floflo',
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
                name: user.name,
                username: user.username,
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
        const tweets = await Tweet.deleteMany({});
        const bookmark = await Bookmark.deleteMany({});
        const followers = await Follow.deleteMany({});
        const likes = await Like.deleteMany({});
        const notifications = await Notification.deleteMany({});
        const replies = await Reply.deleteMany({});
        const twitterCircle = await TwitterCircle.deleteMany({});

        console.log(tweets);
        console.log(followers);
        console.log(likes);
        console.log(notifications);
        console.log(replies);
        console.log(twitterCircle);
        console.log(bookmark);
    } catch (err) {
        console.error(err);
    }
};
