import NowPlaying from './components/NowPlaying';
import Player from './components/Player';
import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const default_songs = useMemo(() => [
    {
      song: 'Dance The Night',
      artist: 'Dua Lipa',
      song_link: null,
      album_art: 'https://lastfm.freetls.fastly.net/i/u/770x0/a8974f61b7c7b8d8f6b2d34a5a19b81b.jpg#a8974f61b7c7b8d8f6b2d34a5a19b81b',
    },
    {
      song: 'Levitating',
      artist: 'Dua Lipa',
      song_link: null,
      album_art: 'https://lastfm.freetls.fastly.net/i/u/770x0/5765edb5fa2e90228f53a19ec963e82b.jpg#5765edb5fa2e90228f53a19ec963e82b',
    },
    {
      song: 'Blinding Lights',
      artist: 'The Weeknd',
      song_link: null,
      album_art: 'https://lastfm.freetls.fastly.net/i/u/770x0/7d957bd27dd562bee7aaa89eafa0bbe6.jpg#7d957bd27dd562bee7aaa89eafa0bbe6',
    }
  ], []);

  const [APIResponse, setAPIResponse] = useState({
    message: "",
    response: []
  });

  const user_request = 'A few recent hits';

  const fetchSongs = async () => {
    try {
      const response = await fetch('http://playlist.us.to:5000/query?message=' + user_request);
      const data = await response.json();
      if (data.response && data.response.length > 0) {
        setAPIResponse(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch playlist from API
    console.log('Fetching playlist...');
    fetchSongs();
  }, []);

  const songs = useMemo(() => APIResponse.response.length > 0 ? APIResponse.response : default_songs, [APIResponse.response, default_songs]);

  const playNextSong = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
  };

  const playPreviousSong = () => {
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
  };

  useEffect(() => {
    const getSongInfo = (index) => {
      return {
        title: songs[index].song,
        artist: songs[index].artist,
        album: songs[index].album,
        artworkSrc: songs[index].album_art || '/covers/default.png',
        artworkType: 'image/png'
      };
    };

    if ('mediaSession' in navigator) {
      const songInfo = getSongInfo(currentSongIndex);
      const metadata = new window.MediaMetadata({
        title: songInfo.title,
        artist: songInfo.artist,
        album: songInfo.album,
        artwork: [{ src: songInfo.artworkSrc, type: songInfo.artworkType }]
      });
      navigator.mediaSession.metadata = metadata;
    }
  }, [currentSongIndex, songs]);

  const songInfo = {
    title: songs[currentSongIndex].song,
    artist: songs[currentSongIndex].artist,
    album: songs[currentSongIndex].album,
    artworkSrc: songs[currentSongIndex].album_art || '/covers/default.png',
    artworkType: 'image/png'
  };

  return (
    <div className="app-container">
      <div className="background-gradient"/>
      <div class="frosted-background-overlay"/>
      <div className="content">
        <NowPlaying songInfo={songInfo} />
      </div>
      <Player playNextSong={playNextSong} playPreviousSong={playPreviousSong} />
    </div>
  );
}

export default App;