import NowPlaying from './components/NowPlaying';
import Player from './components/Player';
import ColorThief from 'colorthief';
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
      const uniqueParam = `nocache=${Date.now()}`; // Using a timestamp as a unique parameter
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`http://playlist.us.to:5000/query?message=${user_request}&${uniqueParam}`)}`);
      console.debug(response);
      let data = await response.json();
      data = JSON.parse(data.contents)
      if (data.response && data.response.length > 0) {
        setAPIResponse(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      console.log(error);
    }
  };

  const fetching = useRef(false); // useRef to manage the fetching flag

  useEffect(() => {
  if (fetching.current)
      return;

  // Fetch playlist from API
  console.debug('Fetching playlist.');
  fetching.current = true;
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

  const extractColorsFromArtwork = async (artworkSrc) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = artworkSrc;
  
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const colorThief = new ColorThief();
        const colorPalette = colorThief.getPalette(img, 2); // Get a palette of the two dominant colors
        resolve(colorPalette);
      };
  
      img.onerror = (error) => {
        reject(error);
      };
    });
  };
  
  const updateBackgroundGradient = async (artworkSrc) => {
    try {
      const colorPalette = await extractColorsFromArtwork(artworkSrc);
  
      // Compare the brightness of the two colors
      const brightness1 = (colorPalette[0][0] * 299 + colorPalette[0][1] * 587 + colorPalette[0][2] * 114) / 1000;
      const brightness2 = (colorPalette[1][0] * 299 + colorPalette[1][1] * 587 + colorPalette[1][2] * 114) / 1000;
  
      let rgbString1, rgbString2;
  
      if (brightness1 < brightness2) {
        rgbString1 = `rgb(${colorPalette[0][0]}, ${colorPalette[0][1]}, ${colorPalette[0][2]})`;
        rgbString2 = `rgb(${colorPalette[1][0]}, ${colorPalette[1][1]}, ${colorPalette[1][2]})`;
      } else {
        rgbString1 = `rgb(${colorPalette[1][0]}, ${colorPalette[1][1]}, ${colorPalette[1][2]})`;
        rgbString2 = `rgb(${colorPalette[0][0]}, ${colorPalette[0][1]}, ${colorPalette[0][2]})`;
      }
  
      document.documentElement.style.setProperty('--gradient-color-1', rgbString1);
      document.documentElement.style.setProperty('--gradient-color-2', rgbString2);
    } catch (error) {
      console.error('Error extracting colors:', error);
    }
  };
  
  

  useEffect(() => {
    updateBackgroundGradient(songInfo.artworkSrc);
    // eslint-disable-next-line
  }, [songInfo.artworkSrc]);

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