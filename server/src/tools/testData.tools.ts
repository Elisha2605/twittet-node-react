import { ObjectId } from 'mongodb';
import Bookmark from '../../src/models/bookmark.model';
import Follow from '../../src/models/follow.model';
import Like from '../../src/models/like.model';
import Notification from '../../src/models/notification.model';
import Tweet from '../../src/models/tweet.model';
import TwitterCircle from '../../src/models/twitterCircle.model';
import User from '../../src/models/user.model';
import fs from 'fs';
import EmailTemplate from '../../src/models/emailTemplate.model';
import Message from 'src/models/message.model';
import Contact from 'src/models/contact.model';
import PasswordReset from 'src/models/passwordReset.model';

const users = [
    {
        _id: new ObjectId(),
        email: 'a@a.com',
        name: 'Aïcha Haïdara',
        username: 'aicha_ngoma',
        password: '123',
        avatar: 'test1-f.jpg',
        coverImage: 'c1.jpg',
        isVerified: true,
        isProtected: false,
        bio: `🎤 Singer/Songwriter. Channeling my emotions into 
            lyrics and melodies that resonate with your soul. 
            Let's embark on a musical journey together. 🎶`,
        location: 'Helsinki, Finland 🇫🇮',
        website: 'https://www.daracoaching.com',
    },
    {
        _id: new ObjectId(),
        email: 'b@b.com',
        name: 'Bella Johansen',
        username: 'bella_j',
        password: '123',
        avatar: 'test2-f.jpg',
        coverImage: 'c2.jpg',
        isVerified: false,
        isProtected: false,
        bio: `Social Advisor | Empowering individuals and 
            organizations to maximize their online presence. 
            Strategizing impactful digital campaigns for a connected world.`,
        location: 'Aalborg',
        website: null,
    },
    {
        _id: new ObjectId(),
        email: 'c@c.com',
        name: 'Carole leclerc',
        username: 'coroleclerc493',
        password: '123',
        avatar: 'test3-f.jpg',
        coverImage: 'c3.jpg',
        isVerified: true,
        isProtected: false,
        bio: `Fashion is my passion, and I'm ready to create stunning visuals together. 💃✨`,
        location: 'Paris, France',
        website: 'https://carole.com',
    },

    {
        _id: new ObjectId(),
        email: 'd@d.com',
        name: 'Daniel Crogh',
        username: 'dany889',
        password: '123',
        avatar: 'test1-m.jpg',
        coverImage: 'c4.jpg',
        isVerified: false,
        isProtected: true,
        bio: `Architect | Designing spaces that blend functionality and beauty, shaping the world around us.`,
        location: 'Poland',
        website: 'https://www.danielcrogh.com',
    },
    {
        _id: new ObjectId(),
        email: 'e@e.com',
        name: 'Ezekiel Morgan',
        username: 'ezekMor',
        password: '123',
        avatar: 'test2-m.jpg',
        coverImage: 'c5.jpg',
        isVerified: false,
        isProtected: false,
        bio: `Embracing the thrill of the unknown, 
            seeking breathtaking landscapes and 
            unforgettable experiences.`,
        location: 'Poland',
        website: null,
    },
    {
        _id: new ObjectId(),
        email: 'f@f.com',
        name: 'Frank Dupon',
        username: 'frankdupon',
        password: '123',
        avatar: 'test3-m.jpg',
        coverImage: 'c6.jpg',
        isVerified: false,
        isProtected: false,
        bio: `✍️ Écrivain Français | Plongeant dans les dédales 
            de la langue française, explorant les recoins de 
            l'imaginaire pour tisser des histoires captivantes.`,
        location: 'Lion',
        website: 'https://frank-lecrivain.com',
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
                isVerified: user.isVerified,
                isProtected: user.isProtected,
                bio: user.bio,
                location: user.location,
                website: null,
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

export const seedEmailTemplates = async () => {
    const templates = [
        {
            name: 'resetpassword',
            html: fs
                .readFileSync('./server/src/emails/resetpassword.html')
                .toString(),
            sender: 'Fake Twitter',
            subject: 'Reset your password for ',
        },
    ];
    await EmailTemplate.insertMany(templates);
};

export const clearDatabase = async () => {
    try {
        const tweets = await Tweet.deleteMany({});
        const bookmark = await Bookmark.deleteMany({});
        const followers = await Follow.deleteMany({});
        const likes = await Like.deleteMany({});
        const notifications = await Notification.deleteMany({});
        const twitterCircles = await TwitterCircle.deleteMany({});
        const users = await User.deleteMany({});
        const messages = await Message.deleteMany({});
        const contacts = await Contact.deleteMany({});
        const passwordResets = await PasswordReset.deleteMany({});

        console.log('tweets deleted successfuly :', tweets);
        console.log('followers deleted successfuly :', followers);
        console.log('likes deleted successfuly :', likes);
        console.log('notifications deleted successfuly :', notifications);
        console.log('twitterCircles deleted successfuly :', twitterCircles);
        console.log('bookmark deleted successfuly :', bookmark);
        console.log('users deleted successfuly :', users);
        console.log('users deleted successfuly :', messages);
        console.log('contacts deleted successfuly :', contacts);
        console.log('passwordResets deleted successfuly :', passwordResets);
    } catch (err) {
        console.error(err);
    }
};
