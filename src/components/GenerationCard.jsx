import React from "react";
export function GenerationCard({
  handleInputChange,
  handleGeneration
}) {
  return <div className="generation-card">
            <h2>What would you like to hear?</h2>
            <input className="generation-request" onChange={handleInputChange} type="text" />
            <button className="generation-button" onClick={handleGeneration}>Generate Playlist</button>
          </div>;
}
  