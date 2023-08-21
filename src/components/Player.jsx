import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';

function Player({ songInfo, playNextSong, playPreviousSong }) {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressBarContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playOnRollOver, setPlayOnRollOver] = useState(false);

  const updateTimeWhilePlaying = useCallback(() => {
    if (isPlaying) {
      setCurrentTime(audioRef.current.currentTime);
      requestAnimationFrame(updateTimeWhilePlaying);
    }
  }, [isPlaying]);

  const handleSkipForward = useCallback(() => {
    setIsBuffering(true);
    if (isPlaying || playOnRollOver){
      // Play next song automatically
      setPlayOnRollOver(true);
    }
    else {
      // Start next song paused
      setPlayOnRollOver(false);
    }
    playNextSong();
    const seekTime = 0;
    setCurrentTime(seekTime);
    audioRef.current.currentTime = seekTime;
  }, [isPlaying, playOnRollOver, setIsBuffering, setPlayOnRollOver, playNextSong, setCurrentTime, audioRef]);


  const handleSkipBackward = () => {
    if (isPlaying || playOnRollOver){
      // Play previous song automatically
      setPlayOnRollOver(true);
    }
    else {
      // Start previous song paused
      setPlayOnRollOver(false);
    }
    if (currentTime <= 5) {
      setIsBuffering(true);
      playPreviousSong();
    }
    const seekTime = 0;
    setCurrentTime(seekTime);
    audioRef.current.currentTime = seekTime;
  };

  useEffect(() => {
    const currentAudioRef = audioRef.current;

    const handlePause = () => {
      setIsPlaying(false);
      setPlayOnRollOver(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      requestAnimationFrame(updateTimeWhilePlaying);
    };

    const handleTimeUpdate = () => {
      if (!isPlaying) {
        setCurrentTime(currentAudioRef.currentTime);
      }
    };

    const handleLoadedData = () => {
      // Loaded audio
      if (playOnRollOver) {
        // Play on rollover (automatically start next song in playlist)
        audioRef.current.play();
      }
    };

    const handleWaiting = () => {
      setIsBuffering(false);
      // Update duration
      setDuration(currentAudioRef.duration);
    };

    const handleCanPlay = () => {
      // console.log('Can play.');
    }

    const handleReachedEnd = () => {
      // Move to next song in playlist
      handleSkipForward();
      // Set next song to play automatically
      setPlayOnRollOver(true);
    }

    currentAudioRef.addEventListener('ended', handleReachedEnd);
    currentAudioRef.addEventListener('canplaythrough', handleCanPlay);
    currentAudioRef.addEventListener('loadedmetadata', handleWaiting);
    currentAudioRef.addEventListener('pause', handlePause);
    currentAudioRef.addEventListener('playing', handlePlay);
    currentAudioRef.addEventListener('timeupdate', handleTimeUpdate);
    currentAudioRef.addEventListener('loadeddata', handleLoadedData);

    return () => {
      currentAudioRef.removeEventListener('ended', handleReachedEnd);
      currentAudioRef.removeEventListener('canplaythrough', handleCanPlay);
      currentAudioRef.removeEventListener('loadedmetadata', handleWaiting);
      currentAudioRef.removeEventListener('pause', handlePause);
      currentAudioRef.removeEventListener('playing', handlePlay);
      currentAudioRef.removeEventListener('timeupdate', handleTimeUpdate);
      currentAudioRef.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [isPlaying, updateTimeWhilePlaying, playOnRollOver, handleSkipForward]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => { handlePlayPause(); });
      navigator.mediaSession.setActionHandler('previoustrack', () => { handleSkipBackward(); });
      navigator.mediaSession.setActionHandler('nexttrack', () => { handleSkipForward(); });
    }
  });

  const handlePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      requestAnimationFrame(updateTimeWhilePlaying);
    }
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

  const handleProgressBarTouchStart = (e) => {
    setIsDragging(true);
    updateSeekTime(e.touches[0].clientX);
  };

  const handleDocumentMouseUp = () => {
    setIsDragging(false);
  };

  const handleDocumentTouchEnd = () => {
    setIsDragging(false);
  };

  const updateSeekTime = useCallback((clientX) => {
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
  }, [audioRef, progressBarRef, progressBarContainerRef, duration]);

  useEffect(() => {
    const handleDocumentMouseMove = (e) => {
      if (isDragging) {
        updateSeekTime(e.clientX);
      }
    };

    const handleDocumentTouchMove = (e) => {
      if (isDragging) {
        updateSeekTime(e.touches[0].clientX);
      }
    };

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
  }, [isDragging, updateSeekTime]);

  return (
    <div className="player-card">
      <div className="progress-bar-container" ref={progressBarContainerRef}>
        <div
          className="progress-bar-hitbox"
          onMouseDown={handleProgressBarMouseDown}
          onTouchStart={handleProgressBarTouchStart}
        >
          <div className={`progress-bar ${isBuffering ? 'buffering' : ''}`} style={{ '--progress': progress + '%' }} ref={progressBarRef}>
            <div className={`progress-thumb ${isBuffering ? 'hidden' : ''}`} style={{ left: progress + '%' }}></div>
          </div>

        </div>
        <div className="timecodes">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="button-container">
        <button onClick={handleSkipBackward}>
          <FaStepBackward />
        </button>
        <button id='play-pause' onClick={handlePlayPause}>
          {isPlaying ? <FaPause style={{ verticalAlign: 'middle' }} /> : <FaPlay style={{ verticalAlign: 'middle' }} />}
        </button>
        <button onClick={handleSkipForward}>
          <FaStepForward />
        </button>
      </div>
      <audio ref={audioRef} src={songInfo.link} />
    </div>
  );
}

export default Player;
