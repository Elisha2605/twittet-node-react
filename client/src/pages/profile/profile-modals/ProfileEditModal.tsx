import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import styles from './ProfileEditModal.module.css';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_COVER_BASE_URL,
} from '../../../constants/common.constants';
import { ModalContext } from '../../../context/modal.context';
import Modal from '../../../components/ui/Modal';
import AuthContext from '../../../context/user.context';
import { useForm } from 'react-hook-form';
import FaCamera from '../../../assets/faCamera-regular.svg';
import XmarkIcon from '../../../components/icons/XmarkIcon';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';
import { editUserProfile } from '../../../api/user.api';

interface ProfileEditModalProps {
    user: any;
    editedObject?: any;
    onCallBackEdit?: (object: any) => void;
}

const ProfileEditModal: FC<ProfileEditModalProps> = ({
    user,
    onCallBackEdit,
    editedObject,
}) => {
    const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(
        null
    );
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
        null
    );

    const [previewCoverImage, setPreviewCoverImage] = useState<string | null>(
        null
    );
    const [previewAvatarImage, setPreviewAvatarImage] = useState<string | null>(
        null
    );

    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');

    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.name,
            bio: user?.bio,
            location: user?.location,
            website: user?.website,
        },
    });

    const [authUser, setAuthUser] = useState<any>(null);
    const { closeModal, modalOpen } = useContext(ModalContext);

    const tweetTextRef = useRef<HTMLTextAreaElement>(null);

    const nameInputRef = useRef(null);

    // setting the values when the modal is open
    const ctx = useContext(AuthContext);

    useEffect(() => {
        setName(user?.name || '');
        setBio(user?.bio || '');
        setLocation(user?.location || '');
        setWebsite(user?.website || '');
    }, [modalOpen, user]);

    const handleCoverImageUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedCoverFile(file);
            let imageUrl = URL.createObjectURL(file);
            setPreviewCoverImage(imageUrl);
        }
    };

    const handleAvatarImageUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedAvatarFile(file);
            let imageUrl = URL.createObjectURL(file);
            setPreviewAvatarImage(imageUrl);
        }
    };
    

    const handleSubmitForm = handleSubmit(async (data: any) => {
        const { user } = await editUserProfile(
            selectedCoverFile,
            selectedAvatarFile,
            name,
            bio,
            location,
            website
        );

        editedObject = {
            _id: user._id,
            name: user.name,
            bio: user.bio,
            location: user.location,
            website: user.website,
            coverImage: user.coverImage,
            avatar: user.avatar,
        };
        
        onCallBackEdit!(editedObject);
        closeModal('profile-edit-modal');
        setPreviewCoverImage('');
        setPreviewAvatarImage('');
        setSelectedCoverFile(null);
        setSelectedAvatarFile(null);
    });
    return (
        <React.Fragment>
            <Modal
                smallTitle={'Edit profile'}
                modalName={'profile-edit-modal'}
                isOverlay={true}
                classNameContainer={styles.modalContainer}
                classNameWrapper={styles.modalWrapper}
                isCustomeHeader={true}
                // isXmarkLeft={true}
            >
                <form
                    className={styles.formSection}
                    onSubmit={handleSubmitForm}
                >
                    <div className={styles.headerWrapper}>
                        <XmarkIcon size={'sm'} onClick={() => closeModal('')} />
                        <div className={styles.titleAndBtnWrapper}>
                            <h5>Edit Profile</h5>
                            <Button
                                value={'Save'}
                                type={ButtonType.secondary}
                                size={ButtonSize.small}
                                onClick={() => {}}
                                className={styles.button}
                            />
                        </div>
                    </div>
                    <div className={styles.imageWrapper}>
                        <div className={styles.coverImage}>
                            {previewCoverImage ? (
                                <img
                                    className={styles.image}
                                    id={previewCoverImage}
                                    src={previewCoverImage}
                                    alt=""
                                />
                            ) : (
                                <img
                                    className={styles.image}
                                    src={
                                        user?.avatar
                                            ? `${IMAGE_COVER_BASE_URL}/${user?.coverImage}`
                                            : undefined
                                    }
                                    alt=""
                                />
                            )}
                            <label htmlFor="coverInput">
                                <img
                                    className={styles.cameraIcon}
                                    src={FaCamera}
                                    alt=""
                                />
                            </label>
                            <input
                                type="file"
                                id="coverInput"
                                className={styles.hiddenInput}
                                name="cover"
                                onChange={handleCoverImageUpload}
                            />
                        </div>
                        <div className={styles.profileImage}>
                            {previewAvatarImage ? (
                                <img
                                    className={styles.image}
                                    id={previewAvatarImage}
                                    src={previewAvatarImage}
                                    alt=""
                                />
                            ) : (
                                <img
                                    className={styles.image}
                                    src={
                                        user?.avatar
                                            ? `${IMAGE_AVATAR_BASE_URL}/${user?.avatar}`
                                            : undefined
                                    }
                                    alt=""
                                />
                            )}
                            <label htmlFor="avatarInput">
                                <img
                                    className={styles.cameraIcon}
                                    src={FaCamera}
                                    alt=""
                                />
                            </label>
                            <input
                                type="file"
                                id="avatarInput"
                                className={styles.hiddenInput}
                                name="avatarImage"
                                onChange={handleAvatarImageUpload}
                            />
                        </div>
                    </div>
                    <div className={styles.inputContainer}>
                        <div
                            className={`${styles.inputWrapper} ${
                                errors.name ? styles.inputError : ''
                            }`}
                        >
                            <input
                                {...register('name')}
                                className={styles.formInput}
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                contentEditable={true}
                                placeholder=" "
                            />
                            <label className={styles.formLabel} htmlFor="name">
                                Name
                            </label>
                            {/* {errors.name && (
                                <p className={styles.errorMsg}>
                                    {errors.name?.message}
                                </p>
                            )} */}
                        </div>
                        <div
                            className={`${styles.inputWrapper} ${
                                errors.bio ? styles.inputError : ''
                            }`}
                        >
                            <input
                                {...register('bio')}
                                className={styles.formInput}
                                type="text"
                                id="bio"
                                name="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                contentEditable={true}
                                placeholder=" "
                            />
                            <label className={styles.formLabel} htmlFor="bio">
                                Bio
                            </label>
                            {/* {errors.bio && (
                                <p className={styles.errorMsg}>
                                    {errors.bio?.message}
                                </p>
                            )} */}
                        </div>
                        <div
                            className={`${styles.inputWrapper} ${
                                errors.location ? styles.inputError : ''
                            }`}
                        >
                            <input
                                {...register('location')}
                                className={styles.formInput}
                                type="text"
                                id="location"
                                name="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder=" "
                            />
                            <label
                                className={styles.formLabel}
                                htmlFor="location"
                            >
                                Location
                            </label>
                            {/* {errors.location && (
                                <p className={styles.errorMsg}>
                                    {errors.location?.message}
                                </p>
                            )} */}
                        </div>
                        <div
                            className={`${styles.inputWrapper} ${
                                errors.website ? styles.inputError : ''
                            }`}
                        >
                            <input
                                {...register('website')}
                                className={styles.formInput}
                                type="text"
                                id="website"
                                name="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder=" "
                            />
                            <label
                                className={styles.formLabel}
                                htmlFor="website"
                            >
                                Website
                            </label>
                            {/* {errors.website && (
                                <p className={styles.errorMsg}>
                                    {errors.website?.message}
                                </p>
                            )} */}
                        </div>
                    </div>
                </form>
            </Modal>
        </React.Fragment>
    );
};

export default ProfileEditModal;
