import React, { useState, useEffect } from 'react';
import { useGameContext } from './context/GameContext'; // Import your context
import { useNavigate } from 'react-router-dom';
import './PlayerSelection.css';

const PlayerSelection = () => {
  const { playerList, setPlayerList } = useGameContext(); // Access playerList and setPlayerList from context
  const { playlist, setPlaylist } = useGameContext();
  const {gamePlaylist, setGamePlaylist} = useGameContext();
  const {n, setN} = useGameContext();
  const [playerName, setPlayerName] = useState('');
  
  const navigate = useNavigate();

  // Clear localStorage when the component loads
  useEffect(() => {
    setPlayerList([]); // Clear playerList
    setPlaylist([]); // Clear playlist
    setGamePlaylist([]); // Clear gamePlaylist
    setN(1); // Clear n
    localStorage.removeItem('playlist');
    localStorage.removeItem('playerList');
    localStorage.removeItem('gamePlaylist');
    localStorage.removeItem('n');
    localStorage.clear();
  }, []);
  useEffect(() => {
    console.log("N : ", n);
  }
  , [n]);
  

  // Handle adding a player to the playerList
  const addPlayer = () => {
    if (playerName.trim() !== '') {
      setPlayerList((prevPlayerList) => [...prevPlayerList, playerName.trim()]);
      setPlayerName(''); // Clear the input field after adding the player
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
  };

  
  const startGame = () => {
    if (playerList.length > 1) {
      navigate('/login'); // Navigate to SongSelection route
    } else {
      alert("Please add at least two player before starting.");
    }
  };

  // Handle Enter key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const increaseN = () => {
    setN(n + 1);
  };

  const decreaseN = () => {
    if (n > 1)    
    setN(n - 1);
  };

  return (
    <div className="player-selection">
          <input
            type="text"
            placeholder="Enter player name"
            value={playerName}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="playerInput"
          />

      <button onClick={addPlayer}>Add Player</button>

      <h3>Player List</h3>
      <ul>
        {playerList.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>

      
      <button onClick={decreaseN}>-</button>
      <button onClick={increaseN}>+</button>
      <h2>{n} songs by player</h2>
      

      <button onClick={startGame} disabled={playerList.length < 2}>
        Play
      </button>
    </div>
  );
};

export default PlayerSelection;
