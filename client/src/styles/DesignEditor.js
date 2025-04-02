.design-editor {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }
  
  .title-input {
    flex: 1;
    padding: 0.8rem;
    font-size: 1.2rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .editor-actions {
    display: flex;
    gap: 1rem;
  }
  
  .action-btn, .save-btn {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
  }
  
  .action-btn {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .action-btn:hover {
    background-color: #e0e0e0;
  }
  
  .save-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .save-btn:hover {
    background-color: #45a049;
  }
  
  .editor-toolbar {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    display: flex;
    gap: 2rem;
  }
  
  .tool-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .canvas-container {
    margin: 1rem 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
  
  canvas {
    display: block;
    background-color: white;
    cursor: crosshair;
  }
  
  .description-section {
    margin-top: 1rem;
  }
  
  .description-section textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    min-height: 80px;
  }
  
  .editor-error {
    color: #d32f2f;
    background-color: #fdecea;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .editor-loading {
    text-align: center;
    padding: 2rem;
  }