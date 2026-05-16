import { useState, useMemo, useRef } from 'react';
import districtsData from '../assets/districts.json';
import tehsilsData from '../assets/tehsils.json';
import { BhulekhService } from '../services/BhulekhService';

export const useBhulekhViewModel = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [villages, setVillages] = useState([]);
  const [fasliYearData, setFasliYearData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchBy, setSearchBy] = useState('khasra');
  const [searchValue, setSearchValue] = useState('1');
  const [searchResults, setSearchResults] = useState([]);
  const [detailHtml, setDetailHtml] = useState('');
  const [isSearchingResults, setIsSearchingResults] = useState(false);
  const [isFetchingVillages, setIsFetchingVillages] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimeout = useRef(null);

  const showToast = (message) => {
    setToast({ show: true, message });
    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }
    toastTimeout.current = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const [recentDistricts, setRecentDistricts] = useState(() => {
    const saved = localStorage.getItem('recent_districts');
    return saved ? JSON.parse(saved) : [];
  });

  // Memoized lists for performance and filtering
  const sortedDistricts = useMemo(() => {
    return [...districtsData].sort((a, b) =>
      a.district_name_english.localeCompare(b.district_name_english)
    );
  }, []);

  const filteredDistricts = useMemo(() => {
    let list = sortedDistricts;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      list = sortedDistricts.filter(d =>
        d.district_name.includes(lowerSearch) ||
        d.district_name_english.toLowerCase().includes(lowerSearch)
      );
    }

    const recentSet = new Set(recentDistricts);
    const recents = list.filter(d => recentSet.has(d.district_code_census))
      .sort((a, b) => {
        return recentDistricts.indexOf(a.district_code_census) - recentDistricts.indexOf(b.district_code_census);
      });
    const nonRecents = list.filter(d => !recentSet.has(d.district_code_census));

    return [...recents, ...nonRecents];
  }, [sortedDistricts, searchTerm, recentDistricts]);

  const currentTehsils = useMemo(() => {
    if (!selectedDistrict) return [];
    const tehsils = tehsilsData[selectedDistrict.district_code_census] || [];
    return [...tehsils].sort((a, b) =>
      a.tehsil_name_english.localeCompare(b.tehsil_name_english)
    );
  }, [selectedDistrict]);

  const filteredTehsils = useMemo(() => {
    if (!searchTerm) return currentTehsils;
    const lowerSearch = searchTerm.toLowerCase();
    return currentTehsils.filter(t =>
      t.tehsil_name.includes(lowerSearch) ||
      t.tehsil_name_english.toLowerCase().includes(lowerSearch)
    );
  }, [currentTehsils, searchTerm]);

  const [recentVillages, setRecentVillages] = useState(() => {
    const saved = localStorage.getItem('recent_villages');
    return saved ? JSON.parse(saved) : [];
  });

  const filteredVillages = useMemo(() => {
    let list = villages;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      list = villages.filter(v => {
        const nameEng = v.vname_eng || v.village_name_english || v.tname_eng || '';
        const nameHi = v.vname || v.village_name || v.tname || '';
        return nameEng.toLowerCase().includes(lowerSearch) || nameHi.includes(lowerSearch);
      });
    }

    const recentSet = new Set(recentVillages);
    const recents = list.filter(v => recentSet.has(v.village_code_census))
      .sort((a, b) => {
        return recentVillages.indexOf(a.village_code_census) - recentVillages.indexOf(b.village_code_census);
      });
    const nonRecents = list.filter(v => !recentSet.has(v.village_code_census));

    return [...recents, ...nonRecents];
  }, [villages, searchTerm, recentVillages]);

  // Actions
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);

    // Update recent districts
    const updatedRecents = [
      district.district_code_census,
      ...recentDistricts.filter(code => code !== district.district_code_census)
    ].slice(0, 10); // Keep top 10 recent

    setRecentDistricts(updatedRecents);
    localStorage.setItem('recent_districts', JSON.stringify(updatedRecents));

    setSelectedTehsil(null);
    setSelectedVillage(null);
    setVillages([]);
    setIsSearching(false);
    setSearchTerm('');
  };

  const handleTehsilSelect = async (tehsil) => {
    setSelectedTehsil(tehsil);
    setSelectedVillage(null);
    setVillages([]);
    setIsSearching(false);
    setSearchTerm('');

    const cacheKey = `village_${selectedDistrict.district_code_census}_${tehsil.tehsil_code_census}`;
    const cachedVillages = localStorage.getItem(cacheKey);

    if (cachedVillages) {
      try {
        setVillages(JSON.parse(cachedVillages));
        return;
      } catch (e) {
        console.error("Failed to parse cached villages", e);
        localStorage.removeItem(cacheKey);
      }
    }

    setIsFetchingVillages(true);
    try {
      const villageData = await BhulekhService.getVillages(
        selectedDistrict.district_code_census,
        tehsil.tehsil_code_census
      );
      setVillages(villageData);
      localStorage.setItem(cacheKey, JSON.stringify(villageData));
    } catch (e) {
      showToast("Error fetching villages");
    } finally {
      setIsFetchingVillages(false);
    }
  };

  const handleVillageSelect = async (village) => {
    setSelectedVillage(village);

    // Update recent villages
    const updatedRecents = [
      village.village_code_census,
      ...recentVillages.filter(code => code !== village.village_code_census)
    ].slice(0, 20); // Keep top 20 recent villages

    setRecentVillages(updatedRecents);
    localStorage.setItem('recent_villages', JSON.stringify(updatedRecents));

    setIsSearching(false);
    setSearchTerm('');
    setSearchBy('khasra');
    setSearchValue('');

    try {
      const fasliData = await BhulekhService.getFasliYears(
        selectedDistrict.district_code_census,
        selectedTehsil.tehsil_code_census,
        village.village_code_census
      );
      setFasliYearData(fasliData);
    } catch (e) {
      console.error("Error fetching fasli data", e);
    }
  };

  const uniqueByKhataKhasraUniqueCode = (list) => {
    const seen = new Set();

    return list.filter(item => {
      const key = JSON.stringify([
        (item.khataNumber || item.khata_number || item.khata_no || "").trim().toLowerCase(),
        (item.khasraNumber || item.khasra_no || item.khasra_number || "").trim().toLowerCase(),
        (item.uniqueCode || item.unique_code || "").trim().toLowerCase()
      ]);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  const performSearch = async () => {
    if (!searchValue) {
      showToast("कृपया अपना खसरा संख्या, खाता संख्या या नाम दर्ज करें");
      return false;
    }
    try {
      window.AndroidBridge.showInterstitial();
    } catch (e) {
      console.error("Error showing interstitial ad", e);
    }

    showToast("Searching...");
    setIsSearchingResults(true);
    setSearchResults([]);

    try {
      let results = [];
      if (searchBy === 'khasra') {
        results = await BhulekhService.searchByKhasra(
          selectedDistrict.district_code_census,
          selectedTehsil.tehsil_code_census,
          selectedVillage.village_code_census,
          searchValue
        );
      } else if (searchBy === 'khata') {
        results = await BhulekhService.searchByKhata(
          selectedDistrict.district_code_census,
          selectedTehsil.tehsil_code_census,
          selectedVillage.village_code_census,
          searchValue
        );
      } else {
        results = await BhulekhService.searchByName(
          selectedDistrict.district_code_census,
          selectedTehsil.tehsil_code_census,
          selectedVillage.village_code_census,
          searchValue
        );
      }
      setSearchResults(uniqueByKhataKhasraUniqueCode(results));
      return true;
    } catch (e) {
      showToast("खोज में त्रुटि हुई");
      return false;
    } finally {
      setIsSearchingResults(false);
    }
  };

  const viewDetail = async (item) => {
    const khasraNumber = item.khasraNumber || item.khasra_no || item.khasra_number;
    const khataNumber = item.khataNumber || item.khata_number || item.khata_no;
    const uniqueCode = item.uniqueCode || item.unique_code;

    showToast("विवरण लोड हो रहा है...");
    try {
      const html = await BhulekhService.generateHTMLRoR(
        selectedDistrict,
        selectedTehsil,
        selectedVillage,
        item,
        khasraNumber,
        khataNumber,
        uniqueCode,
        fasliYearData
      );

      if (html) {
        setDetailHtml(html);
        return true;
      } else {
        showToast("विवरण प्राप्त करने में विफल");
        return false;
      }
    } catch (error) {
      showToast("त्रुटि: विवरण प्राप्त नहीं किया जा सका");
      return false;
    }
  };

  const resetSelection = () => {
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedVillage(null);
    setVillages([]);
    setSearchTerm('');
    setIsSearching(false);
  };

  return {
    // State
    selectedDistrict,
    selectedTehsil,
    selectedVillage,
    villages,
    fasliYearData,
    searchTerm,
    isSearching,
    searchBy,
    searchValue,
    searchResults,
    detailHtml,
    isSearchingResults,
    isFetchingVillages,
    toast,

    // Computed
    filteredDistricts,
    filteredTehsils,
    filteredVillages,

    // Setters
    setSearchTerm,
    setIsSearching,
    setSearchBy,
    setSearchValue,

    // Actions
    handleDistrictSelect,
    handleTehsilSelect,
    handleVillageSelect,
    performSearch,
    viewDetail,
    resetSelection,
    showToast
  };
};
