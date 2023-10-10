import { GenerationCard } from './components/GenerationCard';
import NowPlaying from './components/NowPlaying';
import Player from './components/Player';
import ApiUtils from './utils/ApiUtils';
import ImageUtils from './utils/ImageUtils';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';

// Main App component
function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const default_songs = useMemo(() => [
    {
      title: 'Dance The Night',
      artist: 'Dua Lipa',
      link: '/audio/Dance_The_Night.mp3',
      album_art: null,
    },
    {
      title: 'Levitating',
      artist: 'Dua Lipa',
      link: '/audio/Levitating.mp3',
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

  const songs = useMemo(() => {
    const processedSongs = APIResponse.response.map(song => ({
      title: song.song,
      artist: song.artist,
      link: ApiUtils.getSongLink(song.song_link), // Using the function to generate the link
      artworkSrc: song.album_art || '/covers/default.png',
      artworkType: 'image/png'
    }));

    // If the API response is empty, use default_songs
    if (processedSongs.length > 0){
      return processedSongs;
    }
    else {
      return default_songs;
    }
  }, [APIResponse.response, default_songs]);

  const [showGenerationCard, setShowGenerationCard] = useState(true);

  const [showNowPlaying, setShowNowPlaying] = useState(false);

  // When songs are updated show now playing
  useEffect(() => {
    if (songs !== default_songs) {
      setShowGenerationCard(false);
      setShowNowPlaying(true);
    }
    // eslint-disable-next-line
  }, [songs]);

  // Used when a request is inputted
  const [generationTriggered, setGenerationTriggered] = useState(false);

  // Flag to indicate whether songs are actively being fetched from the API
  const fetching = useRef(false);

  useEffect(() => {
    // Fetch songs when generationTriggered

    // Unless we're currently fetching
    if (fetching.current || !generationTriggered)
      return;

    fetching.current = true;

    (async () => {
      await ApiUtils.fetchSongs(user_request, setLoading, setError, setAPIResponse);

      // Reset states
      setGenerationTriggered(false);
      fetching.current = false;
    })();
    // eslint-disable-next-line
  }, [generationTriggered]);

  const handleGeneration = () => {
    // Triggered when the generation button is pressed or when enter is pressed
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
    // Update the media session when the current song changes (for external media controls and metadata)
    if ('mediaSession' in navigator) {
      const metadata = new window.MediaMetadata({
        title: songInfo.title,
        artist: songInfo.artist,
        artwork: [{ src: songInfo.artworkSrc, type: songInfo.artworkType }]
      });
      navigator.mediaSession.metadata = metadata;
    }
  }, [songInfo]);

  useEffect(() => {
    // When the current song artwork changes update the background gradient to match
    ImageUtils.updateBackgroundGradient(songInfo.artworkSrc);
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
      <Player songInfo={songInfo} playNextSong={playNextSong} playPreviousSong={playPreviousSong} showNowPlaying={showNowPlaying} setShowNowPlaying={setShowNowPlaying} showGenerationCard={showGenerationCard} setShowGenerationCard={setShowGenerationCard} />
    </div>
  );
}

export default App;