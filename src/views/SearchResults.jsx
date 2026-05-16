import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBhulekh } from '../hooks/useBhulekh';

const SearchResults = () => {
  const { districtCode, tehsilCode, villageCode } = useParams();
  const {
    isSearchingResults,
    searchResults,
    viewDetail,
    selectedVillage
  } = useBhulekh();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedVillage) {
      navigate(`/district/${districtCode}/tehsil/${tehsilCode}/village/${villageCode}/search`);
    }
  }, [selectedVillage, navigate, districtCode, tehsilCode, villageCode]);

  const onResultClick = async (result) => {
    const success = await viewDetail(result);
    if (success) {
      navigate(`/district/${districtCode}/tehsil/${tehsilCode}/village/${villageCode}/detail`);
    }
  };

  return (
    <div className="results-container" style={{ padding: '8px 16px' }}>
      {isSearchingResults ? (
        <div className="empty-state" style={{ height: '300px' }}>
          <div className="loading-container" style={{ padding: 0 }}>
            <div className="spinner"></div>
            <p>खोज की जा रही है...</p>
          </div>
        </div>
      ) : searchResults.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--md-sys-color-on-surface-variant)' }}>
          कोई परिणाम नहीं मिला
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {searchResults.map((result, index) => {
            if (!result) return null;
            return (
              <div key={index} className="result-card" onClick={() => onResultClick(result)}>
                {result.name && (<div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--md-sys-color-outline-variant)', borderRadius: '12px 12px 0 0', backgroundColor: 'var(--md-sys-color-primary-container)' }}>
                  <div className="serial-number" style={{ marginRight: '12px', width: '28px', height: '28px', fontSize: '12px', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)' }}>{index + 1}</div>
                  <h3 className="result-name" style={{ margin: 0, color: 'var(--md-sys-color-on-primary-container)' }}>
                    {result.name}
                    {result.father && <span className="result-father"> s/o {result.father}</span>}
                  </h3>
                </div>)}

                <div className="result-details">
                  <div className="detail-item">
                    <span className="detail-label">खाता संख्या</span>
                    <span className="detail-value">{result.khata_number || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">खसरा संख्या</span>
                    <span className="detail-value">{result.khasra_no || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">क्षेत्रफल (हे०)</span>
                    <span className="detail-value">{result.area || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">यूनिक कोड</span>
                    <span className="detail-value">{result.unique_code || 'N/A'}</span>
                  </div>
                  {result.land_type && (
                    <div className="detail-item">
                      <span className="detail-label">भूमि का प्रकार</span>
                      <span className="detail-value">{result.land_type}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
