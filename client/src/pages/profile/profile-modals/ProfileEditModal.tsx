import React, { FC, useContext, useEffect, useState } from 'react';
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
import { validateWebsite } from '../../../utils/formValidation.utils';

interface ProfileEditModalProps {
    user: any;
    editedObject?: any;
    onCallBackEdit?: (object: any) => void;
}

const ProfileEditModal: FC<ProfileEditModalProps> = ({
    user,
    editedObject,
    onCallBackEdit,
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
    const [authUser, setAuthUser] = useState<any>(null);

    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: authUser?.name as string,
            bio: authUser?.bio as string,
            location: authUser?.location as string,
            website: authUser?.website as string,
        },
    });

    const { closeModal, modalOpen } = useContext(ModalContext);

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);


    // setting the values when the modal is open
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
        setIsLoading(true);
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
        reset(); // clear form input values
        setIsLoading(false);
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
                                isLoading={isLoading}
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
                                            : `${IMAGE_COVER_BASE_URL}/default-cover.jpg`
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
                                            : `${IMAGE_AVATAR_BASE_URL}/default-avatar.jpg`
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
                            {errors.name && (
                                <p className={styles.errorMsg}>
                                    {errors.name?.message}
                                </p>
                            )}
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
                            {errors.bio && (
                                <p className={styles.errorMsg}>
                                    {errors.bio?.message}
                                </p>
                            )}
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
                            {errors.location && (
                                <p className={styles.errorMsg}>
                                    {errors.location?.message}
                                </p>
                            )}
                        </div>
                        <div
                            className={`${styles.inputWrapper} ${
                                errors.website ? styles.inputError : ''
                            }`}
                        >
                            <input
                                {...register('website', { validate: validateWebsite })}
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
                            {errors.website && (
                                <p className={styles.errorMsg}>
                                    {errors.website?.message}
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </Modal>
        </React.Fragment>
    );
};

export default ProfileEditModal;
