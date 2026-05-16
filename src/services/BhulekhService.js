import webViewBridge from '../WebViewBridge';

export const BhulekhService = {
  getVillages: async (districtCode, tehsilCode) => {
    const villageData = await webViewBridge.executeInWebViewB(
      `return await getVillages("${districtCode}","${tehsilCode}")`
    );
    let parsed = villageData;
    if (typeof villageData === 'string') {
      try {
        parsed = JSON.parse(villageData);
      } catch (e) {
        console.error("Failed to parse villages response", e);
        return [];
      }
    }
    return Array.isArray(parsed) ? parsed : (parsed?.data || []);
  },

  getFasliYears: async (districtCode, tehsilCode, villageCode) => {
    const fasliData = await webViewBridge.executeInWebViewB(
      `return await getFasliYears("${districtCode}","${tehsilCode}","${villageCode}")`
    );
    let parsed = fasliData;
    if (typeof fasliData === 'string') {
      try {
        parsed = JSON.parse(fasliData);
      } catch (e) {
        console.error("Failed to parse fasli data", e);
        return [];
      }
    }
    return parsed;
  },

  searchByKhasra: async (districtCode, tehsilCode, villageCode, searchValue) => {
    const result = await webViewBridge.executeInWebViewB(
      `return await getKhasraSearchResult("${districtCode}","${tehsilCode}","${villageCode}","${searchValue}")`
    );
    return BhulekhService.parseSearchResult(result);
  },

  searchByKhata: async (districtCode, tehsilCode, villageCode, searchValue) => {
    const result = await webViewBridge.executeInWebViewB(
      `return await getKhataSearchResult("${districtCode}","${tehsilCode}","${villageCode}","${searchValue}")`
    );
    return BhulekhService.parseSearchResult(result);
  },

  searchByName: async (districtCode, tehsilCode, villageCode, searchValue) => {
    const result = await webViewBridge.executeInWebViewB(
      `return await getNameSearchResult("${districtCode}","${tehsilCode}","${villageCode}","${searchValue}")`
    );
    return BhulekhService.parseSearchResult(result);
  },

  parseSearchResult: (result) => {
    try {
      let parsed = result;
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
    } catch (e) {
      console.error("Failed to parse search result", e);
      return [];
    }
  },

  generateHTMLRoR: async (district, tehsil, village, searchResult, khasraNumber, khataNumber, uniqueCode, fasliYearData) => {
    const districtStr = JSON.stringify(district);
    const tehsilStr = JSON.stringify(tehsil);
    const villageStr = JSON.stringify(village);
    const searchResultStr = JSON.stringify(searchResult);
    const fasliYearDataStr = JSON.stringify(fasliYearData);

    return await webViewBridge.executeInWebViewB(
      `return await generateHTMLRoRString(${districtStr},${tehsilStr},${villageStr},${searchResultStr},"${khasraNumber}","${khataNumber}","${uniqueCode}",${fasliYearDataStr})`
    );
  }
};
