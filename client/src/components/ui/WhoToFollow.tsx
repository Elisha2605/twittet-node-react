import React from "react";
import Button, { ButtonSize, ButtonType } from "./Button";
import UserInfo from "./UserInfo";


import styles from "./WhoToFollow.module.css";

const WhoToFollow = () => {

const onFollow = () => {
    // DOTO
}

    return (
        <React.Fragment>
            <div className={styles.container}>
                <h2 className={styles.title}>Who to follow</h2>
                <div className={styles.userInfo}>
                    <UserInfo avatar={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"} 
                        firstname={"Aïcha"} 
                        username={"aicha4355"}
                    >
                    <Button value={'Follow'} type={ButtonType.secondary} size={ButtonSize.small}  onClick={onFollow} />    
                    </UserInfo>
                </div>
                <div className={styles.userInfo}>
                    <UserInfo avatar={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"} 
                        firstname={"Aïcha"} 
                        username={"aicha4355"}
                    >
                    <Button value={'Follow'} type={ButtonType.secondary} size={ButtonSize.small}  onClick={onFollow} />    
                    </UserInfo>
                </div>
                <div className={styles.userInfo}>
                    <UserInfo avatar={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"} 
                        firstname={"Aïcha"} 
                        username={"aicha4355"}
                    >
                    <Button value={'Follow'} type={ButtonType.secondary} size={ButtonSize.small}  onClick={onFollow} />    
                    </UserInfo>
                </div>
                <div className={styles.userInfo}>
                    <UserInfo avatar={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"} 
                        firstname={"Aïcha"} 
                        username={"aicha4355"}
                    >
                    <Button value={'Follow'} type={ButtonType.secondary} size={ButtonSize.small}  onClick={onFollow} />    
                    </UserInfo>
                </div>
            </div>
        </React.Fragment>
    )
}

export default WhoToFollow;