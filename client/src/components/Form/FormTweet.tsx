import { faCalendar, faFaceSmileWink, faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, useRef, useState } from "react";
import useAutosizeTextArea from "../../hooks/useAutosizeTextArea";
import Button, { ButtonSize, ButtonType } from "../ui/Button";
import styles from "./FormTweet.module.css";


interface FormProps {
    
}

const FormTweet: FC<FormProps> = ({

}) => {

    const onClickHanlder = () => {
        // TODO: You should remove this function on the main component
    }
    
    const [value, setValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useAutosizeTextArea(textAreaRef.current, value);

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;
    
        setValue(val);
    };

    return (
        <React.Fragment>
            <form action="" className={styles.container}>
                <textarea className={styles.textarea}
                    id="review-text"
                    onChange={handleChange}
                    placeholder="What's happening?"
                    ref={textAreaRef}
                    rows={1}
                    value={value}
                />
                <div className={styles.footer}>
                    <div className={styles.icons}>
                        <FontAwesomeIcon 
                            icon={faImage}
                            color={'var(--color-primary)'}
                        />
                        <FontAwesomeIcon 
                            icon={faFaceSmileWink}
                            color={'var(--color-primary)'}
                        />
                        <FontAwesomeIcon 
                            icon={faCalendar}
                            color={'var(--color-primary)'}
                        />
                    </div>
                    <Button value={'Tweet'} type={ButtonType.primary} size={ButtonSize.small} onClick={onClickHanlder}  />
                </div>
            </form>
        </React.Fragment>
    )
}

export default FormTweet;