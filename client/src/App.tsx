import React from 'react';
import styles from './App.module.css';
import Navigation from './components/navigation/Navigation';
import HomePage from './pages/Home';
import Layout from './Layout.module.css';
import { Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Bookmarks from './pages/Bookmarks';
import Notifications from './pages/Notifications';
import Message from './pages/Messages';

function App() {

    return (
        <React.Fragment>
            <div className={styles.app}>
                <div className={Layout.navigation}>
                    <Navigation />  
                </div>
                <div className={Layout.page}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/notification" element={<Notifications />} />
                        <Route path="/message" element={<Message />} />
                        <Route path="/bookmarks" element={<Bookmarks />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </div>
        </React.Fragment>
    );
}


export default App;
