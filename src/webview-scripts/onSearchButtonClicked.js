export const onSearchButtonClickedScript = (searchByCssSelector, searchValue) => `
return new Promise(async (resolve, reject) => {
    const tryClick = () => {
    const target = document.querySelector('${searchByCssSelector}');
    if (target) {
        target.click();
        return true;
    }
    return false;
    };

    if (!tryClick()) {
    const interval = setInterval(() => {
        if (tryClick()) {
        clearInterval(interval);
        }
    }, 100);
    setTimeout(() => clearInterval(interval), 10000);
    }

    //add delay of 1 second
    await new Promise(resolve => setTimeout(resolve, 500));

    const target_input = document.querySelector("${searchByCssSelector} ~ div input");
    if (target_input) {
        target_input.value = "${searchValue}";
        target_input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    //add delay of 1 second
    await new Promise(resolve => setTimeout(resolve, 500));
    resolve("success");
});
`;


// async function getKhatauniData2() {
//     let a = await getKhatauniData("137", "00729", "117550", "00001", "1175500211200112");
//     log(JSON.stringify(a));
// }

// async function getKhataSearchResult2() {
//     let a = await getKhataSearchResult("137", "00729", "117550", "1");
//     log(JSON.stringify(a));
// }

// async function getFasliYears2() {
//     let a = await getFasliYears("137", "00729", "117550");
//     log(JSON.stringify(a));
// }

// async function getVillages2() {
//     let a = await getVillages("137", "00729");
//     log(JSON.stringify(a));
// }