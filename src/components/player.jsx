import React from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';

export function Player({
  progressBarContainerRef,
  handleProgressBarMouseDown,
  handleProgressBarTouchStart,
  progress,
  progressBarRef,
  formatTime,
  currentTime,
  duration,
  handleSkipBackward,
  handlePlayPause,
  isPlaying,
  handleSkipForward,
  audioRef
}) {
  return <div className="card">
        <div className="progress-bar-container" ref={progressBarContainerRef}>
          <div className="progress-bar-hitbox" // Use the hitbox div for handling mouse events
      onMouseDown={handleProgressBarMouseDown} // Add onMouseDown event handler
      onTouchStart={handleProgressBarTouchStart} // Add onTouchStart event handler
      >
            <div className="progress-bar" style={{
          '--progress': progress + '%'
        }} ref={progressBarRef}>
              <div className="progress-thumb" style={{
            left: progress + '%'
          }}></div>
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
            {isPlaying ? <FaPause style={{
          verticalAlign: 'middle'
        }}/> : <FaPlay style={{
          verticalAlign: 'middle'
        }} />}
          </button>
          <button onClick={handleSkipForward}>
            <FaStepForward />
          </button>
        </div>
        <audio ref={audioRef} src="/audio/Dance The Night.mp3" />
      </div>;
}
  