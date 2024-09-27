import React, { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import { useGameContext } from './context/GameContext';
import { useNavigate } from 'react-router-dom';
import styles from './Game.module.css';

const spotifyApi = new SpotifyWebApi();




function Game() {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [nowPlaying, setNowPlaying] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const { playlist, setPlaylist } = useGameContext();
  const [round, setRound] = useState(-1);
  const { currentUser, setCurrentUser } = useGameContext();
  const [playlistName, setPlaylistName] = useState('');
  const { gamePlaylist, setGamePlaylist } = useGameContext();
  const { playerList, setPlayerList } = useGameContext();
  const [replay, setReplay] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [spotifyObjPlaylist, setSpotifyObjPlaylist] = useState(null);
  const [spotifyObjPlaylistID, setSpotifyObjPlaylistID] = useState('')
  const [albumImage, setAlbumImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setGamePlaylist(gamePlaylist.concat(playlist));
    console.log("GamePlaylist : ", gamePlaylist);
  }, []);


  useEffect(() => {
    if (spotifyObjPlaylist && spotifyObjPlaylist.images && spotifyObjPlaylist.images.length > 0) {
      console.log('Spotify Object Playlist updated:', spotifyObjPlaylist);
      setAlbumImage(spotifyObjPlaylist.images[0].url);
    }
  }, [spotifyObjPlaylist]);


  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };


  useEffect(() => {
    const intervalId = setInterval(getNowPlaying, 1000);
    return () => clearInterval(intervalId);

  }, []);



  useEffect(() => {

    console.log("Playlist : ", playlist);
    if (nowPlaying.progress_ms >= nowPlaying.duration_ms || (nowPlaying.progress_ms == 0 && nowPlaying.is_playing == false && round != -1)) {
      skip();
    }
  }, [nowPlaying]);

  const getNowPlaying = () => {
    
    spotifyApi.getMyCurrentPlaybackState()
      .then(function (data) {
        console.log('CurrentPlaybackstate :', data);
        if (data) {
          setNowPlaying({
            name: data.item.name,
            albumArt: data.item.album.images[0].url,
            progress_ms: data.progress_ms,
            duration_ms: data.item.duration_ms,
            uri: data.item.uri,
            is_playing: data.is_playing,
            artist: data.item.artists[0].name
          });
        }
      },
        function (err) {
          console.log('Something went wrong in hte currentPlaybackstate', err);
        }
      )
  }

  const savePlaylist = async (playlistName) => {
    try {
      // Create the playlist
      const createData = await spotifyApi.createPlaylist(currentUser.id, {
        name: playlistName,
        public: true,
      });
      console.log('Created playlist!', createData); // Log created playlist

      // Update state with the created playlist
      setSpotifyObjPlaylist(createData);
      setSpotifyObjPlaylistID(createData.id);

      // Add tracks to the playlist
      const addData = await spotifyApi.addTracksToPlaylist(createData.id, gamePlaylist.map((song) => song.uri));
      console.log('Added tracks to playlist!', addData); // Log added tracks

      // Fetch updated playlist data to ensure it has tracks
      const updatedPlaylist = await spotifyApi.getPlaylist(createData.id);
      console.log('Updated playlist after adding tracks:', updatedPlaylist); // Log updated playlist
      setSpotifyObjPlaylist(updatedPlaylist);

    } catch (err) {
      console.error('Something went wrong!', err); // Log any error that occurs
    }
  };





  function play(track) {
    // Vérifier si un ID de morceau est fourni
    if (!track) {
      console.log('No song ID provided');
      return Promise.resolve(1); // Return a resolved promise with value 1
    }

    // Appel à l'API Spotify pour jouer un morceau sur un appareil actif
    return spotifyApi.play({
      uris: [track.uri]
    })
      .then(function () {
        console.log('Playback started for song ID:', track);
        playlist.splice(playlist.indexOf(track), 1);
        setRound(round + 1);

        // Use setTimeout to handle playback duration and calling next step
        setTimeout(() => {
          getNowPlaying();  // Appelle la fonction next après que la durée soit écoulée
        }, track.duration_ms);

        return 0;  // Return 0 to indicate success
      })
      .catch(function (err) {
        if (err.status === 404 && err.responseText.includes("NO_ACTIVE_DEVICE")) {
          alert('No active device found to play the track.');
          return 1; // Return 1 if no active device is found
        } else {
          console.log('Something went wrong while trying to play the track:', err);
          return 1;  // Return 1 for other errors
        }
      });
  }


  const start = () => {

    const randint = Math.floor(Math.random() * playlist.length);
    const image = playlist[randint].album.images[0].url;
    const name = playlist[randint].name;
    play(playlist[randint]);
    
    setNowPlaying({
      name: name,
      albumArt: image
    });




  }


  const skip = async () => {
    console.log('SONG SKIPPED');
  
    if (playlist.length !== 0) {
      const randint = Math.floor(Math.random() * playlist.length);
  
      try {
        // Wait for the play() function to complete
        console.log('randintBEFORE PLAY:', randint);
        const image = playlist[randint].album.images[0].url;
        const name = playlist[randint].name;
        play(playlist[randint]);

        setNowPlaying({
          name: name,
          albumArt: image
        });
      } catch (err) {
        console.error('Error while playing track:', err);
      }
    } else {
      exit();
    }
  }
  const exit = () => {
    setReplay(true);
    spotifyApi.pause()
      .then(function () {
        console.log('Playback paused');
      })
      .catch(function (err) {
        console.log('Something went wrong while trying to pause the playback:', err);
      });

  }
  const handleReplay = () => {
    navigate('/song-selection');
  }
  const handleLeave = () => {
    setPlaylistName((prevPlaylistName) => {
      var newPlaylistName = prevPlaylistName;
      playerList.forEach((playerName) => {
        newPlaylistName = newPlaylistName + playerName.trim().slice(0, 3);
      })
      return "[Chopin] " + newPlaylistName;
    })
    setShowPlaylistForm(true);
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameInnerContainer}>
        {round === -1 ? (
          <button className={styles.gameButton} onClick={start}>Play</button>
        ) : (
          <>
            {replay ? (
              <>
                {!showPlaylistForm && (
                  <div className={styles.replayOrLeave}>
                    <button className={styles.gameButton} onClick={handleReplay}>Replay</button>
                    <button className={styles.gameButton} onClick={handleLeave}>Leave</button>
                  </div>
                )}
                {showPlaylistForm && (
                  <>
                    {/* Input for naming the playlist */}
                    {!spotifyObjPlaylist && (
                      <h3>
                        Save to Spotify
                      </h3>
                    )}

                    {!spotifyObjPlaylist && (
                      <div className={styles.playlistInputContainer}>
                        <input
                          id="playlistName"
                          type="text"
                          value={playlistName}
                          onChange={(e) => setPlaylistName(e.target.value)}
                          placeholder="MyPlaylist"
                          className={styles.gameInput} // Apply input styles
                        />
                      </div>
                    )}

                    {/* Show the link if the playlist was successfully saved */}
                    {spotifyObjPlaylist && spotifyObjPlaylist.external_urls.spotify && (
                      <div className={styles.playlistLink}>
                        <div className={styles.coverImageContainer}>
                          <img src={albumImage} className={styles.playlistCoverPicture} />
                        </div>
                        {playlistName} : {'\n'}
                        <a
                          href={spotifyObjPlaylist.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {spotifyObjPlaylist.external_urls.spotify}
                        </a>
                      </div>
                    )}

                    {/* Save playlist button */}
                    {!spotifyObjPlaylist && (
                      <button className={styles.gameButton} onClick={() => savePlaylist(playlistName)}>
                        Save Playlist
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                
                <div className={styles.nowPlaying}>{nowPlaying.name} - {nowPlaying.artist}</div>
                <div className={styles.albumImageContainer}> {/* New container for the image */}
                  <img src={nowPlaying.albumArt} className={styles.nowPlayingImage} alt={nowPlaying.name} />
                </div>
                <button className={styles.gameButton} onClick={skip}>Next</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;