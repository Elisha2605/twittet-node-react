import React, { FC, useContext, useEffect, useRef, useState } from 'react';
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
}

const Modal: FC<ModalProps> = ({
    title,
    modalName,
    modalRef,
    isOpen,
    isOverlay = true,
    children,
    logo,
}) => {

    const { modalOpen, closeModal, modalName: currentModal } = useContext(ModalContext);

    if (modalName && currentModal !== modalName) {
        return null;
    }

    return ReactDOM.createPortal(
        <React.Fragment>
            {modalOpen ? (
                <div className={styles.container}>
                    {isOverlay && <div className={styles.overlay} onClick={() => closeModal(modalName || '')}></div>}
                    <div className={styles.content} ref={modalRef}>
                        <div className={styles.wrapper}>
                            {logo && (
                                <TwitterIcon
                                    size={'2xl'}
                                    color={'var(--color-primary)'}
                                />
                            )}
                            <h1>{title}</h1>
                            {children}
                        </div>
                        <button className={styles.close} onClick={() => closeModal(modalName || '')}>
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