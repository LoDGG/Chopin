import React, { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import { useGameContext } from './context/GameContext';
import { useNavigate } from 'react-router-dom';
import PlayerSelection from './PlayerSelection';
import SongSelection from "./SongSelection";
import './Login.css';


var spotifyApi = new SpotifyWebApi(); 

const getTokenfromUrl = () => {
    return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
        let parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
    }, {});
}




function Login() {
    const [spotifyToken, setSpotifyToken] = useState(null);
    const [nowPlaying, setNowPlaying] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const { playlist, setPlaylist } = useGameContext();
    const { currentUser, setCurrentUser } = useGameContext();

    const navigate = useNavigate();
    

    useEffect(() => {
        console.log("Playlist in Login.js: ", playlist);
      }, [playlist]);
    
    useEffect(() => {
      if (loggedIn) 
        navigate('/song-selection');
    }, [loggedIn]);

    useEffect(() => {
        console.log("This is what we derived from the URL: ", getTokenfromUrl());
        const spotifyToken = getTokenfromUrl().access_token;
        window.location.hash = "";
        console.log("This is the token: ", spotifyToken);

        if (spotifyToken) {
            setSpotifyToken(spotifyToken);
            //use SpotifyWebApi to get access to Spotify API
            spotifyApi.setAccessToken(spotifyToken);
            setLoggedIn(true);
            spotifyApi.getMe()
            .then(function(data) {
                console.log('Some information about the authenticated user', data);
                setCurrentUser(data);
        }, function(err) {
          console.log('Something went wrong!', err);
        });

        }
    });

    const getNowPlaying = () => {

        setNowPlaying({
                     name: playlist[0].name,
                     albumArt: playlist[0].album.images[0].url
                 });

        spotifyApi.play({uris: ["spotify:track:" + playlist[0].id]}).then(
            function(data) {
              console.log('Artist albums', data.body);
            },
            function(err) {
              if (err.status === 404) {
                alert('No Active Device');
              }
            });
    
    }

    return (
      <div className="Login">
          <>
            <h2>Welcome! Login to start</h2>
            <a href="http://localhost:8888/login">
              <img
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/spotify-white-icon.png"
                alt="Spotify Logo"
                className="spotify-logo"
              />
              Login to Spotify
            </a>
          </>
      </div>
    );
    
}
export default Login;