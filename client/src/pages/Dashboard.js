import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        console.log("Fetching designs...");
        const res = await axios.get('/api/designs');
        console.log("Designs fetched:", res.data);
        setDesigns(res.data);
      } catch (err) {
        console.error("Fetch designs error:", err.response || err);
        setError('Failed to load designs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const downloadImage = (canvasData, format) => {
    const link = document.createElement('a');
    link.href = canvasData;
    link.download = `design.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCanvasData = (design, format) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = design.canvasData;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let dataUrl = "";
      if (format === 'png') {
        dataUrl = canvas.toDataURL('image/png');
      } else if (format === 'jpeg') {
        dataUrl = canvas.toDataURL('image/jpeg');
      } else if (format === 'svg') {
        const svgBlob = new Blob([design.canvasData], { type: 'image/svg+xml' });
        dataUrl = URL.createObjectURL(svgBlob);
      }

      console.log("Downloading:", format, dataUrl);
      downloadImage(dataUrl, format);
    };

    img.onerror = (err) => {
      console.error("Error loading image:", err);
    };
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your designs...</p>
      </div>
    );
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username || "Guest"}!</h1>
        <Link to="/design/new" className="create-design-btn">
          + Create New Design
        </Link>
      </div>

      {designs.length === 0 ? (
        <div className="empty-state">
          <h3>You don't have any designs yet</h3>
          <p>Get started by creating your first design</p>
          <Link to="/design/new" className="create-design-btn">
            Create First Design
          </Link>
        </div>
      ) : (
        <div className="designs-grid">
          {designs.map((design) => (
            <div key={design._id} className="design-card">
              <Link to={`/design/${design._id}`} className="design-link">
                <div className="design-thumbnail">
                  {design.canvasData ? (
                    <img 
                      src={design.canvasData} 
                      alt={design.title} 
                      onError={(e) => {
                        e.target.src = 'placeholder-image-url';
                      }}
                    />
                  ) : (
                    <div className="thumbnail-placeholder"></div>
                  )}
                </div>
                <div className="design-info">
                  <h3>{design.title}</h3>
                  <p className="design-description">
                    {design.description || 'No description'}
                  </p>
                  <p className="design-date">
                    Created: {new Date(design.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>

              {/* Download Buttons */}
              <div className="download-buttons">
                <button onClick={() => getCanvasData(design, 'png')}>
                  Download as PNG
                </button>
                <button onClick={() => getCanvasData(design, 'jpeg')}>
                  Download as JPG
                </button>
                <button onClick={() => getCanvasData(design, 'svg')}>
                  Download as SVG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
