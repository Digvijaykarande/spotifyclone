import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Spotify from './Components/Spotify';
import SongDetails from './Components/SongDetails';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Spotify /> } />
        <Route path="/details/:songId" element={<SongDetails />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
