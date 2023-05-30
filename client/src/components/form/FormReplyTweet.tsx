import React, { FC } from 'react';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import styles from './FormReplyTweet.module.css';
import EmojiIcon from '../icons/EmojiIcon';
import ImageIcon from '../icons/ImageIcon';
import CalendarIcon from '../icons/CalendarIcon';
import XmarkIcon from '../icons/XmarkIcon';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';

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
    onChageImage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCancelImagePreview: () => void;
    onClickAudienceMenu?: Function;
    onClickReplyMenu?: Function;

    classNameTextErea?: string;   
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
    onChageImage,
    onCancelImagePreview,

    classNameTextErea,
    isLoading,
}) => {

    // Adjust text erea with input value
    useAutosizeTextArea(tweetTextRef.current, value)

    // ubmit with by pressing "command + enter"
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.metaKey) {
            onSubmit(e);
        }
    }

    return (
        <React.Fragment>
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
                            loading={isLoading}
                        />
                    </div>
                ): null}
            </form>

        </React.Fragment>
    );
};

export default FormReplyTweet;
