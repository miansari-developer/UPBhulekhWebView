import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBhulekh } from '../hooks/useBhulekh';
import { ChevronRightIcon } from '../components/Layout';

const VillageList = () => {
  const { districtCode, tehsilCode } = useParams();
  const {
    filteredVillages,
    handleVillageSelect,
    selectedTehsil,
    isFetchingVillages,
    searchTerm
  } = useBhulekh();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedTehsil) {
      navigate(`/district/${districtCode}/tehsils`);
    }
  }, [selectedTehsil, navigate, districtCode]);

  const onVillageClick = (village) => {
    handleVillageSelect(village);
    navigate(`/district/${districtCode}/tehsil/${tehsilCode}/village/${village.village_code_census}/search`);
  };

  return (
    <>
      {filteredVillages.map((village, index) => {
        const nameHi = village.vname || village.village_name || '';
        const key = village.vcode || village.village_code_census || index;
        return (
          <div key={key}>
            <div className="list-item" onClick={() => onVillageClick(village)}>
              <div className="serial-number">{index + 1}</div>
              <div className="item-text">
                <span className="primary-text">{nameHi}</span>
                <span className="secondary-text">{key} ({village.pname})</span>
              </div>
              <ChevronRightIcon />
            </div>
            {index < filteredVillages.length - 1 && <div className="list-divider"></div>}
          </div>
        );
      })}
      {filteredVillages.length === 0 && (
        <div className="empty-state" style={{ height: '300px' }}>
          {isFetchingVillages ? (
            <div className="loading-container" style={{ padding: 0 }}>
              <div className="spinner"></div>
              <p>गाँव लोड हो रहे हैं...</p>
            </div>
          ) : (
            `"${searchTerm}" से मेल खाने वाले कोई गाँव नहीं मिले`
          )}
        </div>
      )}
    </>
  );
};

export default VillageList;
