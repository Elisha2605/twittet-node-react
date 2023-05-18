import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps  {
    width?: number;
}

const SearchBar: FC<SearchBarProps> = ({ width }) => {

    return (
        <React.Fragment>
            <div className={styles.container} style={{ width: `${width}%` }}>
                <input className={styles.input} type="text" placeholder="Search Twitter" />
                <FontAwesomeIcon 
                    icon={faSearch}
                />
            </div>
        </React.Fragment>
    )
}

export default SearchBar;