import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBhulekh } from '../hooks/useBhulekh';
import { ChevronRightIcon } from '../components/Layout';
import districtsData from '../assets/districts.json';

const TehsilList = () => {
  const { districtCode } = useParams();
  const { filteredTehsils, handleTehsilSelect, handleDistrictSelect, selectedDistrict, searchTerm } = useBhulekh();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedDistrict) {
      const district = districtsData.find(d => d.district_code_census === districtCode);
      if (district) {
        handleDistrictSelect(district);
      } else {
        navigate('/');
      }
    }
  }, [districtCode, selectedDistrict, handleDistrictSelect, navigate]);

  const onTehsilClick = (tehsil) => {
    handleTehsilSelect(tehsil);
    navigate(`/district/${districtCode}/tehsil/${tehsil.tehsil_code_census}/villages`);
  };

  return (
    <>
      {filteredTehsils.map((tehsil, index) => (
        <div key={tehsil.tehsil_code_census}>
          <div className="list-item" onClick={() => onTehsilClick(tehsil)}>
            <div className="serial-number">{index + 1}</div>
            <div className="item-text">
              <span className="primary-text">{tehsil.tehsil_name}</span>
              <span className="secondary-text">{tehsil.tehsil_code_census} - {tehsil.tehsil_name_english}</span>
            </div>
            <ChevronRightIcon />
          </div>
          {index < filteredTehsils.length - 1 && <div className="list-divider"></div>}
        </div>
      ))}
      {filteredTehsils.length === 0 && (
        <div className="empty-state">"{searchTerm}" से मेल खाने वाली कोई तहसील नहीं मिली </div>
      )}
    </>
  );
};

export default TehsilList;
