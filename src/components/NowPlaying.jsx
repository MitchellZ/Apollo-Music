import React, { useEffect } from "react";

function NowPlaying({ songInfo }) {

  useEffect(() => {
    const songTitleElement = document.querySelector(".song-title");

    if (window.innerWidth - 20 <= songTitleElement.clientWidth) {
      // console.debug("Marquee");
      songTitleElement.classList.add('marquee');
    } else {
      ;
      // console.debug("Not Marquee");
      songTitleElement.classList.remove('marquee');
    }
  }, [songInfo.title]);

  return (
    <div>
      <div className="now-playing">
        <img
          className="cover-art-image"
          src={songInfo.artworkSrc}
          alt="Cover Art"
          draggable="false"
        />
        <div className="song-info">
          <p className="artist">{songInfo.artist}</p>
          <p className="song-title">{songInfo.title}</p>
        </div>
      </div>
    </div>
  );
}

export default NowPlaying;