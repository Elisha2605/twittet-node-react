import React, { FC, useEffect, useRef, useState } from 'react';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import {
    tweetAudienceMenuOptions,
    tweetAudienceMenuIcons,
    tweetReplyOptions,
    tweetReplyIcons,
} from '../../data/menuOptions';
import styles from './FormTweet.module.css';
import EmojiIcon from '../icons/EmojiIcon';
import ImageIcon from '../icons/ImageIcon';
import CalendarIcon from '../icons/CalendarIcon';
import XmarkIcon from '../icons/XmarkIcon';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAt,
    faChevronDown,
    faEarthAfrica,
    faLock,
    faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import PopUpMenu from '../ui/PopUpMenu';
import {
    IMAGE_AVATAR_BASE_URL,
    MAX_TWEET_CHARACTERS,
    TWEET_AUDIENCE,
    TWEET_REPLY,
} from '../../constants/common.constants';
import { searchUsers } from '../../api/user.api';
import UserInfo from '../ui/UserInfo';
import useClickOutSide from '../../hooks/useClickOutSide';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface FormProps {
    value: string;
    tweetTextRef: React.RefObject<HTMLTextAreaElement>;
    imagePreview?: string | null;
    imagePreviewModal?: string | null;
    isFocused?: boolean;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;

    tweetAudienceValue?: string;
    tweetReplyValue?: string;

    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChageTextArea: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCancelImagePreview: () => void;
    onClickAudienceMenu?: Function;
    onClickReplyMenu?: Function;

    classNameTextErea?: string;
    isReplay?: boolean;
    isLoading?: boolean;
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
    onChageTextArea,
    onCancelImagePreview,
    onClickAudienceMenu,
    onClickReplyMenu,

    classNameTextErea,
    isReplay,
    isLoading,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedEmoji, setSelectedEmoji] = useState<any>();
    const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
    const [textEreaInputError, setTextEreaInputError] = useState<string | null>(null);
    const [counter, setCounter] = useState<number>(0);

    const searchResultsRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // close searech result on click outside
    useClickOutSide(searchResultsRef, setShowSuggestions);
    useClickOutSide(emojiPickerRef, setOpenEmojiPicker);

    // Adjust text erea with input value
    useAutosizeTextArea(tweetTextRef.current, value);

    // ubmit with by pressing "command + enter"
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.metaKey) {
            onSubmit(e);
        }
    };

    const handleInputChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setCounter(value.length)
        if (value.length > MAX_TWEET_CHARACTERS) {
            setTextEreaInputError('Text too long!')
        } else {
            setTextEreaInputError(null)
        }
        const lastChar = value.charAt(value.length - 1);
        if (lastChar === '@') {
            setShowSuggestions(true);
        } else if (lastChar === ' ') {
            setShowSuggestions(false);
        }
        setInputValue(value);

        const atIndex = value.lastIndexOf('@');
        const searchTerm = value.substring(atIndex + 1);
        const { users } = await searchUsers(encodeURIComponent(searchTerm));
        setSearchResults(users);
    };

    const handleUserClick = (username: string) => {
        setShowSuggestions(false);
        const textarea = document.getElementById(
            'review-text'
        ) as HTMLTextAreaElement;
        if (textarea) {
            textarea.focus();
            const text = textarea.value;
            const atPosition = text.lastIndexOf('@');
            if (atPosition !== -1) {
                const newText =
                    text.substring(0, atPosition) +
                    `@${username} ` +
                    text.substring(textarea.selectionEnd);
                setInputValue(newText);
                textarea.setSelectionRange(
                    atPosition + username.length + 2,
                    atPosition + username.length + 2
                );
            }
        }
    };

    useEffect(() => {
        if (!isFocused) {
            setInputValue('');
        }
    }, [isFocused]);

    const isImageSelected = !!imagePreview;

    const handleEmojiSelect = (emoji: any) => {
        const textarea = tweetTextRef.current;
        setSelectedEmoji(emoji.native)
        if (textarea) {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            const text = textarea.value;
            const newText = text.substring(0, startPos) + emoji.native + text.substring(endPos);
            setInputValue(newText);
            textarea.focus();
            textarea.setSelectionRange(startPos + emoji.native.length, startPos + emoji.native.length);
            setOpenEmojiPicker(false);
        }
      };

    return (
        <React.Fragment>
            <form
                className={styles.container}
                onSubmit={onSubmit}
                onKeyDown={handleKeyDown}
                onClick={() => setIsFocused(true)}
            >
                {isFocused || isImageSelected ? (
                    <div
                        className={`${styles.everyone} ${
                            tweetAudienceValue === TWEET_AUDIENCE.twitterCircle
                                ? styles.twitterCirlce
                                : ''
                        }`}
                    >
                        <PopUpMenu
                            title={'Choose audience'}
                            options={tweetAudienceMenuOptions}
                            icons={tweetAudienceMenuIcons}
                            isMenuIcon={false}
                            isDisable={false}
                            onClick={(tweetPrivacyOptions) => {
                                onClickAudienceMenu!(tweetPrivacyOptions);
                            }}
                            className={styles.tweetPrivacyOptions}
                            classNameWithTitle={styles.privacyPopUpBox}
                        >
                            {tweetAudienceValue === TWEET_AUDIENCE.everyone ? (
                                <>
                                    <span>Everyone</span>
                                    <span>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>Twitter Circle</span>
                                    <span>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </span>
                                </>
                            )}
                        </PopUpMenu>
                    </div>
                ) : null}
                <p className={styles.textEreaInputError}>{textEreaInputError}</p>
                <textarea
                    className={`${styles.textarea} ${classNameTextErea}`}
                    id="review-text"
                    onChange={(e: any) => {
                        handleInputChange(e);
                        onChageTextArea(e);
                    }}
                    placeholder="What's happening?"
                    ref={tweetTextRef}
                    rows={1}
                    value={inputValue}
                />
                {showSuggestions && (
                    <div>
                        <div
                            ref={searchResultsRef}
                            className={styles.searchResults}
                        >
                            {searchResults.map((user: any) => (
                                <div
                                    key={user._id}
                                    onClick={() =>
                                        handleUserClick(user.username)
                                    }
                                >
                                    <UserInfo
                                        userId={user?._id}
                                        avatar={
                                            user?.avatar &&
                                            `${IMAGE_AVATAR_BASE_URL}/${user?.avatar}`
                                        }
                                        name={user?.name}
                                        username={user?.username}
                                        isVerified={user?.isVerified}
                                        isOnHover={true}
                                        isNavigate={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {isFocused || isImageSelected ? (
                    <PopUpMenu
                        title={'Who can reply?'}
                        options={tweetReplyOptions}
                        icons={tweetReplyIcons}
                        isMenuIcon={false}
                        isDisable={
                            tweetReplyValue === TWEET_REPLY.onlyTwitterCircle
                        }
                        onClick={(option) => {
                            onClickReplyMenu!(option);
                        }}
                        className={styles.tweetReplyOptions}
                        classNameWithTitle={styles.tweetReplyPopUpBox}
                    >
                        {/* {tweetReply} */}

                        <div
                            className={`${styles.replyPrivacyOptions} ${
                                tweetReplyValue ===
                                TWEET_REPLY.onlyTwitterCircle
                                    ? styles.onlyTweetCircle
                                    : ''
                            }`}
                        >
                            {tweetReplyValue === TWEET_REPLY.everyone ? (
                                <>
                                    <span>
                                        <FontAwesomeIcon icon={faEarthAfrica} />
                                    </span>
                                    <span>Everyone can reply</span>
                                </>
                            ) : tweetReplyValue ===
                              TWEET_REPLY.peopleYouFollow ? (
                                <>
                                    <span>
                                        <FontAwesomeIcon icon={faUserCheck} />
                                    </span>
                                    <span>People you follow</span>
                                </>
                            ) : tweetReplyValue ===
                              TWEET_REPLY.onlyPeopleYouMention ? (
                                <>
                                    <span>
                                        <FontAwesomeIcon icon={faAt} />
                                    </span>
                                    <span>Only people you mention</span>
                                </>
                            ) : (
                                tweetReplyValue ===
                                    TWEET_REPLY.onlyTwitterCircle && (
                                    <>
                                        <span>
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                        <span>
                                            Only your Twitter Circle who follows
                                            you can reply
                                        </span>
                                    </>
                                )
                            )}
                        </div>
                        <hr className={styles.horizontalLine} />
                    </PopUpMenu>
                ) : null}
                {imagePreview && (
                    <div className={styles.previewImage}>
                        <XmarkIcon
                            className={styles.cancelBtn}
                            size={'lg'}
                            onClick={onCancelImagePreview}
                        />
                        <img
                            id={imagePreview}
                            src={imagePreview}
                            alt="preview tweet img"
                        />
                    </div>
                )}
                <div className={styles.footer}>
                    <div className={styles.icons}>
                        <ImageIcon onChange={onImageUpload} />
                        <EmojiIcon onClick={() => setOpenEmojiPicker(true)} />
                            {openEmojiPicker && (
                                <div ref={emojiPickerRef} className={styles.emojiPicker}>
                                    <Picker   
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect} 
                                    />
                                </div>
                            )}
                        <CalendarIcon />
                    </div>
                    <div className={styles.buttonAndCounterWrapper}>
                        {inputValue.length > 0 ? (
                            <div className={styles.counter}>
                            {counter}/280
                            </div>
                        ): null}
                        <Button
                            value={'Tweet'}
                            type={ButtonType.primary}
                            size={ButtonSize.small}
                            isDisabled={
                                (value.length > 0 || imagePreview || selectedEmoji ? false : true) || (isLoading) || value.length > MAX_TWEET_CHARACTERS
                            }
                            loading={isLoading}
                            onClick={() => setIsFocused(false)}
                        />
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
};

export default FormTweet;
