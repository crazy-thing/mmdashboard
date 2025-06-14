import React, { useEffect, useState } from 'react';
import '../styles/ScreenshotViewer.scss';
import { deleteIcon, trash2 } from '../assets/exports';
import { deleteScreenshot } from '../util/api.ts';

interface ScreenshotViewerProps {
    onClose: () => void
}

const ScreenshotViewer: React.FC<ScreenshotViewerProps> = ({ onClose }) => {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchScreenshots() {
    try {
    const response = await fetch(`${import.meta.env.VITE_IP}/screenshots`);
    if (!response.ok) throw new Error('Failed to fetch screenshots list');
    const files = await response.json();
    console.log('Fetched files:', files);
    setScreenshots(files.screenshots || []);
    setLoading(false);
    } catch (error) {
    console.error('Error loading screenshots:', error);
    setLoading(false);
    }
    }
  useEffect(() => {

    fetchScreenshots();
  }, []);

  const prev = (e: any) => {
    e.stopPropagation();
    setCurrentIndex(i => (i === 0 ? screenshots.length - 1 : i - 1));
  };

  const next = (e: any) => {
    e.stopPropagation();
    setCurrentIndex(i => (i === screenshots.length - 1 ? 0 : i + 1));
  };

  const handleDelete = async (e: any, filename: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this screenshot?')) return;
    try {
        await deleteScreenshot(filename, `${import.meta.env.VITE_IP}`, localStorage.getItem('apiKey') as string);
        await fetchScreenshots(); 
    } catch (error) {
        console.error('Error deleting screenshot:', error);
    }
}

  if (loading) return <div className="screenshot-viewer">Loading screenshots...</div>;

  if (screenshots.length === 0) return <div className="screenshot-viewer" onClick={onClose}>No screenshots found.</div>;

  return (
    <div className="screenshot-viewer" onClick={onClose}>
      <div className="viewer-main">
        <button onClick={prev} aria-label="Previous Screenshot" className="nav-button">‹</button>
        <div className='image-container'>
        <img
          className="main-image"
          src={`${import.meta.env.VITE_UPLOADS}screenshots/${screenshots[currentIndex]}`}
          alt={`Screenshot ${currentIndex + 1}`}
          loading="lazy"
          onClick={(e) => e.stopPropagation()}
        />
        <img className='main-delete' src={trash2} onClick={(e) => handleDelete(e, screenshots[currentIndex])}/>
        </div>
        <button onClick={next} aria-label="Next Screenshot" className="nav-button">›</button>
      </div>

      <div className="thumbnail-strip">
        {screenshots.map((file, idx) => (
          <img
            key={file}
            src={`${import.meta.env.VITE_UPLOADS}screenshots/${file}`}
            alt={`Thumbnail ${idx + 1}`}
            className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
            onClick={(e) => {e.stopPropagation(); setCurrentIndex(idx);}}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export default ScreenshotViewer;
