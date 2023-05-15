import React, { FC, useContext, useEffect, useState } from 'react';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import styles from './FormReplyTweet.module.css';
import EmojiIcon from '../icons/EmojiIcon';
import ImageIcon from '../icons/ImageIcon';
import CalendarIcon from '../icons/CalendarIcon';
import XmarkIcon from '../icons/XmarkIcon';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { getAuthUserFollows } from '../../api/follow.api';
import { TWEET_REPLY } from '../../constants/common.constants';
import AuthContext from '../../context/user.context';

interface FormReplyTweetProps {
    tweet?: any;
    value: string;
    tweetTextRef: React.RefObject<HTMLTextAreaElement>;
    imagePreview?: string | null;
    imagePreviewModal?: string | null;
    isFocused?: boolean;
    authUserId?: any;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;

    tweetAudienceValue?: string,
    tweetReplyValue?: string,

    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChageImage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCancelImagePreview: () => void;
    onClickAudienceMenu?: Function;
    onClickReplyMenu?: Function;

    classNameTextErea?: string;   
}

const FormReplyTweet: FC<FormReplyTweetProps> = ({
    tweet,
    value,
    tweetTextRef,
    imagePreview,
    isFocused = false,
    authUserId,
    setIsFocused,

    onSubmit,
    onImageUpload,
    onChageImage,
    onCancelImagePreview,

    classNameTextErea,
}) => {

    // Adjust text erea with input value
    useAutosizeTextArea(tweetTextRef.current, value)

    // ubmit with by pressing "command + enter"
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.metaKey) {
            onSubmit(e);
        }
    }


    const [followers, setFollowers] = useState<any>([]);
    const [followings, setFollowings] = useState<any>([]);

    // get Auth user
    const ctx = useContext(AuthContext);


    useEffect(() => {
        const fetchAuthUserFollowStatus = async () => {
            const { followers, followings } = await getAuthUserFollows();
            setFollowers(followers);
            setFollowings(followings);
        };
        fetchAuthUserFollowStatus();
    }, []);

    const isOnlyPeopleYouFollow = (userId: string): boolean => {
        if (
            tweet?.user?._id !== authUserId &&
            tweet?.reply === TWEET_REPLY.peopleYouFollow &&
            !followers.some((following: any) => following?.user?._id === userId)
        ) {
            return false;
        }
        return true;
    };

    return (
        <React.Fragment>
            {isOnlyPeopleYouFollow(tweet?.user?._id) && (
                <form className={styles.container} onSubmit={onSubmit} onKeyDown={handleKeyDown} onClick={() => setIsFocused(true)}>
                    <div className={styles.textAreaWrapper}>
                        <textarea
                            className={`${styles.textarea} ${classNameTextErea}`}
                            id="review-text"
                            onChange={onChageImage}
                            placeholder="Tweet your reply"
                            ref={tweetTextRef}
                            rows={1}
                            value={value}
                        />
                        {!isFocused && (
                            <Button
                                value={'Tweet'}
                                type={ButtonType.primary}
                                size={ButtonSize.small}
                                isDisabled={value.length > 0 || imagePreview ? false : true}
                                onClick={() => setIsFocused(false)}
                            />
                        )}
                    </div>
                    {imagePreview && (
                        <div className={styles.previewImage}>
                            <XmarkIcon className={styles.cancelBtn} size={'lg'}
                                onClick={onCancelImagePreview}/>
                            <img id={imagePreview} src={imagePreview} alt='preview tweet img' />
                        </div>
                    )}
                    {isFocused ? (
                        <div className={styles.footer}>
                            <div className={styles.icons}>
                                <ImageIcon onChange={onImageUpload} />
                                <EmojiIcon />
                                <CalendarIcon />
                            </div>
                            <Button
                                value={'Tweet'}
                                type={ButtonType.primary}
                                size={ButtonSize.small}
                                isDisabled={value.length > 0 || imagePreview ? false : true}
                                onClick={() => setIsFocused(false)}
                            />
                        </div>
                    ): null}
                </form>
            )}
        </React.Fragment>
    );
};

export default FormReplyTweet;
