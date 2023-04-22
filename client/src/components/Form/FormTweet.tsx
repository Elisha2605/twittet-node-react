import React, { FC } from 'react';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import styles from './FormTweet.module.css';
import EmojiIcon from '../icons/EmojiIcon';
import ImageIcon from '../icons/ImageIcon';
import CalendarIcon from '../icons/CalendarIcon';
import XmarkIcon from '../icons/XmarkIcon';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { isDisabled } from '@testing-library/user-event/dist/utils';

interface FormProps {
    value: string;
    tweetTextRef: React.RefObject<HTMLTextAreaElement>;
    imagePreview: string | null;

    onSubmit: (e: React.FormEvent) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChageImage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCancelImagePreview: () => void;

}

const FormTweet: FC<FormProps> = ({
    value,
    tweetTextRef,
    imagePreview,

    onSubmit,
    onImageUpload,
    onChageImage,
    onCancelImagePreview
}) => {

    // Adjust text erea with input value
    useAutosizeTextArea(tweetTextRef.current, value)

    // submit with by pressing "command + enter"
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.metaKey) {
            onSubmit(e);
        }
    }

    return (
        <React.Fragment>
            <form className={styles.container} onSubmit={onSubmit} onKeyDown={handleKeyDown}>
                <textarea
                    className={styles.textarea}
                    id="review-text"
                    onChange={onChageImage}
                    placeholder="What's happening?"
                    ref={tweetTextRef}
                    rows={1}
                    value={value}
                />
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
                        onClick={() => {}}
                    />
                </div>
            </form>
        </React.Fragment>
    );
};

export default FormTweet;
