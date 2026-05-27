import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBhulekh } from '../hooks/useBhulekh';

const RecordDetail = () => {
  const {
    selectedDistrict,
    selectedTehsil,
    selectedVillage,
  } = useBhulekh();
  const { detailHtml, showToast } = useBhulekh();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1.0);
  const iframeRef = useRef(null);
  const zoomRef = useRef(zoom);

  const handlePrint = () => {
    try {
      const bridge = window.AndroidBridge;
      if (bridge && typeof bridge.postMessage === 'function') {
        bridge.postMessage(
          JSON.stringify({
            type: 'PRINT',
            payload: { html: detailHtml }
          })
        );
        return;
      }
      window.print();
    } catch (e) {
      console.error('Error triggering print:', e);
      if (showToast) {
        showToast('प्रिंट करने में त्रुटि हुई');
      } else {
        alert('प्रिंट करने में त्रुटि हुई');
      }
    }
  };

  const handlePrintPDF = async () => {
    const filename = `${selectedVillage.vname}-${selectedTehsil.tehsil_name}-${selectedDistrict.district_name}___${Date.now()}.pdf`;
    try {
      const bridge = window.AndroidBridge;
      if (bridge && typeof bridge.postMessage === 'function') {
        bridge.postMessage(
          JSON.stringify({
            type: 'PRINT_PDF',
            payload: { html: detailHtml, filename }
          })
        );
      }
    } catch (e) {
      console.error('Error triggering download as pdf:', e);
      console.log('download Error');
    }
  };

  // Keep zoomRef up-to-date
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // Apply zoom style inside the iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const applyZoom = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc && doc.body) {
          doc.body.style.zoom = zoom;
          doc.body.style.webkitOverflowScrolling = 'touch';
          doc.documentElement.style.touchAction = 'pan-x pan-y';
        }
      } catch (e) {
        console.error('Error applying zoom style:', e);
      }
    };

    applyZoom();

    const handleLoad = () => {
      applyZoom();
    };

    iframe.addEventListener('load', handleLoad);
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [zoom, detailHtml]);

  // Set up pinch touch gesture listeners inside the iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let startDist = 0;
    let startZoom = 1.0;
    let lastTap = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        startDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        startZoom = zoomRef.current;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && startDist > 0) {
        // Prevent default browser scaling behavior
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / startDist;
        const targetZoom = startZoom * factor;
        const nextZoom = Math.min(Math.max(targetZoom, 0.5), 3.0);
        setZoom(Math.round(nextZoom * 100) / 100);
      }
    };

    const handleTouchEnd = (e) => {
      startDist = 0;

      // Optional: Double tap to reset zoom to 1.0
      if (e.touches.length === 0 && e.changedTouches.length === 1) {
        const now = Date.now();
        if (now - lastTap < 300) {
          setZoom(1.0);
        }
        lastTap = now;
      }
    };

    const setupTouchListeners = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.removeEventListener('touchstart', handleTouchStart);
          doc.removeEventListener('touchmove', handleTouchMove);
          doc.removeEventListener('touchend', handleTouchEnd);

          doc.addEventListener('touchstart', handleTouchStart, { passive: false });
          doc.addEventListener('touchmove', handleTouchMove, { passive: false });
          doc.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
      } catch (e) {
        console.error('Error setting up touch listeners inside iframe:', e);
      }
    };

    setupTouchListeners();
    iframe.addEventListener('load', setupTouchListeners);

    return () => {
      iframe.removeEventListener('load', setupTouchListeners);
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.removeEventListener('touchstart', handleTouchStart);
          doc.removeEventListener('touchmove', handleTouchMove);
          doc.removeEventListener('touchend', handleTouchEnd);
        }
      } catch {
        // Ignore
      }
    };
  }, [detailHtml]);

  return (
    <div className="record-detail-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--md-sys-color-surface)',
      zIndex: 100,
      overflow: 'hidden'
    }}>
      <header className="app-bar" style={{ flexShrink: 0 }}>
        <button className="icon-button" onClick={() => navigate(-1)} aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <h1 className="app-title">भू-अभिलेख विवरण</h1>
        <button className="icon-button" onClick={handlePrint} aria-label="Print" title="प्रिंट">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
          </svg>
        </button>
        <button className="icon-button" onClick={handlePrintPDF} aria-label="Print PDF" title=" प्रिंट पीडीएफ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 16l4-5h-3V4h-2v7H8l4 5zm-7 2v2h14v-2H5z" />
          </svg>
        </button>
      </header>
      <iframe
        ref={iframeRef}
        title="RoR Detail"
        srcDoc={detailHtml || "<html><body><h1 style='color:red'>No HTML Content Received</h1></body></html>"}
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          backgroundColor: 'white'
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
};

export default RecordDetail;
