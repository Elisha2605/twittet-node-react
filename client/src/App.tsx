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
import Following from './pages/follow/Following';
import Follower from './pages/follow/Follower';
import { deleteTweet } from './api/tweet.api';
import { IMAGE_TWEET_BASE_URL, TWEET_MENU } from './constants/common.constants';
import MainTweet from './pages/tweet-modals/MainTweetModal';
import EditTweetModal from './pages/tweet-modals/EditTweetModal';
import TweetPage from './pages/tweet/TweetPage';

function App() {

    const [showBackground, setShowBackground] = useState(false); // Add state to control whether to show the blue background

    // Home Form states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [onAddTweet, setOnAddTweets] = useState<any[]>([]);
    const [onDeleteTweet, setOnDeleteTweet] = useState<any[]>([]);
    const [value, setValue] = useState('');

    // Modal Form states
    const [selectedFileModal, setSelectedFileModal] = useState<File | null>(null);
    const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);
    const [valueModal, setValueModal] = useState('');
    const [editTweetModal, setEditTweetModal] = useState<any>('');
    const [onEditTweet, setOnEditTweets] = useState<any[]>([]);

    // Tweet Edit modal
    const [valueEditModal, setValueEditModal] = useState('');
    const [previewEditImageModal, setPreviewEditImageModal] = useState<string | null>(null);

    // Reply form states
    const [valueReply, setValueReply] = useState('');
    const [selectedFileReply, setSelectedFileReply] = useState<File | null>(null);
    const [previewImageReply, setPreviewImageReply] = useState<string | null>(null);


    // useContexts
    const { modalOpen, openModal } = useContext(ModalContext);
    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();


    const handleLoginSuccess = () => {
        setShowBackground(true); // Set the showBackground state to true when login is successful
        setTimeout(() => {
            setShowBackground(false); // Set the showBackground state to false after 1.5 seconds
        }, 1000)
    };

    const handleAddTweet = (tweet: any) => {
        setOnAddTweets((prevTweets) => [tweet, ...prevTweets]);
    };

    const handleEditTweet = (editedTweet: any) => {
        setOnEditTweets(editedTweet)
    }

    
    //// new functions
    const handleTextAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target?.value;
        if (modalOpen) {
            setValueModal(val)
            setValueEditModal(val)
        } else {
            setValue(val);
        }
    };
    
    const handleReplyTextAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target?.value;
        setValueReply(val);
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            if (modalOpen) {
                setSelectedFileModal(file);
                let imageUrl = URL.createObjectURL(file);
                setPreviewImageModal(imageUrl);
                setPreviewEditImageModal(imageUrl);
            } else {
                setSelectedFile(file);
                let imageUrl = URL.createObjectURL(file);
                setPreviewImage(imageUrl);
                setPreviewImageReply(imageUrl);
            }
        }
    };

    const handleCanselPreviewImage = () => {
        if (modalOpen) {
            setPreviewImageModal('');
            setSelectedFileModal(null);
            setPreviewEditImageModal('');
        } else {
            setPreviewImage('');
            setSelectedFile(null);
            setPreviewImageReply('');
            setSelectedFileReply(null);
        }
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

    const handleTweetMenuOptionClick = async (option: string, tweetId: string, tweet: any) => {
        if (option === TWEET_MENU.delete) {
            const res = await deleteTweet(tweetId);
            const { tweet } = res;
            setOnDeleteTweet(tweet);
        } else if (option === TWEET_MENU.edit) {
            openModal('edit-tweet-modal');
            setEditTweetModal(tweet);
            setValueEditModal(tweet.text);
            const image = tweet.image && `${IMAGE_TWEET_BASE_URL}/${tweet.image}`;
            setPreviewEditImageModal(image);
            console.log(image);
        } 
    };

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
                            <Navigation />
                            <MainTweet 
                                selectedFile={selectedFileModal}
                                previewImage={previewImageModal}                                    
                                value={valueModal}
                                clearTweetForm={clearTweetForm}
                                handleTextAreaOnChange={handleTextAreaOnChange}
                                handleCanselPreviewImage={handleCanselPreviewImage}
                                handleImageUpload={handleImageUpload}
                                onAddTweet={handleAddTweet}
                                onEditTweet={handleEditTweet}
                            />
                            <EditTweetModal 
                                selectedFile={selectedFileModal}
                                previewImage={previewEditImageModal}                                    
                                value={valueEditModal}
                                clearTweetForm={clearTweetForm}
                                handleTextAreaOnChange={handleTextAreaOnChange}
                                handleCanselPreviewImage={handleCanselPreviewImage}
                                handleImageUpload={handleImageUpload}
                                onEditTweet={handleEditTweet}
                                
                                editTweetModal={editTweetModal}
                            />
                        </div>
                        <div className={Layout.page}>
                            <Routes>
                                <Route path="/" element={
                                    <Home
                                        onClickTweetMenu={handleTweetMenuOptionClick}
                                        onDeleteTweet={onDeleteTweet}
                                        onAddTweet={onAddTweet}
                                        onEditTweet={onEditTweet}
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
                                    element={<Bookmarks onClickTweetMenu={handleTweetMenuOptionClick} />}
                                />
                                <Route path="/profile/:id" element={<Profile 
                                    onAddTweet={onAddTweet} 
                                    onDeleteTweet={onDeleteTweet} 
                                    onEditTweet={onEditTweet}
                                    onClickTweetMenu={handleTweetMenuOptionClick} />} 
                                />
                                <Route path="/following/:id" element={<Following />} />
                                <Route path="/followers/:id" element={<Follower />} />
                                <Route path="/tweet/:id" element={
                                    <TweetPage 
                                        value={valueReply}
                                        selectedFile={selectedFileReply}
                                        previewImage={previewImageReply}
                                        handleTextAreaOnChange={handleReplyTextAreaOnChange}
                                        handleCanselPreviewImage={handleCanselPreviewImage}
                                        handleImageUpload={handleImageUpload}
                                        clearTweetForm={clearTweetForm}
                                        onClickTweetMenu={() => {}}
                                    />
                                } />
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
