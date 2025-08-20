
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Apartment } from '@/lib/interface';

interface ModalState {
  open: boolean;
  editMode: boolean;
  apartmentData: Apartment | undefined;
}

interface ApartmentModalContextType {
  modalState: ModalState;
  setModalState: (state: ModalState) => void;
  openAddModal: () => void;
  openEditModal: (apartment: Apartment) => void;
  closeModal: () => void;
}

const ApartmentModalContext = createContext<ApartmentModalContextType | undefined>(undefined);

export function ApartmentModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    editMode: false,
    apartmentData: undefined,
  });

  const openAddModal = () => {
    setModalState({
      open: true,
      editMode: false,
      apartmentData: undefined,
    });
  };

  const openEditModal = (apartment: Apartment) => {
    setModalState({
      open: true,
      editMode: true,
      apartmentData: apartment,
    });
  };

  const closeModal = () => {
    setModalState({
      open: false,
      editMode: false,
      apartmentData: undefined,
    });
  };

  return (
    <ApartmentModalContext.Provider value={{ modalState, setModalState, openAddModal, openEditModal, closeModal }}>
      {children}
    </ApartmentModalContext.Provider>
  );
}

export function useApartmentModal() {
  const context = useContext(ApartmentModalContext);
  if (!context) {
    throw new Error('useApartmentModal must be used within an ApartmentModalProvider');
  }
  return context;
}
