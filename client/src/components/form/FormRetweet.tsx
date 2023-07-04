import React, { FC, useRef, useState } from 'react';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import { 
    tweetAudienceMenuOptions, 
    tweetAudienceMenuIcons,
    tweetReplyOptions,
    tweetReplyIcons 
} from '../../data/menuOptions';
import styles from './FormRetweet.module.css';
import EmojiIcon from '../icons/EmojiIcon';
import CalendarIcon from '../icons/CalendarIcon';
import XmarkIcon from '../icons/XmarkIcon';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faChevronDown, faEarthAfrica, faLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import PopUpMenu from '../ui/PopUpMenu';
import { IMAGE_TWEET_BASE_URL, MAX_TWEET_CHARACTERS, TWEET_AUDIENCE, TWEET_REPLY, TWEET_TYPE } from '../../constants/common.constants';
import { searchUsers } from '../../api/user.api';
import UserInfo from '../ui/UserInfo';
import useClickOutSide from '../../hooks/useClickOutSide';
import UserInfoRetweet from '../ui/UserInfoRetweet';
import { getTimeDifference } from '../../utils/helpers.utils';
import ImageIcon from '../icons/ImageIcon';
import Picker from '@emoji-mart/react'


interface FormRetweetProps {
    tweet: any;
    value: string;
    tweetTextRef: React.RefObject<HTMLTextAreaElement>;
    selectedFile: File | null;
    imagePreview?: string | null;
    imagePreviewModal?: string | null;
    isFocused?: boolean;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;

    tweetAudienceValue?: string,
    tweetReplyValue?: string,

    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChageImage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCancelImagePreview: () => void;
    onClickAudienceMenu?: Function;
    onClickReplyMenu?: Function;

    isLoading?: boolean;
    classNameTextErea?: string;
}

