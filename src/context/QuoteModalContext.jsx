import { createContext, useContext } from 'react';

export const QuoteModalContext = createContext({
  openModal: () => {},
  closeModal: () => {},
});

export const useQuoteModal = () => useContext(QuoteModalContext);
