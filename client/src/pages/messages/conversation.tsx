import React, { useEffect } from 'react';
import styles from './conversation.module.css';

interface ConversationProps {
    otherUser: any;
    conversation: any;
}

const Conversation: React.FC<ConversationProps> = ({ conversation, otherUser }) => {
    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.conversationWrapper}>
                    {conversation?.sender !== otherUser?._id ? (
                        <div className={styles.authUser}>
                            {conversation?.text}
                        </div>
                    ):
                        <div className={styles.otherUser}>
                            <p>
                                {conversation?.text} 
                            </p>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

export default Conversation;
