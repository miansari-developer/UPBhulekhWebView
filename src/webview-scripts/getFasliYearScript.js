export const getFasliYearScript = (villageNameEnglish) => `
        return new Promise((resolve, reject) => {
          const tryClick = () => {
            const elements = [...document.querySelectorAll('.card-body div.table-responsive table td')];
            const target = elements.find(el => el.textContent.includes("${villageNameEnglish}"));
            if (target) {
              target.click();
              window.__ajaxResolvers.set('api/fasli', resolve);
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

          setTimeout(() => {
              if (window.__ajaxResolvers.has('api/fasli')) {
                  window.__ajaxResolvers.delete('api/fasli');
                  reject('Timeout waiting for AJAX response');
              }
          }, 10500);
        });
`;
//body > app-root > selection > div > div > div.card-body > div > div > div > div.table-responsive > table > tbody > tr:nth-child(1) > td