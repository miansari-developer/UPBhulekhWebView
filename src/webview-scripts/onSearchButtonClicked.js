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

