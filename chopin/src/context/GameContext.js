import React, { createContext, useState, useContext, useEffect } from 'react';


const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // Retrieve playlist and playerList from localStorage (if they exist)
  const initialPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
  const initialGamePlaylist = JSON.parse(localStorage.getItem('gamePlaylist')) || [];
  const initialPlayerList = JSON.parse(localStorage.getItem('playerList')) || [];
  const initialN = JSON.parse(localStorage.getItem('n')) || 1;

  // State for playlist and playerList
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [gamePlaylist, setGamePlaylist] = useState(initialGamePlaylist);
  const [playerList, setPlayerList] = useState(initialPlayerList);
  const [currentUser, setCurrentUser] = useState(null);
  const [n, setN] = useState(initialN);

  // Save the playlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  // Save the playerList to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playerList', JSON.stringify(playerList));
  }, [playerList]);

  useEffect(() => {
    localStorage.setItem('gamePlaylist', JSON.stringify(gamePlaylist));
  }, [gamePlaylist]);

  useEffect(() => {
    localStorage.setItem('n', JSON.stringify(n));
  }, [n]);

  return (
    <GameContext.Provider value={{  playlist, setPlaylist, 
                                    playerList, setPlayerList, 
                                    currentUser, setCurrentUser, 
                                    n, setN, 
                                    gamePlaylist, setGamePlaylist, }}>
      {children}
    </GameContext.Provider>
  );
};

