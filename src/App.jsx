import { Player } from './components/player';
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressBarContainerRef = useRef(null); // New ref for the progress bar container
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // New state to track dragging

  useEffect(() => {
    audioRef.current.addEventListener('pause', handlePause);
    audioRef.current.addEventListener('playing', handlePlay);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audioRef.current.removeEventListener('pause', handlePause);
      audioRef.current.removeEventListener('playing', handlePlay);
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleSkipForward = () => {
    // Add logic to skip forward here
    console.log('Skip Forward');
  };

  const handleSkipBackward = () => {
    // Add logic to skip backward here
    console.log('Skip Backward');
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  const handleProgressBarMouseDown = (e) => {
    setIsDragging(true);
    updateSeekTime(e.clientX);
  };

  const handleDocumentMouseUp = () => {
    setIsDragging(false);
  };

  const handleDocumentMouseMove = (e) => {
    if (isDragging) {
      updateSeekTime(e.clientX);
    }
  };

  const handleProgressBarTouchStart = (e) => {
    setIsDragging(true);
    updateSeekTime(e.touches[0].clientX);
  };

  const handleDocumentTouchEnd = () => {
    setIsDragging(false);
  };

  const handleDocumentTouchMove = (e) => {
    if (isDragging) {
      updateSeekTime(e.touches[0].clientX);
    }
  };

  const updateSeekTime = (clientX) => {
    const progressBar = progressBarRef.current;
    const progressBarContainer = progressBarContainerRef.current;
    const progressBarRect = progressBar.getBoundingClientRect();
    const progressBarContainerRect = progressBarContainer.getBoundingClientRect();
    const mousePosition = clientX;
    const progressBarLeft = progressBarRect.left;
    const progressBarWidth = progressBarRect.width;
    const progressBarContainerLeft = progressBarContainerRect.left;
    const progressBarContainerWidth = progressBarContainerRect.width;
    const clampedMousePosition = Math.max(progressBarContainerLeft, Math.min(progressBarContainerLeft + progressBarContainerWidth, mousePosition));
    const dragPosition = clampedMousePosition - progressBarLeft;
    const seekTime = (dragPosition / progressBarWidth) * duration;
    setCurrentTime(seekTime);
    audioRef.current.currentTime = seekTime;
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleDocumentMouseUp);
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('touchend', handleDocumentTouchEnd);
    document.addEventListener('touchmove', handleDocumentTouchMove);

    return () => {
      document.removeEventListener('mouseup', handleDocumentMouseUp);
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('touchend', handleDocumentTouchEnd);
      document.removeEventListener('touchmove', handleDocumentTouchMove);
    };
  }, [isDragging]);

  return (
    <div className="app-container">
      <div className="content">
        {/* Your main content here */}
        <div className="cover-art-container">
          <img className="cover-art-image" src="/covers/default.png" alt="cover art" />
          <div className="song-info">
            <p className="artist">Dua Lipa</p>
            <p className="song-title">Dance The Night</p>
          </div>
        </div>
      </div>
      <Player   progressBarContainerRef={progressBarContainerRef} handleProgressBarMouseDown={handleProgressBarMouseDown} handleProgressBarTouchStart={handleProgressBarTouchStart} progress={progress} progressBarRef={progressBarRef} formatTime={formatTime} currentTime={currentTime} duration={duration} handleSkipBackward={handleSkipBackward} handlePlayPause={handlePlayPause} isPlaying={isPlaying} handleSkipForward={handleSkipForward} audioRef={audioRef}  />
    </div>
  );
}

export default App;
