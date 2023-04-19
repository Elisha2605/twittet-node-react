import { ObjectId } from 'mongodb';
import { TWEET_PRIVACY } from 'src/constants/tweet.constants';
import Tweet from 'src/model/tweet.model';
import User from 'src/model/user.model';

const userIds = {
    user_1: new ObjectId('617453d8f87e9d5e5c5d5dc4'),
    user_2: new ObjectId('617453d8f87e9d5e5c5d5dc5'),
    user_3: new ObjectId('617453d8f87e9d5e5c5d5dc6'),
}

const users = [
    {
        _id: userIds.user_1,
        email: 'a@a.com',
        password: '123',
    },
    {
        _id: userIds.user_2,
        email: 'b@b.com',
        password: '123',
    },
    {
        _id: userIds.user_3,
        email: 'c@c.com',
        password: '123',
    },
];

const tweets = [
    {
        _id: new ObjectId(),
        user: userIds.user_1,
        image: 'test_1',
        text: 'Just tried a new sushi place and it was amazing!',
        privacy: TWEET_PRIVACY.everyone,
    },
    {
        _id: new ObjectId(),
        user: userIds.user_1,
        image: 'test_2',
        text: "Can't believe it's already April! Time flies when you're having fun",
        privacy: TWEET_PRIVACY.twitterCircle,
    },
    {
        _id: new ObjectId(),
        user: userIds.user_2,
        image: 'test_3',
        text: 'Just finished my morning run and feeling energized for the day!',
        privacy: TWEET_PRIVACY.everyone,
    },
    {
        _id: new ObjectId(),
        user: userIds.user_2,
        image: 'test_4',
        text: 'Just finished my morning run and feeling energized for the day!',
        privacy: TWEET_PRIVACY.everyone,
    },
    {
        _id: new ObjectId(),
        user: userIds.user_3,
        image: 'test_5',
        text: "Excited to announce that I'll be speaking at the upcoming conference on AI and machine learning!",
        privacy: TWEET_PRIVACY.everyone,
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

export const seedUsers = async () => {
    try {
        //Seed Tweets
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
            console.log(`User with ID '${user._id}' created successfully...`);
        }
    } catch (error) {
        console.error(
            'Something went wrong while seeding the "User" collection'
        );
        console.error(error);
    }
};

export const seedTweets = async () => {
    try {
        //Seed Tweets
        for (const tweet of tweets) {
            const existingUser = await User.findOne({ user: tweet.user });
            if (existingUser) {
                console.log(
                    `User with ID '${tweet.user}' already exists, skipping adding tweets...`
                );
                continue;
            }
            const newTweet = new Tweet(tweet);
            await newTweet.save();
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
