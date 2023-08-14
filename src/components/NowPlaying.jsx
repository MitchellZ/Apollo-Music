import React from "react";

function NowPlaying({ songInfo }) {
  return <div>
          <img className="cover-art-image" src={songInfo.artworkSrc} alt="cover art" draggable="false" />
          <div className="song-info">
            <p className="artist">{songInfo.artist}</p>
            <p className="song-title">{songInfo.title}</p>
          </div>
        </div>;
}

export default NowPlaying;  