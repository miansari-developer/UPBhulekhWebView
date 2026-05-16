class WebViewBridgeService {
  constructor() {
    this.webViewBReady = false;
    this.requestQueue = [];
    this.pending = new Map();

    this.registerGlobalHandlers();
  }

  uuid() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Fallback (RFC 4122 v4 compliant)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Registers global functions required by Android WebView
   */
  registerGlobalHandlers() {
    // Called by WebView-B when ready
    window.__onWebViewBReady = () => {
      console.log('✅ WebView-B is ready');
      this.webViewBReady = true;

      while (this.requestQueue.length) {
        const task = this.requestQueue.shift();
        if (task) task();
      }
    };

    // Called by Android with RPC response
    window.__onAndroidResponse = (raw) => {
      try {
        const msg = JSON.parse(raw);
        const resolver = this.pending.get(msg.responseId);
        if (!resolver) return;

        this.pending.delete(msg.responseId);

        if (msg.success) {
          console.log(`✅ Success: onAndroidResponse -->\n${JSON.stringify(msg, null, 2)}`);
          resolver.resolve(msg.result);
        } else {
          console.log(`❌ Failed: onAndroidResponse -->\n${JSON.stringify(msg, null, 2)}`);
          resolver.reject(msg.error);
        }
      } catch (err) {
        console.error('❌ Failed to parse onAndroidResponse:', err, 'Raw:', raw);
      }
    };
  }

  /**
   * Execute JavaScript inside WebView-B
   */
  executeInWebViewB(code) {
    console.log(`📌 Code pushed in requestQueue -->\n${code}`);

    return new Promise((resolve, reject) => {
      const requestId = this.uuid();

      const task = () => {
        this.pending.set(requestId, { resolve, reject });

        if (window.AndroidBridge && window.AndroidBridge.postMessage) {
          window.AndroidBridge.postMessage(
            JSON.stringify({
              type: 'EXECUTE_JS',
              requestId,
              payload: { code },
            })
          );
        } else {
          console.warn('⚠️ AndroidBridge is not available on window. Cannot post message.');
        }
      };

      if (this.webViewBReady) {
        task();
      } else {
        this.requestQueue.push(task);
      }
    });
  }
}

// Create a singleton instance and export it
const webViewBridge = new WebViewBridgeService();
export default webViewBridge;
