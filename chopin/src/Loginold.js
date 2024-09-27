import React from 'react';
import {useEffect, useState} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

function Login() {
  const CLIENT_ID = "e9f2d6bd6f3a4badbd019e27348cc60b"
  const REDIRECT_URI = "http://localhost:3000/login"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }

      setToken(token)

  }, [])

  const logout = () => {
      setToken("")
      window.localStorage.removeItem("token")
  }

  const GetNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log(response)
      })
  }

  return (
      <div className="Login">
          <header className="Login-header">
              <h1>Spotify React</h1>
              {!token ?
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                      to Spotify</a>
                  : <button onClick={GetNowPlaying}>Logout</button>}
          </header>
      </div>
  );
}


export default Login;