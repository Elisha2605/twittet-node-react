import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useRef, useState } from 'react';
import styles from './SearchBar.module.css';
import { searchUsers } from '../../api/user.api';
import UserInfo from './UserInfo';
import useClickOutSide from '../../hooks/useClickOutSide';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    width?: number;
    isButton?: boolean;
    classNameContainer?: string;
    classNameInput?: string;
    isNavigate?: boolean;
    classSearchResults?: string;
    onUserSelected?: (contact: any) => void;
    onClickBtn?: () => void;
    center?: boolean;
}

const SearchBar: FC<SearchBarProps> = ({
    width,
    isButton,
    classNameContainer,
    classNameInput,
    classSearchResults,
    isNavigate,
    onUserSelected,
    onClickBtn,
    center = false,
}) => {
    const [searchTerm, setSearchTerm] = useState<any>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const searchResultsRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useClickOutSide(searchResultsRef, setIsFocused);

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

    const handleOnclickUser = (user: any) => {
        onUserSelected!(user);
    };

    return (
        <React.Fragment>
            <div
                className={`${styles.container} ${classNameContainer} ${
                    center ? styles.positionCenter : ''
                }`}
                style={{ width: `${width}%` }}
            >
                <input
                    className={`${styles.input} ${classNameInput}`}
                    type="text"
                    placeholder="Search Twitter"
                    value={searchTerm}
                    onChange={(e: any) => handleOnChangeSearch(e)}
                    onFocus={() => setIsFocused(true)}
                />
                {isFocused && (
                    <div
                        ref={searchResultsRef}
                        className={`${styles.searchResults} ${classSearchResults}`}
                        onBlur={() => setIsFocused(false)}
                        onClick={() => {
                            setIsFocused(false);
                            setSearchTerm('');
                        }}
                    >
                        {searchResults.map((user: any) => (
                            <div key={user?._id}>
                                {isButton ? (
                                    <div key={user?._id} onClick={onClickBtn}>
                                        <UserInfo
                                            userId={user?._id}
                                            avatar={user?.avatar}
                                            name={user?.name}
                                            username={user?.username}
                                            isVerified={user?.isVerified}
                                            isOnHover={true}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        key={user?._id}
                                        onClick={() =>
                                            isNavigate
                                                ? navigate(
                                                      `/profile/${user._id}`
                                                  )
                                                : handleOnclickUser(user)
                                        }
                                    >
                                        <UserInfo
                                            userId={user?._id}
                                            avatar={user?.avatar}
                                            name={user?.name}
                                            username={user?.username}
                                            isVerified={user?.isVerified}
                                            isOnHover={true}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <>
                    {isFocused &&
                        searchResults.length === 0 &&
                        searchTerm.length > 0 && (
                            <div className={styles.searchResults}>
                                <p className={styles.searchMsg}>
                                    No result found for "{searchTerm}"
                                </p>
                            </div>
                        )}
                    {isFocused &&
                        searchTerm.length === 0 &&
                        searchResults.length === 0 && (
                            <div className={styles.searchResults}>
                                <p className={styles.searchMsg}>
                                    Searching for people, by their name or
                                    username
                                </p>
                            </div>
                        )}
                </>
                <FontAwesomeIcon icon={faSearch} />
            </div>
        </React.Fragment>
    );
};

export default SearchBar;
