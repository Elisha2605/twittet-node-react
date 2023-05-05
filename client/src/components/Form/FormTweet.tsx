import React, { FC, useContext, useEffect } from 'react';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import { 
    tweetAudienceMenuOptions, 
    tweetAudienceMenuIcons,
    tweetReplyOptions,
    tweetReplyIcons 
    
} from '../../data/menuOptions';
import styles from './FormTweet.module.css';
import EmojiIcon from '../icons/EmojiIcon';
import ImageIcon from '../icons/ImageIcon';
import CalendarIcon from '../icons/CalendarIcon';
import XmarkIcon from '../icons/XmarkIcon';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faChevronDown, faEarthAfrica, faLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import PopUpMenu from '../ui/PopUpMenu';
import { TWEET_AUDIENCE, TWEET_REPLY } from '../../constants/common.constants';
import { ModalContext } from '../../context/modal.context';

interface FormProps {
    value: string;
    tweetTextRef: React.RefObject<HTMLTextAreaElement>;
    imagePreview?: string | null;
    imagePreviewModal?: string | null;
    isFocused?: boolean;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;

    tweetAudienceValue: string,
    tweetReplyValue: string,

    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChageImage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCancelImagePreview: () => void;
    onClickAudienceMenu: Function;
    onClickReplyMenu: Function;

    classNameTextErea?: string;    
}

const FormTweet: FC<FormProps> = ({
    value,
    tweetTextRef,
    imagePreview,
    isFocused = false,
    setIsFocused,

    tweetAudienceValue,
    tweetReplyValue,

    onSubmit,
    onImageUpload,
    onChageImage,
    onCancelImagePreview,
    onClickAudienceMenu,
    onClickReplyMenu,

    classNameTextErea
}) => {
    
    // Adjust text erea with input value
    useAutosizeTextArea(tweetTextRef.current, value)

    // ubmit with by pressing "command + enter"
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.metaKey) {
            onSubmit(e);
        }
    }


    const isImageSelected = !!imagePreview;

    return (
        <React.Fragment>
            <form className={styles.container} onSubmit={onSubmit} onKeyDown={handleKeyDown} onClick={() => setIsFocused(true)}>
                {isFocused || isImageSelected ? (
                    <div className={`${styles.everyone} ${tweetAudienceValue === TWEET_AUDIENCE.twitterCircle ? styles.twitterCirlce : ''}`}>
                        <PopUpMenu 
                            title={'Choose audience'}
                            options={tweetAudienceMenuOptions}
                            icons={tweetAudienceMenuIcons}
                            isMenuIcon={false}
                            isDisable={false}
                            onClick={(tweetPrivacyOptions) => {
                                onClickAudienceMenu!(tweetPrivacyOptions)
                            }} 
                            className={styles.tweetPrivacyOptions}
                            classNameWithTitle={styles.privacyPopUpBox}
                        >
                            {tweetAudienceValue === TWEET_AUDIENCE.everyone ? (
                                <>
                                    <span>Everyone</span><span><FontAwesomeIcon icon={faChevronDown}/></span>
                                </>
                            ): (
                                <>
                                    <span>Twitter Circle</span><span><FontAwesomeIcon icon={faChevronDown}/></span>
                                </>
                            )}
                        </PopUpMenu>
                    </div>
                ) : null }
                <textarea
                    className={`${styles.textarea} ${classNameTextErea}`}
                    id="review-text"
                    onChange={onChageImage}
                    placeholder="What's happening?"
                    ref={tweetTextRef}
                    rows={1}
                    value={value}
                />
                {isFocused || isImageSelected ? (
                    <PopUpMenu 
                            title={'Who can reply?'}
                            options={tweetReplyOptions}
                            icons={tweetReplyIcons}
                            isMenuIcon={false}
                            isDisable={tweetReplyValue === TWEET_REPLY.onlyTwitterCircle}
                            onClick={(option) => {
                                onClickReplyMenu!(option)
                            }} 
                            className={styles.tweetReplyOptions}
                            classNameWithTitle={styles.tweetReplyPopUpBox}
                        >
                        {/* {tweetReply} */}

                        <div className={`${styles.replyPrivacyOptions} ${tweetReplyValue === TWEET_REPLY.onlyTwitterCircle ? styles.onlyTweetCircle : ''}`}>
                            {tweetReplyValue === TWEET_REPLY.everyone ? (
                                <>
                                    <span><FontAwesomeIcon icon={faEarthAfrica}/></span><span>Everyone can reply</span>
                                </>
                            ) : (tweetReplyValue === TWEET_REPLY.peopleYouFollow) ? (
                                <>
                                    <span><FontAwesomeIcon icon={faUserCheck}/></span><span>People you follow</span>
                                </>
                            ) : (tweetReplyValue === TWEET_REPLY.onlyPeopleYouMention) ? (
                                <>
                                    <span><FontAwesomeIcon icon={faAt}/></span><span>Only people you mention</span>
                                </>
                            ) : (tweetReplyValue === TWEET_REPLY.onlyTwitterCircle) && (
                                <>
                                    <span><FontAwesomeIcon icon={faLock}/></span><span>Only your Twitter Circle who follows you can reply</span>
                                </> 
                            )}
                          
                        </div>
                        <hr className={styles.horizontalLine} />
                    </PopUpMenu>
                ) : null }
                {imagePreview && (
                    <div className={styles.previewImage}>
                        <XmarkIcon className={styles.cancelBtn} size={'lg'}
                            onClick={onCancelImagePreview}/>
                        <img id={imagePreview} src={imagePreview} alt='preview tweet img' />
                    </div>
                )}
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
            </form>
        </React.Fragment>
    );
};

export default FormTweet;
