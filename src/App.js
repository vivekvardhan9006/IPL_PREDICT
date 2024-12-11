// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/Home';
import Signup from './Pages/Signup';
import Signin from './Pages/Signin';
import Predict1 from './Pages/Predict1';
import Predict2 from './Pages/Predict2';
import Predict3 from './Pages/Predict3';
import PredictionResult from './Pages/PredictionResult';
import PredictionRequest from './Pages/PredictionRequest';
import ScorePrediction from './Pages/ScorePrediction';
import About from './Pages/About';
import Contact from './Pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Predict1" element={<Predict1 />} />
        <Route path="/Predict2" element={<Predict2 />} />
        <Route path="/Predict3" element={<Predict3 />} />
        <Route path='/PredictionResult' element={ <PredictionResult/> } />
        <Route path="/predict" element={<PredictionRequest />} />
        <Route path="/ScorePrediction" element={<ScorePrediction />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
