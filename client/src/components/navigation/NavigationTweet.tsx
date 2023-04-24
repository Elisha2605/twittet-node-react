import React, { FC, useContext, useRef, useState } from 'react';
import styles from './NavigationTweet.module.css';
import Avatar, { Size } from '../ui/Avatar';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import FormTweet from '../form/FormTweet';
import useAuthUser from '../../hooks/userAuth.hook';
import { createTweet } from '../../api/tweet.api';
import { tweetPrivacyMenuIcons, tweetPrivacyMenuOptions } from '../../data/menuOptions';
import { ModalContext } from '../../context/modal.context';

interface NavigationTweetProp {
    onAddTweet: (tweet: any) => void;
}

const NavigationTweet: FC<NavigationTweetProp> = ({ onAddTweet }) => {

    const [tweets, setTweets] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isFormFocused, setIsFormFocused] = useState(false);

    const tweetTextRef = useRef<HTMLTextAreaElement>(null);

    const { closeModal } = useContext(ModalContext);


        // Get auth user
    const authUser: any = useAuthUser();
    
    //// new functions
    const handleImageOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target?.value;
        setValue(val);
    };

    const handleCanselPreviewImage = () => {
        if (previewImage) {
            setPreviewImage(null);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };  

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
            setTweets((prevTweets) => [newTweet, ...prevTweets]);
        }
        setSelectedFile(null);
        setPreviewImage(null);
        setValue('');
        setIsFormFocused(false);
        closeModal('Nav-tweet');
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
                    onChageImage={handleImageOnChange}
                    tweetPrivacyOptions={tweetPrivacyMenuOptions}
                    tweetPrivacyIcons={tweetPrivacyMenuIcons}
                    onClickPrivacyMenu={handleTweetPrivacyOptions}
                />
            </div>
        </React.Fragment>
    );
};

export default NavigationTweet;
