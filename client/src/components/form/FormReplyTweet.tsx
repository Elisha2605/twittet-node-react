import React, { FC, useEffect, useRef, useState } from 'react';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import styles from './FormReplyTweet.module.css';
import EmojiIcon from '../icons/EmojiIcon';
import ImageIcon from '../icons/ImageIcon';
import XmarkIcon from '../icons/XmarkIcon';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import useClickOutSide from '../../hooks/useClickOutSide';
import { MAX_TWEET_CHARACTERS } from '../../constants/common.constants';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { searchUsers } from '../../api/user.api';
import UserInfo from '../ui/UserInfo';


interface FormReplyTweetProps {
    tweet?: any;
    value: string;
    tweetTextRef: React.RefObject<HTMLTextAreaElement>;
    imagePreview?: string | null;
    imagePreviewModal?: string | null;
    isFocused?: boolean;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;

    tweetAudienceValue?: string,
    tweetReplyValue?: string,

    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChageReplyTextArea: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCancelImagePreview: () => void;
    onClickAudienceMenu?: Function;
    onClickReplyMenu?: Function;

    classNameTextErea?: string; 
    ClassNameShowUserMentions?: string;  
    isLoading?: boolean;
}

const FormReplyTweet: FC<FormReplyTweetProps> = ({
    tweet,
    value,
    tweetTextRef,
    imagePreview,
    isFocused = false,
    setIsFocused,

    onSubmit,
    onImageUpload,
    onChageReplyTextArea,
    onCancelImagePreview,

    classNameTextErea,
    ClassNameShowUserMentions,
    isLoading,
}) => {

    const [counter, setCounter] = useState<number>(0);
    const [textEreaInputError, setTextEreaInputError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
    const [selectedEmoji, setSelectedEmoji] = useState<any>();
    const [inputValue, setInputValue] = useState('');


    const searchResultsRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Adjust text erea with input value
    useAutosizeTextArea(tweetTextRef.current, value)
    useClickOutSide(emojiPickerRef, setOpenEmojiPicker);

    // ubmit with by pressing "command + enter"
    
    // to be moved //////////////
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.metaKey) {
            onSubmit(e);
        }
    }

    // to be moved //////////////
    const handleUserClick = (username: string) => {
        setShowSuggestions(false);
        const textarea = document.getElementById(
            'review-reply'
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

    // to be moved //////////////
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
    
    // to be moved //////////////
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

    useEffect(() => {
        if (!isFocused) {
            setInputValue('');
        }
    }, [isFocused]);
    

    return (
        <React.Fragment>
            <form 
                className={styles.container} 
                onSubmit={onSubmit} 
                onKeyDown={handleKeyDown} 
                onClick={() => setIsFocused(true)}
            >
                {textEreaInputError && <p className={styles.textEreaInputError}>{textEreaInputError}</p>}
                <div className={styles.textAreaWrapper}>
                    <textarea
                        className={`${styles.textarea} ${classNameTextErea}`}
                        id="review-reply"
                        onChange={(e: any) => {
                            handleInputChange(e);
                            onChageReplyTextArea(e);
                        }}
                        placeholder="Tweet your reply"
                        ref={tweetTextRef}
                        rows={1}
                        value={inputValue}
                    />
                    {showSuggestions && (
                    <div>
                        <div
                            ref={searchResultsRef}
                            className={`${styles.searchResults} ${ClassNameShowUserMentions}`}
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
                    {!isFocused && (
                        <Button
                            value={'Tweet'}
                            type={ButtonType.primary}
                            size={ButtonSize.small}
                            isDisabled={true}
                            onClick={() => {}}
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
                {isFocused && (
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
                            {/* <CalendarIcon /> */}
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
                                isLoading={isLoading}
                                onClick={() => setIsFocused(false)}
                            />
                        </div>
                    </div>
                )}
            </form>

        </React.Fragment>
    );
};

export default FormReplyTweet;
