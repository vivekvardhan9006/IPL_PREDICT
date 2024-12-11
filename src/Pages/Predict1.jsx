import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Predict1.css';
import CSKoutline from '../Assets/Team_images/CSKoutline.webp';
import DCoutline from '../Assets/Team_images/DCoutline.webp';
import GToutline from '../Assets/Team_images/GToutline.webp';
import KKRoutline from '../Assets/Team_images/KKRoutline.webp';
import LSGoutline from '../Assets/Team_images/LSGoutline.webp';
import MIoutline from '../Assets/Team_images/MIoutline.webp';
import PBKSoutline from '../Assets/Team_images/PBKSoutline.webp';
import RCBoutline from '../Assets/Team_images/RCBoutline.webp';
import RRoutline from '../Assets/Team_images/RRoutline.webp';
import SRHoutline from '../Assets/Team_images/SRHoutline.webp';

const IPLTeamsSelection = () => {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const navigate = useNavigate();

  // useEffect(() => {
  //   localStorage.removeItem('index2');
  //   localStorage.removeItem('tossWinner');
  //   localStorage.removeItem('selectedOption');
  //   localStorage.removeItem('team1');
  //   localStorage.removeItem('team2');
  //   localStorage.removeItem('toss_Winner');
  //   localStorage.removeItem('toss_decision');
  //   localStorage.removeItem('venue');
  // }, []);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Store selected teams in local storage whenever it changes
    localStorage.setItem('selectedTeams', JSON.stringify(selectedTeams));
  }, [selectedTeams]);

  const teams = [
    { id: 1, name: 'Chennai Super Kings', imageSrc: CSKoutline },
    { id: 2, name: 'Delhi Capitals', imageSrc: DCoutline },
    { id: 3, name: 'Gujarat Titans', imageSrc: GToutline },
    { id: 4, name: 'Kolkata Knight Riders', imageSrc: KKRoutline },
    { id: 5, name: 'Lucknow Super Giants', imageSrc: LSGoutline },
    { id: 6, name: 'Mumbai Indians', imageSrc: MIoutline },
    { id: 7, name: 'Punjab Kings', imageSrc: PBKSoutline },
    { id: 8, name: 'Royal Challengers Bangalore', imageSrc: RCBoutline },
    { id: 9, name: 'Rajasthan Royals', imageSrc: RRoutline },
    { id: 10, name: 'Sunrisers Hyderabad', imageSrc: SRHoutline },
  ];

  const handleTeamSelect = (team) => {
    setSelectedTeams((prevSelectedTeams) => {
      if (prevSelectedTeams.find((t) => t.id === team.id)) {
        // Remove the team if already selected
        return prevSelectedTeams.filter((t) => t.id !== team.id);
      } else if (prevSelectedTeams.length < 2) {
        // Add the team if less than 2 are selected
        return [...prevSelectedTeams, team];
      } else {
        alert('You can only select two teams!');
        return prevSelectedTeams;
      }
    });
  };

  const handleNextClick = () => {
    if (selectedTeams.length === 2) {
      // Store selected teams in localStorage
      // localStorage.setItem('team1', selectedTeams[0]);
      // localStorage.setItem('team2', selectedTeams[1]);
 
      navigate('/Predict2');
    } else {
      alert('Please select two teams.');
    }
  };

  const containerStyle = {
    minHeight: windowHeight,
    maxHeight: windowHeight,
  };

  return (
    <div className="ipl-teams-container" style={containerStyle}>
      <header className="header">
        <h1>Select IPL Teams</h1>
      </header>

      <div className="teams-grid-container">
        <div className="teams-grid">
          {teams.map((team) => {
            const isSelected = selectedTeams.find((t) => t.id === team.id);
            const isVisible = selectedTeams.length < 2 || isSelected;

            if (!isVisible) return null;

            return (
              <div
                key={team.id}
                className={`team-card ${isSelected ? 'selected' : ''} fade-in`}
                onClick={() => handleTeamSelect(team)}
              >
                <img src={team.imageSrc} alt={team.name} />
                <p>{team.name}</p>
                {isSelected && (
                  <div className="team-overlay">
                    TEAM {selectedTeams.findIndex((t) => t.id === team.id) + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="selected-teams-footer">
        {selectedTeams.length > 0 && (
          <div className="selected-teams-display">
            {selectedTeams[0] && (
              <div className="selected-team">
                <img src={selectedTeams[0].imageSrc} alt={selectedTeams[0].name} />
                <p>{selectedTeams[0].name}</p>
              </div>
            )}

            {selectedTeams.length === 2 && <div className="vs-text">VS</div>}

            {selectedTeams[1] && (
              <div className="selected-team">
                <img src={selectedTeams[1].imageSrc} alt={selectedTeams[1].name} />
                <p>{selectedTeams[1].name}</p>
              </div>
            )}
          </div>
        )}

        {selectedTeams.length === 2 && (
          <button className="next-button" onClick={handleNextClick}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default IPLTeamsSelection;
