import React, { FC, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import XmarkIcon from '../icons/XmarkIcon';
import TwitterIcon from '../icons/TwitterIcon';

interface ModalProps {
    title?: string;
    modalRef: React.RefObject<HTMLDivElement>;
    isOpen: boolean;
    isOverlay?: boolean;
    children: React.ReactNode;
    logo?: boolean;
    onClose: () => void;
}

const Modal: FC<ModalProps> = ({
    title,
    modalRef,
    isOpen,
    isOverlay = true,
    children,
    logo,
    onClose,
}) => {
    const [modalOpen, setModalOpen] = useState(isOpen);

    useEffect(() => {
        setModalOpen(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setModalOpen(false);
        onClose();
    };

    return ReactDOM.createPortal(
        <React.Fragment>
            {modalOpen ? (
                <div className={styles.container}>
                    {isOverlay && <div className={styles.overlay}></div>}
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
                        <button className={styles.close} onClick={handleClose}>
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
