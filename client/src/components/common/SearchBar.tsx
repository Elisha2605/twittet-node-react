import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./SearchBar.module.css";

const SearchBar = () => {

    return (
        <React.Fragment>
            <div className={styles.container}>
                <input className={styles.input} type="text" placeholder="Search Twitter" />
                <FontAwesomeIcon 
                    icon={faSearch}
                />
            </div>
        </React.Fragment>
    )
}

export default SearchBar;