const FormRetweet: FC<FormRetweetProps> = ({
    tweet,
    value,
    tweetTextRef,
    selectedFile,
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

    isLoading,

    classNameTextErea,
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


    // regular tweet
    const tweetId = tweet?._id;
    const createdAt = getTimeDifference(new Date(tweet?.createdAt).getTime());
    const tweetImage = tweet?.image;
    const text = tweet?.text;

    const userId = tweet?.user?._id;
    const name = tweet?.user?.name;
    const username = tweet?.user?.username;
    const avatar = tweet?.user?.avatar;
    const isVerfied = tweet?.user?.isVerified;

    // reTweet
    const { retweet } = tweet;
    const retweetId = retweet?.tweet?._id;
    const retweetCreatedAt = getTimeDifference(new Date(retweet?.tweet?.createdAt).getTime());
    const retweetImage = retweet?.tweet?.image;
    const retweetText = retweet?.tweet?.text;

    const retweetUserId = retweet?.user?._id;
    const retweetUserName = retweet?.user?.name;
    const retweetUserUsername = retweet?.user?.username;
    const isVerfiedRetweetUser = retweet?.user?.isVerified;
    const retweetUserAvatar = retweet?.user?.avatar;

    // close searech result on click outside
    useClickOutSide(searchResultsRef, setShowSuggestions);  
    useClickOutSide(emojiPickerRef, setOpenEmojiPicker);


    // Adjust text erea with input value
    useAutosizeTextArea(tweetTextRef.current, value)

    // ubmit with by pressing "command + enter"
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.metaKey) {
            onSubmit(e);
        }
    }
    
    const handleInputChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setInputValue(value);
        setCounter(value.length);
    
        if (value.length > MAX_TWEET_CHARACTERS) {
            setTextEreaInputError('Text too long!');
        } else {
            setTextEreaInputError(null);
        }
    
        const atIndex = value.lastIndexOf('@');
        const prevChar = value[atIndex - 1];
        const searchTerm = value.substring(atIndex + 1);
    
        setShowSuggestions(atIndex > -1 && searchTerm.length > 0 && !/\s/.test(searchTerm) && (prevChar === undefined || prevChar === ' '));
        
        if (atIndex > -1 && searchTerm.length > 0 && !/\s/.test(searchTerm) && (prevChar === undefined || prevChar === ' ')) {
            const { users } = await searchUsers(encodeURIComponent(searchTerm));
            setSearchResults(users);
        } else {
            setSearchResults([]);
        }
    };

    const handleUserClick = (username: string) => {
        setShowSuggestions(false);
        const textarea = document.getElementById('form-retweet') as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
          const text = textarea.value;
          const atPosition = text.lastIndexOf('@');
          if (atPosition !== -1) {
            const newText = text.substring(0, atPosition) + `@${username} ` + text.substring(textarea.selectionEnd);
            setInputValue(newText);
            textarea.setSelectionRange(atPosition + username.length + 2, atPosition + username.length + 2);
          }
        }
    };

    const renderColoredText = (text: string) => {
        const words = text ? text.split(' ') : [];
        return words.map((word: any, index: any) => {
            if (word.startsWith('@') || word.startsWith('#')) {
                return (
                    <a
                        key={index}
                        href={`http://127.0.0.1:3000/profile/${userId}`}
                        className={styles.coloredText}
                    >
                        {word}{' '}
                    </a>
                );
            }
            return <span key={index}>{word} </span>;
        });
    };

    const handleEmojiSelect = (emoji: any) => {
        const textarea = tweetTextRef.current;
        console.log('hello');
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
      
    const isImageSelected = !!imagePreview;
    const hasRetweetAndTweetImage = selectedFile;

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
                <p className={styles.textEreaInputError}>{textEreaInputError}</p>
                <textarea
                    className={`${styles.textarea} ${classNameTextErea}`}
                    id="form-retweet"
                    onChange={(e: any) => {
                        handleInputChange(e)
                        onChageImage(e);
                    }}
                    placeholder="Add a comment!"
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
                                    onClick={() => handleUserClick(user.username)}
                                    >
                                <UserInfo
                                        userId={user?._id}
                                        avatar={user?.avatar}
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
                {selectedFile && (
                    <div className={styles.previewImage}>
                        <XmarkIcon className={styles.cancelBtn} size={'lg'}
                            onClick={onCancelImagePreview}/>
                        <img id={imagePreview!} src={imagePreview!} alt='preview tweet img' />
                    </div>
                )}

                {!text && tweet.type === TWEET_TYPE.reTweet ? (
                    <div className={styles.retweetContainer}>
                        <UserInfoRetweet
                            userId={retweetUserId}
                            tweet={retweet}
                            avatar={avatar}
                            name={retweetUserName}
                            username={retweetUserUsername}
                            isVerified={isVerfiedRetweetUser}
                            time={retweetCreatedAt}
                            isOption={true}
                            className={styles.userInfoRetweet}
                        />
                        <div
                            className={`${styles.body} ${hasRetweetAndTweetImage ? styles.reTweetWithImageBody : ''}`}
                            key={retweetId}
                        >
                            <p className={`${styles.reTweetText} ${hasRetweetAndTweetImage ? styles.reTweetWithImageText : ''}`}>
                                {renderColoredText(retweetText && retweetText.length > 150 ? retweetText.substring(0, 150) + '....' : retweetText)}
                            </p>
                            {retweetImage && (
                                <div className={`${styles.reTweetImage} ${hasRetweetAndTweetImage ? styles.reTweetWithImageImage : ''}`}>
                                    <img
                                        src={
                                            retweetImage
                                                ? `${IMAGE_TWEET_BASE_URL}/${retweetImage}`
                                                : undefined
                                        }
                                        alt=""
                                    />
                                </div>
                            )}
                        </div>           
                    </div>
                ): (

                <div className={styles.retweetContainer}>
                    <UserInfoRetweet
                        userId={userId}
                        tweet={tweet.retweet}
                        avatar={avatar}
                        name={name}
                        username={username}
                        isVerified={isVerfied}
                        time={createdAt}
                        isOption={true}
                        className={styles.userInfoRetweet}
                    />
                    <div
                        className={`${styles.body} ${hasRetweetAndTweetImage ? styles.reTweetWithImageBody : ''}`}
                        key={tweetId}
                    >
                        <p className={`${styles.reTweetText} ${hasRetweetAndTweetImage ? styles.reTweetWithImageText : ''}`}>
                            {renderColoredText(text && text.length > 150 ? text.substring(0, 150) + '....' : text)}
                        </p>
                        {tweetImage && (
                            <div className={`${styles.reTweetImage} ${hasRetweetAndTweetImage ? styles.reTweetWithImageImage : ''}`}>
                                <img
                                    src={
                                        tweetImage
                                            ? `${IMAGE_TWEET_BASE_URL}/${tweetImage}`
                                            : undefined
                                    }
                                    alt=""
                                />
                            </div>
                        )}
                    </div>           
                </div>

                )}


                 {/* {tweetReply} */}

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
                <div className={styles.footer}>
                    <div className={styles.icons}>
                        <ImageIcon onChange={onImageUpload} />
                        <EmojiIcon onClick={() => setOpenEmojiPicker(true)} />
                            {openEmojiPicker && (
                                <div ref={emojiPickerRef} className={styles.emojiPicker}>
                                    <Picker 
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
                            isLoading={isLoading}
                            isDisabled={
                                (value.length > 0 || imagePreview || selectedEmoji ? false : true) || (isLoading) || value.length > MAX_TWEET_CHARACTERS
                            }
                            onClick={() => setIsFocused(false)}
                        />
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
};

export default FormRetweet;
