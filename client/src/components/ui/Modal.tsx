import React, { FC, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
    modalRef: React.RefObject<HTMLDivElement>
    isOpen: boolean;
    isOverlay?: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

const Modal: FC<ModalProps> = ({
    modalRef,
    isOpen,
    isOverlay = true,
    children,
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
                    {isOverlay && (
                        <div className={styles.overlay} ></div>
                    )}
                    <div className={styles.content} ref={modalRef}>
                        <button
                            className={styles.close}
                            onClick={handleClose}
                        >
                            X
                        </button>
                        {children}
                    </div>
                </div>
            ) : null}
        </React.Fragment>,
        document.getElementById('portal')!
    );
};

export default Modal;
