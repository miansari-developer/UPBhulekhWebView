export const authenticateScript = `
      return new Promise((resolve, reject) => {
        const tryClick = () => {
          const target = document.querySelector('.card-1');
          if (target) {
            target.click();
            window.__ajaxResolvers.set('api/authenticate', resolve);
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
            if (window.__ajaxResolvers.has('api/authenticate')) {
                window.__ajaxResolvers.delete('api/authenticate');
                reject('Timeout waiting for AJAX response');
            }
        }, 11500);
      });
`;
