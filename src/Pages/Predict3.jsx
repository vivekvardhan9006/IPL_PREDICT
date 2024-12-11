import React, { useEffect, useState } from 'react';
import '../Styles/Predict3.css';
import { useNavigate } from 'react-router-dom';

// Import images with correct relative path
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

const teamImages = {
    'CSK': CSKoutline,
    'DC': DCoutline,
    'GT': GToutline,
    'KKR': KKRoutline,
    'LSG': LSGoutline,
    'MI': MIoutline,
    'PBKS': PBKSoutline,
    'RCB': RCBoutline,
    'RR': RRoutline,
    'SRH': SRHoutline
};

const TossSelection = () => {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [tossWinner, setTossWinner] = useState('');
    const [battingOrFielding, setBattingOrFielding] = useState('');
    const [finalSelectionConfirmed, setFinalSelectionConfirmed] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve selected teams from localStorage
        const storedTeams = JSON.parse(localStorage.getItem('selectedTeams')) || [];
        const teamsWithImages = storedTeams.map(team => ({
            ...team,
            imgSrc: teamImages[team.name] || null // Add fallback for missing images
        }));
        setSelectedTeams(teamsWithImages);
    }, []);

    const formatTossDecision = (decision) => {
        return decision === 'BATTING' ? 'bat' : 'field';
    };

    const validateData = () => {
        if (!selectedTeams || selectedTeams.length !== 2) {
            setError('Please select both teams');
            return false;
        }

        const storedVenue = localStorage.getItem('venue');
        if (!storedVenue) {
            setError('Please select a venue');
            return false;
        }

        if (!tossWinner) {
            setError('Please select a toss winner');
            return false;
        }

        if (!battingOrFielding) {
            setError('Please select batting or fielding decision');
            return false;
        }

        if (!selectedTeams.some(team => team.name === tossWinner)) {
            setError('Toss winner must be one of the selected teams');
            return false;
        }

        return true;
    };

    const handleTeamClick = (teamName) => {
        setTossWinner(teamName);
        localStorage.setItem('toss_winner', teamName);
        setError(null);  // Clear error if team selection is successful
    };

    const handleBattingOrFieldingSelection = (option) => {
        setBattingOrFielding(option);
        localStorage.setItem('toss_decision', option);
        setError(null);  // Clear error if decision selection is successful
    };

    const handleFinalConfirm = async () => {
        try {
            if (!validateData()) return;

            setIsLoading(true);
            setError(null);

            const team1 = selectedTeams[0]?.name;
            const team2 = selectedTeams[1]?.name;
            const storedVenue = localStorage.getItem('venue');

            const requestData = {
                team1,
                team2,
                venue: storedVenue,
                toss_winner: tossWinner,
                toss_decision: formatTossDecision(battingOrFielding)
            };

            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to get prediction');
            }

            setPrediction(result);
            setFinalSelectionConfirmed(true);
        } catch (err) {
            setError(err.message || 'Failed to get prediction');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="toss-selection-container">
            <h1>Select Toss Winner</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="team-containers">
                {selectedTeams.map((team, index) => (
                    <div
                        key={index}
                        className={`team ${tossWinner === team.name ? 'selected' : ''}`}
                        onClick={() => handleTeamClick(team.name)}
                    >
                        {team.imgSrc ? (
                            <img
                                src={team.imgSrc}
                                alt={team.name}
                                onError={(e) => {
                                    console.error(`Image failed to load for team: ${team.name}`);
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="team-name-placeholder">{team.name}</div>
                        )}
                        <p>{team.name}</p>
                    </div>
                ))}
            </div>

            {tossWinner && (
                <div className="selected-toss">
                    <h2>Selected Toss Winner: {tossWinner}</h2>
                    <div className="batting-fielding-selection">
                        <button
                            className={`choice-button ${battingOrFielding === 'BATTING' ? 'selected' : ''}`}
                            onClick={() => handleBattingOrFieldingSelection('BATTING')}
                        >
                            BATTING
                        </button>
                        <button
                            className={`choice-button ${battingOrFielding === 'FIELDING' ? 'selected' : ''}`}
                            onClick={() => handleBattingOrFieldingSelection('FIELDING')}
                        >
                            FIELDING
                        </button>
                    </div>
                </div>
            )}

            {battingOrFielding && (
                <button
                    className="predict-button"
                    onClick={handleFinalConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? 'Getting Prediction...' : 'Get Prediction'}
                </button>
            )}

            {prediction && (
                <div className="prediction-result">
                    <h3>Match Prediction</h3>
                    <p>Predicted Winner: {prediction.predicted_winner}</p>
                </div>
            )}

            {finalSelectionConfirmed && prediction && (
                <div className="prediction-summary">
                    <h3>Prediction Summary</h3>
                    <p>Teams: {selectedTeams[0]?.name} vs {selectedTeams[1]?.name}</p>
                    <p>Venue: {localStorage.getItem('venue')}</p>
                    <p>Toss Winner: {tossWinner}</p>
                    <p>Decision: {battingOrFielding}</p>
                </div>
            )}
            <div id="fireworks-container">
                <div class="firework"></div>
                <div class="firework"></div>
                <div class="firework"></div>
                <div class="firework"></div>
                <div class="firework"></div>
                <div class="firework"></div>
            </div>

            <script src="script.js"></script>
        </div>

    );
};

export default TossSelection;