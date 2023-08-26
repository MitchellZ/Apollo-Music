import { GenerationCard } from './components/GenerationCard';
import NowPlaying from './components/NowPlaying';
import Player from './components/Player';
import ApiUtils from './utils/ApiUtils';
import ImageUtils from './utils/ImageUtils';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';

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
      await ApiUtils.fetchSongs(user_request, setLoading, setError, setAPIResponse);
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

  useEffect(() => {
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