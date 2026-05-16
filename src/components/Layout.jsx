import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBhulekh } from '../hooks/useBhulekh';

// SVG Icons
export const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

export const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

export const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

export const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
  </svg>
);

export const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

export const MoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const {
    isSearching,
    setIsSearching,
    searchTerm,
    setSearchTerm,
    selectedDistrict,
    selectedTehsil,
    selectedVillage,
    toast,
    clearHistory
  } = useBhulekh();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  const handleBack = () => {
    if (isSearching) {
      setIsSearching(false);
      setSearchTerm('');
    } else {
      navigate(-1);
    }
  };

  const getTitle = () => {
    if (location.pathname.includes('/detail')) return 'भूमि खतौनी';
    if (location.pathname.includes('/results')) return 'खोज परिणाम';
    if (selectedVillage && location.pathname.includes('/search')) return 'भूमि खतौनी';
    if (selectedTehsil && location.pathname.includes('/villages')) return 'ग्राम चुनें';
    if (selectedDistrict && location.pathname.includes('/tehsils')) return 'तहसील चुनें';
    return 'उत्तर प्रदेश भूमि रिकॉर्ड';
  };

  const getSubTitle = () => {
    if (location.pathname.includes('/detail')) return `${selectedDistrict.district_name} » ${selectedTehsil.tehsil_name} » ${selectedVillage.vname}`;
    if (location.pathname.includes('/results')) return 'भूमि खतौनी';
    if (selectedVillage && location.pathname.includes('/search')) return `${selectedDistrict.district_name} » ${selectedTehsil.tehsil_name} » ${selectedVillage.vname}`;
    if (selectedTehsil && location.pathname.includes('/villages')) return `${selectedDistrict.district_name} » ${selectedTehsil.tehsil_name} » ग्राम चुनें`;
    if (selectedDistrict && location.pathname.includes('/tehsils')) return `${selectedDistrict.district_name} » तहसील चुनें`;
    return 'जिला चुनें';
  };

  const getPlaceholder = () => {
    if (location.pathname.includes('/villages')) return "ग्राम खोजें...";
    if (location.pathname.includes('/tehsils')) return "तहसील खोजें...";
    return "जिला खोजें...";
  };

  const showSearchIcon = !isSearching && !location.pathname.includes('/search') && !location.pathname.includes('/results');
  const showBackIcon = location.pathname !== '/' || isSearching;

  return (
    <div className="android-app-container">
      <header className={`app-bar ${isSearching ? 'searching' : ''}`}>
        {isSearching ? (
          <>
            <button className="icon-button" onClick={handleBack} aria-label="Go back">
              <BackIcon />
            </button>
            <input
              autoFocus
              className="search-input"
              placeholder={getPlaceholder()}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="icon-button" onClick={() => setSearchTerm('')} aria-label="Clear search">
                <CloseIcon />
              </button>
            )}
          </>
        ) : (
          <>
            {showBackIcon && (
              <button className="icon-button" onClick={handleBack} aria-label="Go back">
                <BackIcon />
              </button>
            )}
            <h1 className="app-title" style={{ marginLeft: showBackIcon ? '0' : '16px', marginBottom: '0', paddingBottom: '0' }}>
              {getTitle()}<span style={{ fontSize: '0.9rem', marginTop: '0', display: 'block' }}>{getSubTitle()}</span>
            </h1>
            {showSearchIcon && (
              <button className="icon-button" onClick={() => setIsSearching(true)} aria-label="Search">
                <SearchIcon />
              </button>
            )}
            {location.pathname === '/' && !isSearching && (
              <div className="menu-container" ref={menuRef}>
                <button className="icon-button" onClick={() => setShowMenu(!showMenu)} aria-label="More options">
                  <MoreIcon />
                </button>
                {showMenu && (
                  <div className="dropdown-menu">
                    <button className="menu-item" onClick={() => {
                      setShowMenu(false);
                      if (window.confirm("Are you sure you want to clear history and cache?")) {
                        clearHistory();
                      }
                    }}>
                      <DeleteIcon />
                      <span>Clear History</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </header>

      <main className="list-container">
        {children}
      </main>

      {toast.show && (
        <div className="toast-message">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Layout;
