// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import SongSelection from './SongSelection';
import PlayerSelection from './PlayerSelection';
import Login from './Login';
import Game from './Game';


function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
        <Route path="/" element={<PlayerSelection />} />
          <Route path="/song-selection" element={<SongSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
