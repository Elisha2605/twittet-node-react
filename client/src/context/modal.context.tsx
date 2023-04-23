import React, { createContext, useState, ReactNode } from 'react';

interface ModalContextType {
    modalOpen: boolean;
    openModal: (modalName: string) => void;
    closeModal: (modalName: string) => void;
    modalName?: string;
}

export const ModalContext = createContext<ModalContextType>({
    modalOpen: false,
    openModal: () => {},
    closeModal: () => {},
});

export const ModalProvider: React.FC<{
    modalName?: string;
    children: ReactNode;
}> = ({ children }) => {


    const [modalOpen, setModalOpen] = useState(false);
    const [currentModal, setCurrentModal] = useState('');

    const openModal = (modalName: string) => {
        setModalOpen(true);
        setCurrentModal(modalName);
    };

    const closeModal = (modalName: string) => {
        setModalOpen(false);
        setCurrentModal('');
    };

    return (
        <ModalContext.Provider
          value={{ modalOpen, openModal, closeModal, modalName: currentModal }}
        >
          {children}
        </ModalContext.Provider>
      );
};