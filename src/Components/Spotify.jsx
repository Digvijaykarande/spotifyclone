import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Spotifycss.css'; 
import Scalton from "./ScaltonStructure"

const Spotify = () => {
  const clientId = '205992373a3b414a9220bf4c47243d3a'; 
  const redirectUri = 'http://localhost:5173'; 
  const scopes = 'user-read-private user-read-email'; 

  const [loading,setloading]=useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState([]); 
  const [defaultTracks, setDefaultTracks] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = window.localStorage.getItem('spotifyAccessToken');
    if (storedToken) {
      setAccessToken(storedToken);
      fetchDefaultBollywoodSongs(storedToken); 
    } else {
      const hash = window.location.hash;
      if (hash) {
        const token = new URLSearchParams(hash.slice(1)).get('access_token');
        if (token) {
          window.localStorage.setItem('spotifyAccessToken', token); 
          window.location.hash = ''; 
          setAccessToken(token);
          fetchDefaultBollywoodSongs(token); 
        } else {
          console.error('Access token not found in URL hash');
        }
      }
    }
  }, []);

  const fetchDefaultBollywoodSongs = async (token) => {
    setloading(true);
    try {
      const bollywoodSongIds = [
        '1feANd8EfcDP5UqSvbheM3',
        '5zCnGtCl5Ac5zlFHXaZmhy',
        '4bD9z9qa4qg9BhryvYWB7c',
        '0HqZX76SFLDz2aW8aiqi7G',
        '5qtEWwRUX3GKgpWwDQf9SA',
        '2eWLNSTA7RvUBmnTYVvR8s',
        '7qXEEgmtyvS53VahIe9vPJ',
        '3yHyiUDJdz02FZ6jfUbsmY',
        '2Wu9PNpLUCBl3W1GaPqkhl',
      ];
      const requests = bollywoodSongIds.map(id =>
        axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const responses = await Promise.all(requests);
      setDefaultTracks(responses.map(response => response.data));
    } catch (error) {
      console.error('Error fetching default Bollywood songs:', error);
    }finally{
      setloading(false);
    }
  };

  const handleClick = (songId) => {
    navigate(`/details/${songId}`); 
  };

  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
    window.location.href = authUrl;
  };

  const fetchTracks = async () => {
    if (!searchQuery) return;
    setloading(true)
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: searchQuery,
          type: 'track',
          limit: 10,
        },
      });
      setTracks(response.data.tracks.items);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }finally{
      setloading(false)
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTracks();
  };

  return (
    <div>
     
      <div className='logindiv'>
        <h1>Spotifyy Music</h1>
        {!accessToken ? (
          <button onClick={handleLogin}>Login to Spotify</button>
        ) : (
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for song,artist,tracks..."
            />
            <button type="submit">Search</button>
          </form>
        )}
      </div>

      <div className='themaindiv'>
       {loading ?
       (<Scalton />)
       :(<div className='thediv'>
        {searchQuery === '' && defaultTracks.map((track) => (
          <div key={track.id} className='songcard' onClick={() => handleClick(track.id)}>
            {track.album.images.length > 0 && (
              <img src={track.album.images[0].url} alt={track.name} className='songimg' />
            )}
            <h3>{track.name}</h3>
            {track.preview_url && (
              <audio controls>
                <source src={track.preview_url} type="audio/mpeg" />
              </audio>
            )}
          </div>
        ))}

        
        {tracks.map((track) => (
          <div key={track.id} className='songcard' onClick={() => handleClick(track.id)}>
            {track.album.images.length > 0 && (
              <img src={track.album.images[0].url} alt={track.name} className='songimg' />
            )}
            <h3>{track.name}</h3>
            {track.preview_url && (
              <audio controls>
                <source src={track.preview_url} type="audio/mpeg" />
              </audio>
            )}
          </div>
        ))}
       </div>)}
      </div>
      
      <div className='developer-div'>
        <p>created by:  
          <a href='https://github.com/Digvijaykarande' style={{color:'white'}}>
           Digvijay karande</a></p>
      </div>
    </div>
    
  );
};

export default Spotify;
