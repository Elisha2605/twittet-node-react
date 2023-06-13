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
import { deleteTweet, retweet } from './api/tweet.api';
import { IMAGE_TWEET_BASE_URL, TWEET_MENU } from './constants/common.constants';
import NavigationTweetModal from './pages/tweet/tweet-modals/NavigationTweetModal';
import EditTweetModal from './pages/tweet/tweet-modals/EditTweetModal';
import TweetPage from './pages/tweet/TweetPage';
import TweetPageNoImage from './pages/tweet/TweetPageNoImage';
import FollowerRequests from './pages/follow/FollowerRequests';
import RetweetModal from './pages/tweet/tweet-modals/RetweetModal';
import FollowStatus from './pages/follow/FollowStatus';
import Settings from './pages/settings/settings';
import HomeEditTwitterCirlceModal from './pages/home/home-modals/HomeEditTwitterCirlceModal';
import { useMessage } from './context/successMessage.context';
import AccessDenied from './pages/access-denied';

function App() {

    const [showBackground, setShowBackground] = useState(false); // Add state to control whether to show the blue background

    const [tweet, setTweet] = useState<any>();

    // Home Form states
    const [selectedFileHome, setSelectedFileHome] = useState<File | null>(null);
    const [previewImageHome, setPreviewImageHome] = useState<string | null>(null);
    const [valueHome, setValueHome] = useState('');

    // Modal Form states
    const [selectedFileModal, setSelectedFileModal] = useState<File | null>(null);
    const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);
    const [valueModal, setValueModal] = useState('');
    
    const [onEditTweet, setOnEditTweets] = useState<any[]>([]);

    // cross-components states
    const [onAddTweet, setOnAddTweets] = useState<any[]>([]);
    const [onDeleteTweet, setOnDeleteTweet] = useState<any[]>([]);
    const [editTweetModal, setEditTweetModal] = useState<any>('');

    // Tweet Edit modal
    const [valueEditModal, setValueEditModal] = useState('');
    const [previewEditImageModal, setPreviewEditImageModal] = useState<string | null>(null);

    // useContexts
    const { showMessage } = useMessage();

    const { modalOpen, openModal } = useContext(ModalContext);
    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();

    const handleAddTweet = (tweet: any) => {
        setOnAddTweets((prevTweets) => [tweet, ...prevTweets]);
    };

    const handleEditTweet = (editedTweet: any) => {
        setOnEditTweets(editedTweet)
    }
    
    // On Login blue background
    const handleLoginSuccess = () => {
        setShowBackground(true); // Set the showBackground state to true when login is successful
        const loginTimemout =  setTimeout(() => {
            setShowBackground(false); // Set the showBackground state to false after 1.5 seconds
        }, 1000)
        clearTimeout(loginTimemout);
    };

    const handleTextAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target?.value;
        if (modalOpen) {
            setValueModal(val)
            setValueEditModal(val)
        } else {
            setValueHome(val);
        }
    };
    
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            if (modalOpen) {
                setSelectedFileModal(file);
                let imageUrl = URL.createObjectURL(file);
                setPreviewImageModal(imageUrl);
                setPreviewEditImageModal(imageUrl);
            } else {
                setSelectedFileHome(file);
                let imageUrl = URL.createObjectURL(file);
                setPreviewImageHome(imageUrl);
            }
        }
    };

    const handleCanselPreviewImage = () => {
        if (modalOpen) {
            setPreviewImageModal('');
            setSelectedFileModal(null);
            setPreviewEditImageModal('');
        } else {
            setPreviewImageHome('');
            setSelectedFileHome(null);
        }
      };

    const clearTweetForm = () => {
        if (modalOpen) {
            setSelectedFileModal(null);
            setPreviewImageModal(null);
            setValueModal('');
        }
        setSelectedFileHome(null);
        setPreviewImageHome(null);
        setValueHome('');
    }

    const handleTweetMenuOptionClick = async (option: string, tweetId: string, tweet: any) => {
        if (option === TWEET_MENU.delete) {
            const res = await deleteTweet(tweetId);
            const { tweet } = res;
            setOnDeleteTweet(tweet);
            showMessage('Your Tweet was deleted', 'success');
        } else if (option === TWEET_MENU.edit) {
            openModal('edit-tweet-modal');
            setEditTweetModal(tweet);
            setValueEditModal(tweet.text);
            const image = tweet.image && `${IMAGE_TWEET_BASE_URL}/${tweet.image}`;
            setPreviewEditImageModal(image);
        } 
    };

    const onReTweet = async (option: any, tweet: any) => {
        if (option === TWEET_MENU.undoRetweet) {
            const res = await retweet(tweet?._id, null, tweet.image, tweet.audience, tweet.reply);
            if (res.message === "Undo Retweet") {
                showMessage('Undo Retweet successful', 'success');
                setOnDeleteTweet(tweet)
            }
        }
        if (option === TWEET_MENU.retweet) {
            const res = await retweet(tweet?._id, null, tweet.image, tweet.audience, tweet.reply);
                const newTweet = {
                    ...res.tweet
                };
                handleAddTweet(newTweet)
                if (res.success) {
                    showMessage('Your retweet was sent', 'success');
                }
        }
        if (option === TWEET_MENU.quoteTweet) {
            // changle the name of the states
            setTweet(tweet)
            openModal('retweet-modal')
            setEditTweetModal(tweet);
            setValueEditModal(tweet.text);
            const image = tweet.image && `${IMAGE_TWEET_BASE_URL}/${tweet.image}`;
            setPreviewEditImageModal(image);
        }
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
                        <div className={`${Layout.navigation}`}>
                            <Navigation />
                            <NavigationTweetModal 
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
                            <RetweetModal 
                                originalTweet={tweet}
                                selectedFile={selectedFileModal}
                                previewImage={previewEditImageModal}                                    
                                value={valueEditModal}
                                clearTweetForm={clearTweetForm}
                                handleTextAreaOnChange={handleTextAreaOnChange}
                                handleCanselPreviewImage={handleCanselPreviewImage}
                                handleImageUpload={handleImageUpload}
                                onAddTweet={handleAddTweet}
                                
                                editTweetModal={editTweetModal}
                            />
                        </div>
                        <>
                            <HomeEditTwitterCirlceModal />
                        </>
                        <div className={Layout.page}>
                            <Routes>
                                <Route path='/access-denied' element={<AccessDenied />} ></Route>
                                <Route path="/" element={
                                    <Home
                                        onClickTweetMenu={handleTweetMenuOptionClick}
                                        onDeleteTweet={onDeleteTweet}
                                        onAddTweet={onAddTweet}
                                        onEditTweet={onEditTweet}
                                        selectedFile={selectedFileHome}
                                        previewImage={previewImageHome}                                    
                                        value={valueHome}
                                        handleTextAreaOnChange={handleTextAreaOnChange}
                                        handleCanselPreviewImage={handleCanselPreviewImage}
                                        handleImageUpload={handleImageUpload} 
                                        clearTweetForm={clearTweetForm}
                                        onClickRetweet={onReTweet}
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
                                    element={<Bookmarks 
                                        onClickTweetMenu={handleTweetMenuOptionClick} 
                                        onEditTweet={onEditTweet} 
                                        onDeleteTweet={onDeleteTweet} 
                                        onClickRetweet={onReTweet}
                                    />}
                                />
                                <Route path="/profile/:id" element={<Profile 
                                    onAddTweet={onAddTweet} 
                                    onDeleteTweet={onDeleteTweet} 
                                    onEditTweet={onEditTweet}
                                    onClickRetweet={onReTweet}
                                    onClickTweetMenu={handleTweetMenuOptionClick} />} 
                                />
                                <Route path="/follow-status/:path/:id/*" element={<FollowStatus />} />
                                <Route path="/tweet/image/:id" element={ <TweetPage />} />
                                <Route path="/tweet/:id" element={ <TweetPageNoImage />} />
                                <Route path="/follower-requests" element={ <FollowerRequests />} />
                                <Route path="/settings/:path" element={ <Settings />} />
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
