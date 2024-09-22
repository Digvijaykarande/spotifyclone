import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./Songdetailscss.css";


const SongDetails = () => {
  const { songId } = useParams();
  const [songDetails, setSongDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem('spotifyAccessToken');
    if (token) {
      setAccessToken(token);
    } else {
      setError('Access token not found');
      setLoading(false);
      return;
    }

    const fetchSongDetails = async () => {
      try {
        console.log('Fetching details for song ID:', songId);
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSongDetails(response.data);
      } catch (err) {
        console.error('Error fetching song details:', err);
        setError('Failed to fetch song details');
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [songId]);

  if (loading) {
    return <p>Loading song data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='songdetails'>
      {songDetails && (
        <>
          <h1>{songDetails.name}</h1>
          {songDetails.album.images.length > 0 && (
            <img src={songDetails.album.images[0].url} alt={songDetails.name} />
          )}
          <p>Artist: {songDetails.artists.map(artist => artist.name).join(', ')}</p>
          <p>Album: {songDetails.album.name}</p>

         {console.log(songDetails)}
          {songDetails.external_urls && (
           <audio controls>
            <source src={songDetails.preview_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          
      )}
        </>
      )}
    </div>
  );
};

export default SongDetails;
