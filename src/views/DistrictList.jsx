import { useNavigate } from 'react-router-dom';
import { useBhulekh } from '../hooks/useBhulekh';
import { ChevronRightIcon } from '../components/Layout';

const DistrictList = () => {
  const { filteredDistricts, handleDistrictSelect, searchTerm } = useBhulekh();
  const navigate = useNavigate();

  const onDistrictClick = (district) => {
    navigate(`/district/${district.district_code_census}/tehsils`);
    handleDistrictSelect(district);
  };

  return (
    <>
      {filteredDistricts.map((district, index) => (
        <div key={district.district_code_census}>
          <div
            className="list-item"
            onClick={() => onDistrictClick(district)}
          >
            <div className="serial-number">{index + 1}</div>
            <div className="item-text">
              <span className="primary-text">{district.district_name}</span>
              <span className="secondary-text">{district.district_code_census} - {district.district_name_english}</span>
            </div>
            <ChevronRightIcon />
          </div>
          {index < filteredDistricts.length - 1 && <div className="list-divider"></div>}
        </div>
      ))}
      {filteredDistricts.length === 0 && (
        <div className="empty-state">No districts found matching "{searchTerm}"</div>
      )}
    </>
  );
};

export default DistrictList;
