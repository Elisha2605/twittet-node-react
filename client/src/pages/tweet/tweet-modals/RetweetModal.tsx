import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import styles from './RetweetModal.module.css';
import Avatar, { Size } from '../../../components/ui/Avatar';
import { IMAGE_AVATAR_BASE_URL, MAX_TWEET_CHARACTERS, TWEET_AUDIENCE, TWEET_REPLY } from '../../../constants/common.constants';
import { ModalContext } from '../../../context/modal.context';
import Modal from '../../../components/ui/Modal';
import AuthContext from '../../../context/user.context';
import { TweetAudienceType, TweetReplyType } from '../../../types/tweet.types';
import { retweet } from '../../../api/tweet.api';
import FormRetweet from '../../../components/form/FormRetweet';
import { useMessage } from '../../../context/successMessage.context';

interface RetweetModalProps {
    originalTweet: any,
    value: string;
    selectedFile: File | null
    previewImage: string | null

    handleTextAreaOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleCanselPreviewImage: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;

    clearTweetForm: () => void;

    onAddTweet: any, 
}

const RetweetModal: FC<RetweetModalProps> = ({ 
    originalTweet,
    value,
    selectedFile,
    previewImage,
    
    handleTextAreaOnChange,
    handleCanselPreviewImage,
    handleImageUpload,
    
    clearTweetForm,
    
    onAddTweet, 
}) => {

    const [isFormFocused, setIsFormFocused] = useState(false);
    const [tweetAudience, setTweetAudience] = useState<TweetAudienceType>(TWEET_AUDIENCE.everyone);
    const [tweetReply, setTweetReply] = useState<TweetReplyType>(TWEET_REPLY.everyone);
    const [authUser, setAuthUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { showMessage } = useMessage();

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

    const handleSubmitRetweet = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;
        
        if (text?.length! > MAX_TWEET_CHARACTERS) {
            showMessage('Could not send your tweet', 'error');
            return;
        }
        setIsLoading(true);
        const res = await retweet(originalTweet?._id, text, selectedFile, tweetAudience, tweetReply);
        const { tweet }: any = res;
        setIsLoading(false);

        if (authUser) {
            const newTweet = {
                ...tweet
            };
            onAddTweet(newTweet)
        }
        if (res.success) {
            showMessage('Your tweet was sent', 'success');
        }
        setIsFormFocused(false);
        closeModal('retweet-modal');
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
                    modalName={'retweet-modal'}
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
                    <FormRetweet
                        tweet={originalTweet}
                        value={value ? value : ''}
                        tweetTextRef={tweetTextRef}
                        selectedFile={selectedFile}
                        imagePreview={previewImage}
                        isFocused={isFormFocused}
                        tweetReplyValue={tweetReply}
                        setIsFocused={setIsFormFocused}
                        onSubmit={handleSubmitRetweet}
                        onImageUpload={handleImageUpload}
                        onCancelImagePreview={handleCanselPreviewImage}
                        onChageImage={handleTextAreaOnChange}
                        tweetAudienceValue={tweetAudience}
                        onClickAudienceMenu={handleTweetAudienceOptions}
                        onClickReplyMenu={handleTweetReyplyOptions}
                        classNameTextErea={styles.classNameTextErea}
                        isLoading={isLoading}
                    />
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default RetweetModal;
