import React, { FC, useState } from 'react';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import styles from './FormTweet.module.css';
import EmojiIcon from '../icons/EmojiIcon';
import ImageIcon from '../icons/ImageIcon';
import CalendarIcon from '../icons/CalendarIcon';
import XmarkIcon from '../icons/XmarkIcon';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faEarthAfrica } from '@fortawesome/free-solid-svg-icons';
import PopUpMenu from '../ui/PopUpMenu';

interface FormProps {
    value: string;
    tweetTextRef: React.RefObject<HTMLTextAreaElement>;
    imagePreview: string | null;
    isFocused: boolean;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;

    tweetPrivacyOptions: string[];
    tweetPrivacyIcons: Record<string, React.ReactNode>;

    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChageImage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCancelImagePreview: () => void;
    onClickPrivacyMenu: Function;
}

const FormTweet: FC<FormProps> = ({
    value,
    tweetTextRef,
    imagePreview,
    isFocused = false,
    setIsFocused,

    tweetPrivacyOptions,
    tweetPrivacyIcons,

    onSubmit,
    onImageUpload,
    onChageImage,
    onCancelImagePreview,
    onClickPrivacyMenu,
}) => {
    
    // Adjust text erea with input value
    useAutosizeTextArea(tweetTextRef.current, value)

    // submit with by pressing "command + enter"
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.metaKey) {
            onSubmit(e);
        }
    }

    const isImageSelected = !!imagePreview;

    return (
        <React.Fragment>
            <form className={styles.container} onSubmit={onSubmit} onKeyDown={handleKeyDown}>
                
                {isFocused || isImageSelected ? (
                    <div className={styles.privacyOptions}>
                        <PopUpMenu 
                            title={'Choose audience'}
                            options={tweetPrivacyOptions}
                            icons={tweetPrivacyIcons}
                            isMenuIcon={false}
                            onClick={(tweetPrivacyOptions) => {
                                onClickPrivacyMenu!(tweetPrivacyOptions)
                            }} 
                            className={styles.tweetPrivacyOptions}
                            classNameWithTitle={styles.privacyPopUpBox}
                        >
                            <span>Everyone</span><span><FontAwesomeIcon icon={faChevronDown}/></span>
                        </PopUpMenu>
                    </div>
                ) : null }
                <textarea
                    className={styles.textarea}
                    id="review-text"
                    onChange={onChageImage}
                    placeholder="What's happening?"
                    ref={tweetTextRef}
                    rows={1}
                    value={value}
                    onClick={() => setIsFocused(true)}
                />
                {isFocused || isImageSelected ? (
                    <>
                        <div className={styles.replyPrivacyOptions}>
                            <span><FontAwesomeIcon icon={faEarthAfrica}/></span><span>Everyone can reply</span>
                        </div>
                        <hr className={styles.horizontalLine} />
                    </>
                ) : null }
                {imagePreview && (
                    <div className={styles.previewImage}>
                        <XmarkIcon className={styles.cancelBtn} size={'lg'} 
                            onClick={onCancelImagePreview}/>
                        <img src={imagePreview} alt='preview tweet img' />
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
