import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './SearchBar.module.css';
import { searchUsers } from '../../api/user.api';
import UserInfo from './UserInfo';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import useClickOutSide from '../../hooks/useClickOutSide';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    width?: number;
}

const SearchBar: FC<SearchBarProps> = ({ width }) => {
    const [searchTerm, setSearchTerm] = useState<any>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const searchResultsRef = useRef<HTMLDivElement>(null);


    const handleOnChangeSearch = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        if (searchTerm.length === 0) {
            setSearchResults([]);
            return;
        }

        const { users } = await searchUsers(encodeURIComponent(searchTerm));
        setSearchResults(users);
    };

    useClickOutSide(searchResultsRef, setIsFocused);

    useEffect(() => {
        console.log(searchResults);
    }, [searchResults])

    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className={styles.container} style={{ width: `${width}%` }}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Search Twitter"
                    value={searchTerm}
                    onChange={(e: any) => handleOnChangeSearch(e)}
                    onFocus={() => setIsFocused(true)}
                />
                {isFocused  && (
                    <div
                        ref={searchResultsRef}
                        className={styles.searchResults}
                        onBlur={() => setIsFocused(false)}
                        onClick={() => {
                            setIsFocused(false)
                            setSearchTerm('')
                        }}
                    >
                        {searchResults.map((user: any) => (
                            <div key={user._id} onClick={() => navigate(`/profile/${user._id}`)}>
                            <UserInfo
                                    userId={user?._id}
                                    avatar={
                                        user?.avatar &&
                                        `${IMAGE_AVATAR_BASE_URL}/${user?.avatar}`
                                    }
                                    name={user?.name}
                                    username={user?.username}
                                    isVerified={user?.isVerified}
                                    isOnHover={true}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {isFocused && searchResults.length === 0 && searchTerm.length > 0 && (
                    <div className={styles.searchResults}>
                        <p className={styles.searchMsg}>No result found for "{searchTerm}"</p>
                    </div>
                )}
                {isFocused && (searchTerm.length === 0 && searchResults.length === 0) && (
                    <div className={styles.searchResults}>
                        <p className={styles.searchMsg}>Searching for people, by their name or username</p>
                    </div>
                )}
                <FontAwesomeIcon icon={faSearch} />
            </div>
        </React.Fragment>
    );
};

export default SearchBar;
