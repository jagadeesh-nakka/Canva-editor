import React, { useState, useRef } from 'react';
import { sendFeedback } from '../utils/Socket';  // Import socket utility
import { exportCanvasAsImage } from '../utils/Export'; // Import the export function

const Feedback = ({ designId }) => {
  const [feedback, setFeedback] = useState('');
  const [position, setPosition] = useState(null); // Position where comment was made on canvas
  const canvasRef = useRef(null);  // Ref to access the canvas element

  // Handle feedback input changes
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  // Submit feedback with the position
  const handleSubmitFeedback = () => {
    if (feedback && position) {
      sendFeedback(designId, { feedback, position });
      setFeedback(''); // Clear feedback field after submission
    } else {
      alert('Please provide feedback and select a position.');
    }
  };

  // Capture the click position on the canvas
  const handleCanvasClick = (e) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setPosition(position);
  };

  // Export the canvas image in the specified format
  const handleExport = (format) => {
    exportCanvasAsImage(canvasRef, format);
  };

  return (
    <div>
     {/* Canvas */}
  {  /*  <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}  // Handle clicks to capture position
        id="designCanvas"
        width="300"
        height="300"
        style={{ border: "3px solid blue" }}
      ></canvas>*/}
      
      {/* Feedback Textarea */}
      <div>
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Leave feedback here..."
          rows="4"
          cols="50"
        />
      </div>
      
      {/* Submit Feedback Button */}
      <div>
        <button onClick={handleSubmitFeedback}>
          Submit Feedback
        </button>
      </div>
      
      {/* Export Image Buttons */}
      <div>
        <button onClick={() => handleExport('png')}>
          Export as PNG
        </button>
        <button onClick={() => handleExport('jpeg')}>
          Export as JPEG
        </button>
        <button onClick={() => handleExport('jpg')}>
          Export as JPG
        </button>
      </div>
    </div>
  );
};

export default Feedback;
