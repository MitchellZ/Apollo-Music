import React, { useEffect } from "react";

function NowPlaying({ songInfo }) {

  useEffect(() => {
    const songTitleElement = document.querySelector(".song-title");

    if (window.innerWidth -10 <= songTitleElement.clientWidth) {
      // console.debug("Marquee");
      songTitleElement.classList.add('marquee');
    } else {;
      // console.debug("Not Marquee");
      songTitleElement.classList.remove('marquee');
    }
  }, [songInfo.title]);

  return (
    <div>
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
  );
}

export default NowPlaying;
