import React, { useContext, useState } from 'react';
import styles from './App.module.css';
import Navigation from './components/navigation/Navigation';
import Layout from './Layout.module.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Profile from './pages/profile/Profile';
import Explore from './pages/explore/Explore';
import Bookmarks from './pages/bookmarks/Bookmarks';
import Notifications from './pages/notification/Notifications';
import Message from './pages/messages/Messages';
import Index from './pages/index/Index';
import AuthContext, { StoredContext } from './context/user.context';
import TwitterIcon from './components/icons/TwitterIcon';
import Home from './pages/home/Home';
import { ModalContext } from './context/modal.context';
import OtherProfile from './pages/otherProile/OtherProfile';
import Following from './pages/follow/Following';
import Follower from './pages/follow/Follower';

function App() {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [onAddTweet, setOnAddTweets] = useState<any[]>([]);
    const [value, setValue] = useState('');

    const [selectedFileModal, setSelectedFileModal] = useState<File | null>(null);
    const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);
    const [valueModal, setValueModal] = useState('');


    const { modalOpen } = useContext(ModalContext);

    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();

    const [showBackground, setShowBackground] = useState(false); // Add state to control whether to show the blue background

    const handleLoginSuccess = () => {
        setShowBackground(true); // Set the showBackground state to true when login is successful
        setTimeout(() => {
            setShowBackground(false); // Set the showBackground state to false after 1.5 seconds
        }, 1000)
    };

    const handleAddTweet = (tweet: any) => {
        setOnAddTweets((prevTweets) => [tweet, ...prevTweets]);
    };
    
    //// new functions
    const handleTextAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target?.value;
        if (modalOpen) {
            setValueModal(val)
        } else {
            setValue(val);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            if (modalOpen) {
                setSelectedFileModal(file);
                let imageUrl = URL.createObjectURL(file);
                setPreviewImageModal(imageUrl);
            } else {
                setSelectedFile(file);
                let imageUrl = URL.createObjectURL(file);
                setPreviewImage(imageUrl);
            }
        }
    };

    const handleCanselPreviewImage = () => {
        if (modalOpen) {
            setPreviewImageModal(null);
            setSelectedFileModal(null);
        } else {
            setPreviewImage(null);
            setSelectedFile(null);
        }
        setSelectedFile(null);
    };

    const clearTweetForm = () => {
        if (modalOpen) {
            setSelectedFileModal(null);
            setPreviewImageModal(null);
            setValueModal('');
        }
        setSelectedFile(null);
        setPreviewImage(null);
        setValue('');
    }

    // Index page
    if (!ctx?.isLoggedIn) {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index onSuccess={handleLoginSuccess} />} />
                        <Route
                            path="*"
                            element={<Navigate to="/" replace={true} />}
                        />
                    </Routes>
                </BrowserRouter>
            </React.Fragment>
        )
    }

    // Dashboard
    return (
        <React.Fragment>
            <div className={`${styles.App} ${showBackground ? styles['show-background'] : ''}`}>
            {showBackground && <div className={styles.blueBackground} >
                <div className={styles.twitterIcon}>
                    <TwitterIcon size={'2xl'} color={'var(--color-white)'} />
                </div> 
             </div>} {/* Conditionally render the blue background */}
                <div>
                    <BrowserRouter>
                        <div className={Layout.navigation}>
                            <Navigation 
                                selectedFile={selectedFileModal}
                                previewImage={previewImageModal}                                    
                                value={valueModal}
                                clearTweetForm={clearTweetForm}
                                handleTextAreaOnChange={handleTextAreaOnChange}
                                handleCanselPreviewImage={handleCanselPreviewImage}
                                handleImageUpload={handleImageUpload}
                                onAddTweet={handleAddTweet}
                            />
                        </div>
                        <div className={Layout.page}>
                            <Routes>
                                <Route path="/" element={
                                    <Home
                                        onAddTweet={onAddTweet}
                                        selectedFile={selectedFile}
                                        previewImage={previewImage}                                    
                                        value={value}
                                        handleTextAreaOnChange={handleTextAreaOnChange}
                                        handleCanselPreviewImage={handleCanselPreviewImage}
                                        handleImageUpload={handleImageUpload} 
                                        clearTweetForm={clearTweetForm}
                                    />
                                }/>
                                <Route path="/explore" element={<Explore />} />
                                <Route
                                    path="/notification"
                                    element={<Notifications />}
                                />
                                <Route path="/message" element={<Message />} />
                                <Route
                                    path="/bookmarks"
                                    element={<Bookmarks />}
                                />
                                <Route
                                    path="/user-profile/:id"
                                    element={<OtherProfile />}
                                />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/following" element={<Following />} />
                                <Route path="/follower" element={<Follower />} />
                                <Route
                                    path="*"
                                    element={<Navigate to="/" replace={true} />}
                                />
                            </Routes>
                        </div>
                    </BrowserRouter>
                </div>
            </div>
        </React.Fragment>
    )
}

export default App;
