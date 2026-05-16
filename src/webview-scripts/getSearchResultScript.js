
export const getSearchResultScript = (searchUrl, searchByCssSelector) => `
    return new Promise((resolve, reject) => {
        const target_button = document.querySelector("${searchByCssSelector} ~ div button.btn-primary");
        if (target_button) {
        target_button.click();
        window.__ajaxResolvers.set("${searchUrl}", resolve);
        }
        
        setTimeout(() => {
            if (window.__ajaxResolvers.has("${searchUrl}")) {
                window.__ajaxResolvers.delete("${searchUrl}");
                reject('Timeout waiting for AJAX response');
            }
        }, 10500);
    });
`;
