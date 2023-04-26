import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import styles from './NavigationTweet.module.css';
import Avatar, { Size } from '../ui/Avatar';
import { IMAGE_AVATAR_BASE_URL, TWEET_AUDIENCE, TWEET_REPLY } from '../../constants/common.constants';
import { createTweet } from '../../api/tweet.api';
import { 
    tweetAudienceMenuIcons, 
    tweetAudienceMenuOptions,
    tweetReplyOptions,
    tweetReplyIcons 
} from '../../data/menuOptions';
import { ModalContext } from '../../context/modal.context';
import Modal from '../ui/Modal';
import FormTweet from '../form/FormTweet';
import { TweetAudienceType, TweetReplyType } from '../../types/tweet.types';
import AuthContext from '../../context/user.context';

interface NavigationTweetProp {
    value: string;
    
    selectedFile: File | null
    previewImage: string | null

    handleTextAreaOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleCanselPreviewImage: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAddTweet: (tweet: any) => void;
    clearTweetForm: () => void;
}

const NavigationTweet: FC<NavigationTweetProp> = ({ 
    value,
    selectedFile,
    previewImage,
    
    handleTextAreaOnChange,
    handleCanselPreviewImage,
    handleImageUpload,
    onAddTweet, 
    clearTweetForm,
}) => {

    const [isFormFocused, setIsFormFocused] = useState(false);
    const [tweetAudience, setTweetAudience] = useState<TweetAudienceType>(TWEET_AUDIENCE.everyone);
    const [tweetReply, setTweetReply] = useState<TweetReplyType>(TWEET_REPLY.everyone);
    const [authUser, setAuthUser] = useState<any>(null);

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, []);


    const tweetTextRef = useRef<HTMLTextAreaElement>(null);

    const { closeModal } = useContext(ModalContext);


    const handleSubmitTweet = async (e: React.FormEvent) => {
        console.log('inside handleSubmitTweet');
        e.preventDefault();
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;
        const res = await createTweet(text, selectedFile, tweetAudience, tweetReply);
        const { tweet }: any = res;
        
        
        if (authUser) {
            const newTweet = {
                _id: tweet._id,
                text: tweet.text,
                user: {
                    avatar: authUser?.avatar ? authUser?.avatar : null,
                    name: authUser?.name,
                    username: authUser?.username,
                    isVerified: authUser?.isVerified,
                },
                audience: tweet.audience,
                reply: tweet.reply,
                createdAt: tweet.createdAt,
                image: tweet.image,
                comments: [],
                reposts: [],
                likes: [],
            };
            onAddTweet(newTweet)
        }
        // setIsFormFocused(false);
        closeModal('Nav-tweet');
        setTweetAudience(TWEET_AUDIENCE.everyone)
        setTweetReply(TWEET_REPLY.everyone)
        clearTweetForm();
    };

    const handleTweetAudienceOptions = (options: string) => {
        if (options === TWEET_AUDIENCE.everyone) {
            setTweetAudience(TWEET_AUDIENCE.everyone);
            setTweetReply(TWEET_REPLY.everyone)
        }
        if (options === TWEET_AUDIENCE.twitterCircle) {
            setTweetAudience(TWEET_AUDIENCE.twitterCircle);
            setTweetReply(TWEET_REPLY.onlyTwitterCircle)
        }
    }

    const handleTweetReyplyOptions = (options: string) => {
        if (options === TWEET_REPLY.everyone) {
            console.log(TWEET_REPLY.everyone);
            setTweetReply(TWEET_REPLY.everyone);
        }
        if (options === TWEET_REPLY.peopleYouFollow) {
            console.log(TWEET_REPLY.peopleYouFollow);
            setTweetReply(TWEET_REPLY.peopleYouFollow);
        }
        if (options === TWEET_REPLY.onlyPeopleYouMention) {
            console.log(TWEET_REPLY.onlyPeopleYouMention);
            setTweetReply(TWEET_REPLY.onlyPeopleYouMention);
        }
    }

    return (
        <React.Fragment>
            <Modal
                    modalName={'Nav-tweet'}
                    isOverlay={true}
                    classNameContainer={styles.modalContainer}
                    classNameWrapper={styles.modalWrapper}
                >
                <div className={styles.formSection}>
                    <Avatar
                        path={
                            authUser?.avatar ?
                            `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}` : null
                        }
                        size={Size.small}
                        className={''}
                    />
                    <FormTweet
                        value={value}
                        tweetTextRef={tweetTextRef}
                        imagePreview={previewImage}
                        isFocused={true}
                        tweetAudienceOptions={tweetAudienceMenuOptions}
                        tweetAudienceIcons={tweetAudienceMenuIcons}
                        tweetReplyOptions={tweetReplyOptions}
                        tweetReplyIcons={tweetReplyIcons}
                        tweetReplyValue={tweetReply}
                        setIsFocused={setIsFormFocused}
                        onSubmit={handleSubmitTweet}
                        onImageUpload={handleImageUpload}
                        onCancelImagePreview={handleCanselPreviewImage}
                        onChageImage={handleTextAreaOnChange}
                        tweetAudienceValue={tweetAudience}
                        onClickAudienceMenu={handleTweetAudienceOptions}
                        onClickReplyMenu={handleTweetReyplyOptions}
                        classNameTextErea={styles.classNameTextErea}
                        
                    />
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default NavigationTweet;
