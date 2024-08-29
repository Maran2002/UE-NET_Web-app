import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:4000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error uploading the file', error);
      alert("Some Error Occured")
    }
  };

  const renderMask = () => {
    if (!prediction) return null;

    const width = 256;
    const height = 256;
    const maskArray = new Uint8Array(prediction.flat());
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    const imageData = context.createImageData(width, height);

    for (let i = 0; i < maskArray.length; i++) {
      const value = maskArray[i] * 255;
      imageData.data[i * 4] = value; // Red
      imageData.data[i * 4 + 1] = value; // Green
      imageData.data[i * 4 + 2] = value; // Blue
      imageData.data[i * 4 + 3] = 255; // Alpha
    }

    context.putImageData(imageData, 0, 0);
    return <img src={canvas.toDataURL()} alt="Predicted Mask" />;
  };

  return (
    <main>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Playwrite+VN&family=Shantell+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"></link>
    <div className="App">
      <h1 data-aos="zoom-in" >OD/OC SEGMENTATION</h1>
      <form className='Form' onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Predict</button>
      </form>
      {prediction && (
        <>
          <h2>Predicted Mask</h2>
          <div className='pre-img'>
          {renderMask()}
        </div>
        </>
      )}
    </div>
    <p className='para'><em>Note : It's a sample of how the actual model works. It's not the actual output of original final model. And it's only for education purpose and proof of project completion. Don't reuse it..!!</em></p>
    </main>
  );
}

export default App;
