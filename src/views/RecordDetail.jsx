import { useNavigate } from 'react-router-dom';
import { useBhulekh } from '../hooks/useBhulekh';

const RecordDetail = () => {
  const { detailHtml } = useBhulekh();
  const navigate = useNavigate();

  return (
    <div style={{ 
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
      </header>
      <iframe
        title="RoR Detail"
        srcDoc={detailHtml || "<html><body><h1 style='color:red'>No HTML Content Received</h1></body></html>"}
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          backgroundColor: 'white'
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default RecordDetail;
