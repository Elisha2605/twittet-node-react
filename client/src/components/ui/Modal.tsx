import React, { FC, useContext } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import XmarkIcon from '../icons/XmarkIcon';
import TwitterIcon from '../icons/TwitterIcon';
import { ModalContext } from '../../context/modal.context';
import Button, { ButtonSize, ButtonType } from './Button';

interface ModalProps {
    title?: string;
    smallTitle?: string;
    modalName?: string;
    modalRef?: React.RefObject<HTMLDivElement>;
    isOpen?: boolean;
    isXmarkLeft?: boolean;
    isCustomeHeader?: boolean;
    isOverlay?: boolean;
    children: React.ReactNode;
    logo?: boolean;
    classNameContainer?: string
    classNameWrapper?: string;
}

const Modal: FC<ModalProps> = ({
    title,
    smallTitle,
    modalName,
    modalRef,
    isOpen,
    isOverlay = true,
    children,
    logo,
    classNameContainer,
    classNameWrapper,
    isXmarkLeft = false,
    isCustomeHeader = false,
}) => {

    const { modalOpen, closeModal, modalName: currentModal } = useContext(ModalContext);

    if (modalName && currentModal !== modalName) {
        return null;
    }

    return ReactDOM.createPortal(
        <React.Fragment>
            {modalOpen ? (
                <div className={`${styles.container}`}>
                    {isOverlay && <div className={styles.overlay} onClick={() => closeModal('')}></div>}
                    <div className={`${styles.content} ${classNameContainer}`} ref={modalRef}>
                        <div className={`${styles.wrapper} ${classNameWrapper}`}>
                            {logo && (
                                <TwitterIcon
                                    size={'2xl'}
                                    color={'var(--color-primary)'}
                                />
                            )}
                            <h1>{title}</h1>
                            {children}
                        </div>
                        
                        {isXmarkLeft ? (
                            <div className={styles.closeLeftSide}>
                                <XmarkIcon size={'sm'} />
                                <div className={styles.titleAndBtnWrapper}>
                                    <h5>{smallTitle}</h5>
                                    <Button 
                                        value={'Save'}
                                        type={ButtonType.secondary}
                                        size={ButtonSize.small}
                                        onClick={() => {}}
                                        className={styles.button}
                                    />
                                </div>
                            </div>
                        ): (isCustomeHeader) ? (
                            <></>
                        ) : (
                            <div className={styles.closeRightSide} onClick={() => closeModal('')}>
                                <XmarkIcon size={'sm'} />
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </React.Fragment>,
        document.getElementById('portal')!
    );
};

export default Modal;