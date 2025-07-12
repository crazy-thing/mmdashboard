import { useEffect, useState } from 'react'
import '../styles/WebsiteScreenshots.scss'
import { deleteScreenshot, uploadFile } from '../util/api';
import { add, trash2 } from '../assets/exports';

interface WebsiteScreenshotsProps {
    setShowWebsiteScreenshots: (show: boolean) => void
}

const WebsiteScreenshots = ({ setShowWebsiteScreenshots }: WebsiteScreenshotsProps) => {

  const [screenshots, setScreenshots] = useState<string[]>([]);
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

    const handleScreenshotUpload = async (event: any) => {
      const file = event.target.files?.[0]
      console.log("File", file);
      if (file) {
        await uploadFile(
            file,
            `${import.meta.env.VITE_IP}`,
            localStorage.getItem('apiKey') as string,
            'screenshotFile'
        )
      }      
        await fetchScreenshots();
    };

    return (
        <div className='website-screenshots'>
            <div className='website-screenshots__top'>
                <span className='website-screenshots__top-button' onClick={() => setShowWebsiteScreenshots(false)}> GO BACK </span>
                <span className='website-screenshots__top-button blue' onClick={() => setShowWebsiteScreenshots(false)}> SAVE </span>
            </div>

            <div className='website-screenshots__list'>
                {screenshots.map((screenshot, index) => (
                    <div key={index} className='website-screenshots__item'>
                        <img className='website-screenshots__image2' src={`${import.meta.env.VITE_UPLOADS}screenshots/${screenshot}`} alt={`Screenshot ${index + 1}`} />
                        <img className='website-screenshots__delete-icon' src={trash2} onClick={(e) => handleDelete(e, screenshot)}/>
                    </div>
                ))}
            </div>

          <div className='app__create' onClick={() => document.getElementById('screenshot-upload')?.click()}>
              <img className='app__create__icon' src={add} />
              <p className='app__create__text'>Add New Screenshot</p>
          </div>

            <input
            type="file"
            id='screenshot-upload'
            accept="image/*"
            onChange={handleScreenshotUpload}
            style={{ display: 'none' }}
            />

        </div>
    )
}

export default WebsiteScreenshots
