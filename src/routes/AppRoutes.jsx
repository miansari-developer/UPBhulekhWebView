import { Routes, Route } from 'react-router-dom';
import DistrictList from '../views/DistrictList';
import TehsilList from '../views/TehsilList';
import VillageList from '../views/VillageList';
import SearchForm from '../views/SearchForm';
import SearchResults from '../views/SearchResults';
import RecordDetail from '../views/RecordDetail';
import Layout from '../components/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/district/:districtCode/tehsil/:tehsilCode/village/:villageCode/detail" element={<RecordDetail />} />
      <Route path="*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<DistrictList />} />
            <Route path="/district/:districtCode/tehsils" element={<TehsilList />} />
            <Route path="/district/:districtCode/tehsil/:tehsilCode/villages" element={<VillageList />} />
            <Route path="/district/:districtCode/tehsil/:tehsilCode/village/:villageCode/search" element={<SearchForm />} />
            <Route path="/district/:districtCode/tehsil/:tehsilCode/village/:villageCode/results" element={<SearchResults />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
};

export default AppRoutes;
