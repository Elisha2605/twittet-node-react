import React, { FC, useContext, useRef, useState } from 'react';
import styles from './NavigationTweet.module.css';
import Avatar, { Size } from '../ui/Avatar';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import useAuthUser from '../../hooks/userAuth.hook';
import { createTweet } from '../../api/tweet.api';
import { tweetPrivacyMenuIcons, tweetPrivacyMenuOptions } from '../../data/menuOptions';
import { ModalContext } from '../../context/modal.context';
import Modal from '../ui/Modal';
import FormTweet from '../form/FormTweet';

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

    const tweetTextRef = useRef<HTMLTextAreaElement>(null);

    const { closeModal } = useContext(ModalContext);


        // Get auth user
    const authUser: any = useAuthUser();

    const handleSubmitTweet = async (e: React.FormEvent) => {
        console.log('inside handleSubmitTweet');
        e.preventDefault();
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;
        const res = await createTweet(text, selectedFile);
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
        clearTweetForm();
    };

    const handleTweetPrivacyOptions = (options: string) => {
        if (options === 'Everyone') {
            console.log(options + ': Clicked');
        }
        if (options === 'Twitter Circle') {
            console.log(options + ': Clicked');
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
                        setIsFocused={setIsFormFocused}
                        onSubmit={handleSubmitTweet}
                        onImageUpload={handleImageUpload}
                        onCancelImagePreview={handleCanselPreviewImage}
                        onChageImage={handleTextAreaOnChange}
                        tweetPrivacyOptions={tweetPrivacyMenuOptions}
                        tweetPrivacyIcons={tweetPrivacyMenuIcons}
                        onClickPrivacyMenu={handleTweetPrivacyOptions}
                        classNameTextErea={styles.classNameTextErea}
                    />
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default NavigationTweet;
