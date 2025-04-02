import React, { useRef, useState, useEffect } from 'react';

const Canvas = ({ isNew, designId }) => {
  const canvasRef = useRef(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState(null);  // Store starting position for drawing
  const [drawnShapes, setDrawnShapes] = useState([]);  // Store all the drawn shapes
  const [currentTool, setCurrentTool] = useState('pen');  // Current selected tool

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!canvas || !ctx) return;

    // Set the canvas background color
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setIsCanvasReady(true);

    // Cleanup effect when component unmounts
    return () => {
      setIsCanvasReady(false);
    };
  }, []);

  // Handle mouse down to start drawing
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPosition({ x, y });
    setIsDrawing(true);
  };

  // Handle mouse move to draw the shape
  const handleMouseMove = (e) => {
    if (!isDrawing || !startPosition) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Clear canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw all previous shapes
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Refill background

    drawnShapes.forEach((shape) => {
      ctx.beginPath();
      if (shape.type === 'pen') {
        ctx.moveTo(shape.start.x, shape.start.y);
        ctx.lineTo(shape.end.x, shape.end.y);
        ctx.stroke();
      } else if (shape.type === 'rectangle') {
        ctx.rect(shape.start.x, shape.start.y, shape.width, shape.height);
        ctx.stroke();
      } else if (shape.type === 'circle') {
        ctx.arc(shape.start.x, shape.start.y, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.closePath();
    });

    // Draw the current shape based on the selected tool
    if (currentTool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(startPosition.x, startPosition.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      ctx.closePath();
    } else if (currentTool === 'rectangle') {
      const width = currentX - startPosition.x;
      const height = currentY - startPosition.y;
      ctx.beginPath();
      ctx.rect(startPosition.x, startPosition.y, width, height);
      ctx.stroke();
      ctx.closePath();
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(currentX - startPosition.x, 2) + Math.pow(currentY - startPosition.y, 2));
      ctx.beginPath();
      ctx.arc(startPosition.x, startPosition.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  };

  // Handle mouse up to stop drawing
  const handleMouseUp = () => {
    if (!startPosition) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const newShape = {
      type: currentTool,
      start: startPosition,
      end: { x: startPosition.x, y: startPosition.y },  // Placeholder, will be updated in handleMouseMove
    };

    if (currentTool === 'pen') {
      newShape.end = { x: startPosition.x, y: startPosition.y };  // For pen, store final end position
    } else if (currentTool === 'rectangle') {
      newShape.width = Math.abs(startPosition.x - startPosition.x); // Update with actual values
      newShape.height = Math.abs(startPosition.y - startPosition.y); // Update with actual values
    } else if (currentTool === 'circle') {
      newShape.radius = Math.sqrt(Math.pow(startPosition.x - startPosition.x, 2) + Math.pow(startPosition.y - startPosition.y, 2)); // Placeholder
    }

    setDrawnShapes([...drawnShapes, newShape]);
    setIsDrawing(false);
    setStartPosition(null);
  };

  // Handle tool change
  const handleToolChange = (tool) => {
    setCurrentTool(tool);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="800"
        height="500"
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>

      {/* Tool Selection */}
      <div>
        <button onClick={() => handleToolChange('pen')}>Pen</button>
        <button onClick={() => handleToolChange('rectangle')}>Rectangle</button>
        <button onClick={() => handleToolChange('circle')}>Circle</button>
      </div>
    </div>
  );
};

export default Canvas;
