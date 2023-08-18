import React from "react";
import { FaSpinner } from 'react-icons/fa';


export function GenerationCard({
  handleInputChange,
  handleGeneration,
  loading,
  error
}) {

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleGeneration();
    }
  };

  return <div className="generation-card">
            <h2>What would you like to hear?</h2>
            <input className="generation-request" onChange={handleInputChange} onKeyDown={handleKeyPress} type="text"/>
            <p className="error" style={{display: error ? "" : "none"}}>Oh no! Unable to generate playlist.</p>
            <button className="generation-button" onClick={handleGeneration}>Generate Playlist <FaSpinner className="spinner" style={{display: loading ? "" : "none"}}/></button>
          </div>;
}
