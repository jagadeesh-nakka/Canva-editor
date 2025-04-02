export const exportCanvasAsImage = (canvasRef, format = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const dataUrl = canvas.toDataURL(`image/${format}`);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `design.${format}`;
    link.click();
  };
  