import { GenerationCard } from './components/GenerationCard';
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
      link: '/audio/Dance_The_Night.mp3',
      album_art: null,
    }
  ], []);

  const [APIResponse, setAPIResponse] = useState({
    message: "",
    response: []
  });

  const [user_request, setUserRequest] = useState('A few recent hits');

  const handleInputChange = (event) => {
    setUserRequest(event.target.value);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSongs = async () => {
    // Fetch playlist from API
    console.debug('Fetching playlist for:', user_request);
    setLoading(true);
    setError(false);

    try {
      const uniqueParam = `nocache=${Date.now()}`; // Using a timestamp as a unique parameter

      // const proxyUrl = '';
      const apiUrl = `/query?message=${user_request}&${uniqueParam}`;

      const response = await fetch(apiUrl);

      let data = await response.json();
      // data = JSON.parse(data.contents)
      if (data.response && data.response.length > 0) {
        setAPIResponse(data);
      }

      // Check status code
      if (!response.ok) {
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
    }
    setLoading(false);
  };

  const songs = useMemo(() => {
    const processedSongs = APIResponse.response.map(song => ({
      title: song.song,
      artist: song.artist,
      link: getSongLink(song.song_link), // Using the function to generate the link
      artworkSrc: song.album_art || '/covers/default.png',
      artworkType: 'image/png'
    }));

    // If the API response is empty, use default_songs
    if (processedSongs.length > 0){
      console.debug('Songs:', processedSongs.length);
      return processedSongs;
    }
    else {
      console.debug('Default songs:', default_songs.length);
      return default_songs;
    }
  }, [APIResponse.response, default_songs]);

  const [showGenerationCard, setShowGenerationCard] = useState(true);

  const [showNowPlaying, setShowNowPlaying] = useState(false);

  useEffect(() => {
    if (songs !== default_songs) {
      setShowGenerationCard(false);
      setShowNowPlaying(true);
    }
    // eslint-disable-next-line
  }, [songs]);

  const [generationTriggered, setGenerationTriggered] = useState(false);

  const fetching = useRef(false); // useRef to manage the fetching flag

  useEffect(() => {
    // console.debug(`Generation triggered: ${generationTriggered}`);

    if (fetching.current || !generationTriggered)
      return;

    fetching.current = true;

    (async () => {
      await fetchSongs();
      setGenerationTriggered(false);
      fetching.current = false;
    })();
    // eslint-disable-next-line
  }, [generationTriggered]);

  const handleGeneration = () => {
    setGenerationTriggered(true);
  }

  const songInfo = useMemo(() => ({
    title: songs[currentSongIndex].title,
    artist: songs[currentSongIndex].artist,
    link: songs[currentSongIndex].link,
    artworkSrc: songs[currentSongIndex].artworkSrc || '/covers/default.png',
    artworkType: 'image/png'
  }), [songs, currentSongIndex]);

  const playNextSong = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
  };

  const playPreviousSong = () => {
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
  };  

  useEffect(() => {

    if ('mediaSession' in navigator) {
      const metadata = new window.MediaMetadata({
        title: songInfo.title,
        artist: songInfo.artist,
        artwork: [{ src: songInfo.artworkSrc, type: songInfo.artworkType }]
      });
      navigator.mediaSession.metadata = metadata;
    }
  }, [songInfo]);

  function getSongLink(url) {
    // Check if the URL contains a video ID
    if (!url)
      return '/audio/Dance_The_Night.mp3';
    if (!url.includes('v='))
      return '/audio/Dance_The_Night.mp3';
    const videoId = url.split('v=')[1];
    return 'https://vid.puffyan.us/latest_version?id=' + videoId + '&itag=140';
  }

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
      <div className="background-gradient" />
      <div class="frosted-background-overlay" />
      <div className="content">
        <div className="cover-art-container">
          {showGenerationCard && <GenerationCard handleInputChange={handleInputChange} handleGeneration={handleGeneration} loading={loading} error={error} />}
          {showNowPlaying && <NowPlaying songInfo={songInfo} />}
        </div>
      </div>
      <Player songInfo={songInfo} playNextSong={playNextSong} playPreviousSong={playPreviousSong} />
    </div>
  );
}

export default App;