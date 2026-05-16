export const getTehsilsScript = (districtNameEnglish) => `
        return new Promise((resolve, reject) => {
          const tryClick = () => {
            const elements = [...document.querySelectorAll('.card-body div:nth-child(1) table td')];
            const target = elements.find(el => el.textContent.includes("${districtNameEnglish}"));
            if (target) {
              target.click();
              window.__ajaxResolvers.set('api/tehsils', resolve);
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
              if (window.__ajaxResolvers.has('api/tehsils')) {
                  window.__ajaxResolvers.delete('api/tehsils');
                  reject('Timeout waiting for AJAX response');
              }
          }, 10500);
        });
`;
