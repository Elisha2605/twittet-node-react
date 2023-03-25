import React from 'react';
import styles from './App.module.css';
import Navigation from './components/navigation/Navigation';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';


function App() {

    return (
        <React.Fragment>
            <div className={styles.app}>
                <div className={styles.navigation}>
                    <Router>
                        <Navigation />  
                    </Router>
                </div>
                <div className={styles.page}>
                    <Home />
                </div>
            </div>
        </React.Fragment>
    );
}

export default App;
