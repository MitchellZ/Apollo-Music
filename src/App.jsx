import NowPlaying from './components/NowPlaying';
import Player from './components/Player';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [songInfo] = useState({
    title: 'Dance The Night',
    artist: 'Dua Lipa',
    album: '',
    artworkSrc: '/covers/default.png',
    artworkType: 'image/png'
  });

  useEffect(() => {

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: songInfo.title,
        artist: songInfo.artist,
        album: songInfo.album,
        artwork: [
          { src: songInfo.artworkSrc, type: songInfo.artworkType }
        ]
      });
    }

  }, [songInfo.album, songInfo.artist, songInfo.artworkSrc, songInfo.artworkType, songInfo.title]);

  return (
    <div className="app-container">
      <div className="content">
        <NowPlaying songInfo={songInfo}/>
      </div>
      <Player/>
    </div>
  );
}

export default App;
