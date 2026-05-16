import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBhulekh } from '../hooks/useBhulekh';

const SearchForm = () => {
  const { districtCode, tehsilCode, villageCode } = useParams();
  const {
    selectedVillage,
    searchBy,
    setSearchBy,
    searchValue,
    setSearchValue,
    performSearch
  } = useBhulekh();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedVillage) {
      navigate(`/district/${districtCode}/tehsil/${tehsilCode}/villages`);
    }
  }, [selectedVillage, navigate, districtCode, tehsilCode]);

  const onSearch = async () => {
    const success = await performSearch();
    if (success) {
      navigate(`/district/${districtCode}/tehsil/${tehsilCode}/village/${villageCode}/results`);
    }
  };

  return (
    <div className="search-form-container">
      <div className="search-form">
        <label className="form-label">फसली वर्ष</label>
        <select className="form-select">
          <option value="999">वर्तमान फसली</option>
        </select>

        <label className="form-label">खोज का विकल्प चुनें</label>
        <select className="form-select" value={searchBy} onChange={e => setSearchBy(e.target.value)}>
          <option value="khasra">खसरा संख्या से</option>
          <option value="khata">खाता संख्या से</option>
          <option value="name">खातेदार के नाम से</option>
        </select>

        <label className="form-label">
          {searchBy === 'khasra' ? 'खसरा संख्या' : searchBy === 'khata' ? 'खाता संख्या' : 'खातेदार का नाम'}
        </label>
        <input
          className="form-input"
          type={`${searchBy === 'khasra' ? 'number' : searchBy === 'khata' ? 'number' : 'text'}`}
          placeholder={`${searchBy === 'khasra' ? 'खसरा संख्या' : searchBy === 'khata' ? 'खाता संख्या' : 'खातेदार का नाम'} दर्ज करें`}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          required
        />

        <button
          className="submit-button"
          onClick={onSearch}
        >
          खोजें
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
