import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Row, Card, Button} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from './context/GameContext';
import './SongSelection.css';

const CLIENT_ID = "e9f2d6bd6f3a4badbd019e27348cc60b";
const CLIENT_SECRET = "af29a25fdd984740bf53174f77c78b13";

function SongSelection() {
  const [data, setData] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const { playlist, setPlaylist } = useGameContext();
  const { playerList, setPlayerList } = useGameContext();
  const [currentPlayerId, setCurrentPlayerId] = useState(0)
  const [currentPlayer, setCurrentPlayer] = useState(playerList[currentPlayerId]);
  console.log("Playlist: ", playlist);
  const navigate = useNavigate();
  const {n, setN} = useGameContext();
  const [count, setCount] = useState(n);

  

  const getData = async () => {
    const response = await Axios.get("http://localhost:3000/getData");
    setData(response.data);
  }

  useEffect(() => {
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      .catch(error => console.log(error))

    // getData();
  }, []); 

  useEffect(() => {
    if (searchInput.trim() === '') return; // Do nothing if searchInput is empty
    search();
  }, [searchInput]); // Dependency array includes searchInput

  useEffect(() => {
    setCurrentPlayer(playerList[currentPlayerId])
  }, [currentPlayerId]);

  useEffect(() => {
    console.log("N : ", n);
  }
  , [n]);


  //Search
  async function search() {
    console.log("searching for: " + searchInput);
    
    // Get request using seach to get artistID
    var searchParameters = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    var tracks = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track' , searchParameters)
      .then(response => response.json())
      
      .then(data => {
        console.log(data)
        setTracks(data.tracks.items)
      })
      .catch(error => console.log(error))
  }




  const handleCardClick = (track) => {
    
    setTracks([]);
    setSearchInput("");
    if (count  == 1 ) {
      setCount(n);
      setCurrentPlayerId(currentPlayerId + 1);
    }
    else {
      setCount(count - 1);
    }

    setPlaylist((prevPlaylist) => {
      const newPlaylist = [...prevPlaylist, track]; // Create the new playlist with the new track
  
      // Check if the new playlist length matches playerList length
      if (newPlaylist.length === playerList.length*n) {
        navigate('/game'); // Navigate to login if lengths match
      }
  
      return newPlaylist; // Return the updated playlist
    });

    console.log("PlayerList: ", playerList);
    console.log("Playlist: ", playlist);

    // Add logic to handle the click event, such as navigating to a new page or playing a song
  };

  const nextButtonHandler = () => {
    console.log(searchInput);
    console.log("Playlist: ", playlist);
    setTracks([]);
    setSearchInput("");
    setCurrentPlayerId(currentPlayerId + 1);
    if (playlist.length == playerList.length ) {
      navigate('/login');
   }
    
  };


    // Display all the albums



    return (
      <div className="App">
        <Container>
          <div className="playerName">{currentPlayer} choisit un son</div>
          <InputGroup className="mb-3 InputGroup" size="lg">
            <FormControl
              placeholder="Search For Song"
              type="input"
              value={searchInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  console.log("pressed enter");
                }
              }}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
            {/* <button onClick={nextButtonHandler}>Next</button> */}
          </InputGroup>
        </Container>
  
        <Container className="Container">
          <Row className="Row">
            {tracks.map((track, i) => (
              <Card onClick={() => handleCardClick(track)} className="clickable-card" key={i}>
                <Card.Img src={track.album.images[0].url} className="card-img" />
                <Card.Body>
                  <Card.Title className="card-title">{track.name}</Card.Title>
                  <Card.Text className="card-text">{track.artists[0].name}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Row>
        </Container>
      </div>
    );
  };
  
  export default SongSelection;


