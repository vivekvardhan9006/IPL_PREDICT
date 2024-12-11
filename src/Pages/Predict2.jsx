import React, { useState, useEffect } from 'react';
import '../Styles/Predict2.css';
import { useNavigate } from 'react-router-dom';

const VenueSelection = () => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const navigate = useNavigate();

  const venues = [
    "Arun Jaitley Stadium, Delhi",
    "Barabati Stadium, Cuttack",
    "Barsapara Cricket Stadium, Guwahati",
    "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
    "Brabourne Stadium, Mumbai",
    "Buffalo Park, East London",
    "De Beers Diamond Oval, Kimberley",
    "Dr. DY Patil Sports Academy, Mumbai",
    "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
    "Dubai International Cricket Stadium, Dubai",
    "Eden Gardens, Kolkata",
    "Feroz Shah Kotla, Delhi",
    "Green Park, Kanpur",
    "Himachal Pradesh Cricket Association Stadium, Dharamsala",
    "Holkar Cricket Stadium, Indore",
    "JSCA International Stadium Complex, Ranchi",
    "Kingsmead, Durban",
    "M. Chinnaswamy Stadium, Bengaluru",
    "MA Chidambaram Stadium, Chepauk, Chennai",
    "Maharashtra Cricket Association Stadium, Pune",
    "Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur",
    "Narendra Modi Stadium, Ahmedabad",
    "Nehru Stadium, Kochi",
    "New Wanderers Stadium, Johannesburg",
    "Newlands, Cape Town",
    "OUTsurance Oval, Bloemfontein",
    "Punjab Cricket Association IS Bindra Stadium, Mohali",
    "Rajiv Gandhi International Stadium, Uppal, Hyderabad",
    "Sardar Patel Stadium, Motera, Ahmedabad",
    "Saurashtra Cricket Association Stadium, Rajkot",
    "Sawai Mansingh Stadium, Jaipur",
    "Shaheed Veer Narayan Singh International Stadium, Raipur",
    "Sheikh Zayed Stadium, Abu Dhabi",
    "Sharjah Cricket Stadium, Sharjah",
    "St George's Park, Port Elizabeth",
    "Subrata Roy Sahara Stadium, Pune",
    "SuperSport Park, Centurion",
    "Vidarbha Cricket Association Stadium, Jamtha, Nagpur",
    "Wankhede Stadium, Mumbai",
    "Zayed Cricket Stadium, Abu Dhabi"
  ];

  useEffect(() => {
    // Store selected venue in local storage under 'venue' key whenever it changes
    if (selectedVenue) {
      localStorage.setItem('venue', selectedVenue);
    }
  }, [selectedVenue]);

  const handleVenueClick = (venueName) => {
    setSelectedVenue((prevVenue) => (prevVenue === venueName ? null : venueName));
  };

  const handleConfirmClick = () => {
    if (selectedVenue) {
      alert(`You have confirmed: ${selectedVenue}`);
      navigate('/Predict3'); // Change this to your actual toss selection page
    } else {
      alert("Please select a venue before confirming.");
    }
  };

  return (
    <div className="screen-container">
      <div className="background-image"></div>
      <h1>Select a Venue</h1>
      <div className="venue-container">
        {venues.map((venue, index) => (
          <div
            key={index}
            className={`venue ${selectedVenue === venue ? 'selected' : ''}`}
            onClick={() => handleVenueClick(venue)}
          >
            {venue}
          </div>
        ))}
      </div>
      {selectedVenue && (
        <div className="selected-venue" id="selectedVenueContainer">
          <h2>You have selected:</h2>
          <div className="selected-venue-name" id="selectedVenue">
            {selectedVenue}
          </div>
          <button id="confirmButton" onClick={handleConfirmClick}>
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default VenueSelection;
