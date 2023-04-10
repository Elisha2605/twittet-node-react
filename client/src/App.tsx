import React, { useContext, useEffect } from 'react';
import styles from './App.module.css';
import Navigation from './components/navigation/Navigation';
import HomePage from './pages/Home';
import Layout from './Layout.module.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Bookmarks from './pages/Bookmarks';
import Notifications from './pages/Notifications';
import Message from './pages/Messages';
import Index from './pages/Index';
import AuthContext, { StoredContext } from './context/user.context';

function App() {
    const context = useContext(AuthContext);
    let ctx: StoredContext | undefined = context.getUserContext();

    if (!ctx?.isLoggedIn) {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Routes>
                        <Route path="/index" element={<Index />} />
                        <Route path="/" element={<Index />} />
                        <Route
                            path="*"
                            element={<Navigate to="/" replace={true} />}
                        />
                    </Routes>
                </BrowserRouter>
            </React.Fragment>
        )
    }

    
    return (
        <React.Fragment>
            <div className={styles.app}>
                <div>
                    <BrowserRouter>
                        <div className={Layout.navigation}>
                            <Navigation />
                        </div>
                        <div className={Layout.page}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
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
                                <Route path="/profile" element={<Profile />} />
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
