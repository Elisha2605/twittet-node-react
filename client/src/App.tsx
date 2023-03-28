import React from 'react';
import styles from './App.module.css';
import Navigation from './components/navigation/Navigation';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './pages/Home';
import Layout from './Layout.module.css';
import Profile from './pages/Profile';


function App() {

    return (
        <React.Fragment>
            <div className={styles.app}>
                <div className={Layout.navigation}>
                    <Router>
                        <Navigation />  
                    </Router>
                </div>
                <div className={Layout.page}>
                    <HomePage />
                    {/* <Profile /> */}
                </div>
            </div>
        </React.Fragment>
    );
}

export default App;
