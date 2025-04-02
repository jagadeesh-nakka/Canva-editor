import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DesignEditor = ({ isNew }) => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [design, setDesign] = useState({
    title: 'Untitled Design',
    description: '',
    canvasData: ''
  });
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [currentTool, setCurrentTool] = useState('pen');
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [startPos, setStartPos] = useState(null);
  const [isDrawingShape, setIsDrawingShape] = useState(false);

  // Color palette options
  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080'
  ];

  // Load design if editing
  useEffect(() => {
    if (!isNew && id) {
      const loadDesign = async () => {
        try {
          const res = await axios.get(`/api/designs/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setDesign(res.data);
          loadCanvas(res.data.canvasData);
          
          // Load comments
          const commentsRes = await axios.get(`/api/comments?design=${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setComments(commentsRes.data);
        } catch (err) {
          console.error('Error loading design:', err);
        }
      };
      loadDesign();
    }
  }, [id, isNew]);

  const loadCanvas = (canvasData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      // Redraw comment markers
      comments.forEach(comment => {
        if (!comment.resolved) {
          drawCommentMarker(comment.x, comment.y);
        }
      });
    };
    img.src = canvasData;
  };

  const drawCommentMarker = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  // Drawing functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'pen') {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    } else if (currentTool === 'rectangle' || currentTool === 'circle') {
      setStartPos({ x, y });
      setIsDrawingShape(true);
    }
  };

  const draw = (e) => {
    if (!isDrawingShape && currentTool !== 'pen') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    
    if (currentTool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (isDrawingShape && startPos) {
      // Clear canvas and redraw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      loadCanvas(design.canvasData);
      
      // Draw the current shape being created
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      
      if (currentTool === 'rectangle') {
        const width = x - startPos.x;
        const height = y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (currentTool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawingShape && startPos) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Finalize the shape
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      
      // Save the current canvas state
      setDesign(prev => ({
        ...prev,
        canvasData: canvas.toDataURL('image/png')
      }));
    }
    
    setIsDrawingShape(false);
    setStartPos(null);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'comment') {
      setCommentPosition({ x, y });
      document.getElementById('comment-text').focus();
    }
  };

  const saveDesign = async () => {
    try {
      const canvas = canvasRef.current;
      const canvasData = canvas.toDataURL('image/png');
      
      const designData = {
        ...design,
        canvasData
      };

      let res;
      if (isNew) {
        res = await axios.post('/api/designs', designData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        res = await axios.put(`/api/designs/${id}`, designData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }

      navigate(`/design/${res.data._id}`);
    } catch (err) {
      console.error('Error saving design:', err);
    }
  };

  const addComment = async () => {
    try {
      const res = await axios.post('/api/comments', {
        text: commentText,
        x: commentPosition.x,
        y: commentPosition.y,
        design: id,
        username: user.username
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setComments([...comments, res.data]);
      setCommentText('');
      drawCommentMarker(res.data.x, res.data.y);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const resolveComment = async (commentId) => {
    try {
      await axios.put(`/api/comments/${commentId}/resolve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, resolved: true } : c
      ));
      // Redraw canvas to remove the marker
      loadCanvas(design.canvasData);
    } catch (err) {
      console.error('Error resolving comment:', err);
    }
  };

  return (
    <div className="design-editor">
      <div className="toolbar">
        <div className="tool-section">
          <h4>Tools</h4>
          <button 
            className={currentTool === 'pen' ? 'active' : ''}
            onClick={() => setCurrentTool('pen')}
          >
            Pen
          </button>
          <button 
            className={currentTool === 'rectangle' ? 'active' : ''}
            onClick={() => setCurrentTool('rectangle')}
          >
            Rectangle
          </button>
          <button 
            className={currentTool === 'circle' ? 'active' : ''}
            onClick={() => setCurrentTool('circle')}
          >
            Circle
          </button>
          <button 
            className={currentTool === 'comment' ? 'active' : ''}
            onClick={() => setCurrentTool('comment')}
          >
            Add Comment
          </button>
        </div>

        <div className="tool-section">
          <h4>Brush Size</h4>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
          />
          <span>{brushSize}px</span>
        </div>

        <div className="tool-section">
          <h4>Colors</h4>
          <div className="color-palette">
            {colors.map((c) => (
              <div 
                key={c}
                className={`color-swatch ${color === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
          />
        </div>
      </div>

      <div className="design-meta">
        <input
          type="text"
          value={design.title}
          onChange={(e) => setDesign({...design, title: e.target.value})}
          placeholder="Design title"
        />
        <textarea
          value={design.description}
          onChange={(e) => setDesign({...design, description: e.target.value})}
          placeholder="Design description"
        />
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onClick={handleCanvasClick}
        />
      </div>

      <div className="comments-panel">
        <h3>Comments</h3>
        {comments.filter(c => !c.resolved).map(comment => (
          <div key={comment._id} className="comment">
            <p><strong>{comment.username}:</strong> {comment.text}</p>
            <button onClick={() => resolveComment(comment._id)}>
              Resolve
            </button>
          </div>
        ))}
        
        {currentTool === 'comment' && (
          <div className="comment-form">
            <textarea
              id="comment-text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your comment..."
            />
            <button onClick={addComment}>Add Comment</button>
            <p>Marker position: ({commentPosition.x}, {commentPosition.y})</p>
          </div>
        )}
      </div>

      <div className="actions">
        <button onClick={saveDesign}>
          {isNew ? 'Save Design' : 'Update Design'}
        </button>
      </div>
    </div>
  );
};

export default DesignEditor;
