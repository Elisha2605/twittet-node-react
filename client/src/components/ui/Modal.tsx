import React, { FC, useContext } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import XmarkIcon from '../icons/XmarkIcon';
import TwitterIcon from '../icons/TwitterIcon';
import { ModalContext } from '../../context/modal.context';

interface ModalProps {
    title?: string;
    modalName?: string;
    modalRef?: React.RefObject<HTMLDivElement>;
    isOpen?: boolean;
    isOverlay?: boolean;
    children: React.ReactNode;
    logo?: boolean;
    classNameContainer?: string
    classNameWrapper?: string;
}

const Modal: FC<ModalProps> = ({
    title,
    modalName,
    modalRef,
    isOpen,
    isOverlay = true,
    children,
    logo,
    classNameContainer,
    classNameWrapper,
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
                        <button className={styles.close} onClick={() => closeModal('')}>
                            <XmarkIcon size={'sm'} />
                        </button>
                    </div>
                </div>
            ) : null}
        </React.Fragment>,
        document.getElementById('portal')!
    );
};

export default Modal;