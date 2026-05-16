import { createContext, useContext } from 'react';
import { useBhulekhViewModel } from '../viewmodels/useBhulekhViewModel';

const BhulekhContext = createContext(null);

export const BhulekhProvider = ({ children }) => {
  const viewModel = useBhulekhViewModel();
  return (
    <BhulekhContext.Provider value={viewModel}>
      {children}
    </BhulekhContext.Provider>
  );
};

export const useBhulekh = () => {
  const context = useContext(BhulekhContext);
  if (!context) {
    throw new Error('useBhulekh must be used within a BhulekhProvider');
  }
  return context;
};
