import React from 'react';
import styles from './App.module.css';
import Navigation from './components/navigation/Navigation';
import HomePage from './pages/Home';
import Layout from './Layout.module.css';
import { Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';

function App() {

    return (
        <React.Fragment>
            <div className={styles.app}>
                <div className={Layout.navigation}>
                    <Navigation />  
                </div>
                <div className={Layout.page}>
                    <Routes>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </div>
        </React.Fragment>
    );
}


export default App;
