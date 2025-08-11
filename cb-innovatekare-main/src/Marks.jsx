import axios from "axios";
import { useEffect, useState } from "react";
import api from "./api";

function Marks() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSector, setCurrentSector] = useState(0);
    const [current, setCurrent] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState(sessionStorage.getItem("password"));
    const [error, setError] = useState("");
    const sectors = ["456", "067", "101", "001", "218","199"];
    const [scores, setScores] = useState({
        implementationFunctionality: { criteria: "Implementation & Functionality", marks: "", max: 15 },
        innovationCreativity: { criteria: "Innovation & Creativity", marks: "", max: 10 },
        userExperienceDesign: { criteria: "User Experience & Design", marks: "", max: 10 },
        impactPracticality: { criteria: "Impact & Practicality", marks: "", max: 10 },
        presentationCommunication: { criteria: "Presentation & Communication", marks: "", max: 10 },
        completionEffort: { criteria: "Completion & Effort", marks: "", max: 5 }
    }
    );

    // Reset scores function to clear scores
    const resetScores = () => {
        setScores({
            implementationFunctionality: { criteria: "Implementation & Functionality", marks: "", max: 15 },
            innovationCreativity: { criteria: "Innovation & Creativity", marks: "", max: 10 },
            userExperienceDesign: { criteria: "User Experience & Design", marks: "", max: 10 },
            impactPracticality: { criteria: "Impact & Practicality", marks: "", max: 10 },
            presentationCommunication: { criteria: "Presentation & Communication", marks: "", max: 10 },
            completionEffort: { criteria: "Completion & Effort", marks: "", max: 5 }
        }
        );
    };

    useEffect(() => {
        if(password === "kluitkare2025"){
            setIsAuthenticated(true);
        }
        
        async function fetchData() {
            try {
                let res = await axios.get(`${api}/event/students`);
                setTeams(res.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        }
        
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "itkare2025") {
            setIsAuthenticated(true);
            sessionStorage.setItem("password", password);
            setError("");
        } else {
            setError("Incorrect password. Please try again.");
        }
    };

    const getSectorTeams = (sectorIndex) => teams.slice(sectorIndex * 15, (sectorIndex + 1) * 15);

    const handleScoreChange = (key, value) => {
        if(Number(value)<=scores[key].max){
        value = Math.min(scores[key].max, Math.max(0, parseInt(value) || 0));
        setScores(prev => ({ ...prev, [key]: { ...prev[key], marks: value } }));
        }
    };

    const calculateTotalMarks = () => {
        return Object.values(scores).reduce((total, item) => total + item.marks, 0);
    };

    // Update the handle team change function
    const handleTeamChange = (newCurrent) => {
        // First save the current data if needed
        resetScores(); // Reset scores before changing team
        setCurrent(newCurrent);
    };

    const handleSectorChange = (newSector) => {
        resetScores(); // Reset scores before changing sector
        setCurrentSector(newSector);
        setCurrent(0); // Start at first team in new sector
    };

    const handleSubmitScores = async () => {
        const sectorTeams = getSectorTeams(currentSector);
        const currentTeam = sectorTeams[current];
        
        if (!currentTeam?._id) {
            setSubmitStatus({ type: 'error', message: 'Cannot identify team ID' });
            return;
        }
        
        setSubmitting(true);
        setSubmitStatus(null);
        
        try {
            await axios.post(`${api}/event/team/score/${currentTeam._id}`, {
                score: calculateTotalMarks(),
                SecoundReview: scores
            });
            
            const updatedTeams = [...teams];
            const teamIndex = currentSector * 15 + current;
            updatedTeams[teamIndex] = {
                ...updatedTeams[teamIndex],
                SecoundReviewScore: calculateTotalMarks(),
                SecoundReview: true
            };
            setTeams(updatedTeams);
            
            setSubmitStatus({ type: 'success', message: 'Scores submitted successfully!' });
            
            // Only reset and move to the next team after everything is successful
            setTimeout(() => {
                resetScores();
                if (current < sectorTeams.length - 1) {
                    setCurrent(current + 1);
                }
            }, 500); // Small delay to ensure UI updates properly
            
        } catch (error) {
            alert("something went wrong")
            setSubmitStatus({ type: 'error', message: 'Failed to submit scores. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl text-white text-center mb-6">Marks Dashboard Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-white mb-2">Password</label>
                            <input 
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">Loading...</div>;

    const sectorTeams = getSectorTeams(currentSector);
    const currentTeam = sectorTeams[current];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-5">
            <div className="flex justify-between mb-5">
                <div className="flex justify-center flex-wrap">
                    {sectors.map((sector, index) => (
                        <button
                            key={sector}
                            className={`mx-2 m-2 px-4 py-2 rounded ${currentSector === index ? 'bg-blue-700' : 'bg-gray-700'} text-white`}
                            onClick={() => handleSectorChange(index)}
                        >
                            {sector}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => {
                        setIsAuthenticated(false);
                        sessionStorage.removeItem("password");
                    }} 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                    Logout
                </button>
            </div>
            <div className="flex justify-center mb-5">
                <select
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white"
                    value={current}
                    onChange={(e) => handleTeamChange(parseInt(e.target.value))}
                >
                    {sectorTeams.map((team, index) => (
                        <option key={team._id} value={index}>
                            {currentSector * 15 + index + 1}. {team.teamname}
                        </option>
                    ))}
                </select>
            </div>
            <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-4">{currentTeam?.teamname || 'No Team'}</h1>
                <div className="text-lg mb-3">Current Team: {current + 1 + currentSector * 15} / {teams.length}</div>
                <div className="text-left">
                    <p><strong>Domain:</strong> {currentTeam?.Domain}</p>
                    <p><strong>Problem Statement:</strong> {currentTeam?.ProblemStatement}</p>
                </div>
            </div>
            <div className="flex justify-between m-5">
                <button
                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    onClick={() => handleTeamChange(Math.max(current - 1, 0))}
                    disabled={current === 0}
                >
                    Previous
                </button>
                <button
                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    onClick={() => handleTeamChange(Math.min(current + 1, sectorTeams.length - 1))}
                    disabled={current === sectorTeams.length - 1}
                >
                    Next
                </button>
            </div>
            <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg mt-5">
                <h2 className="text-2xl font-semibold mb-3">Scores</h2>
                {Object.keys(scores).map((key) => (
                    <div key={key} className="flex justify-between items-center mb-4">
                        <span className="font-medium">{scores[key].criteria}:</span>
                        <div className="flex justify-center items-center">
                            <input
                            value={scores[key].marks}
                                onChange={(e) => handleScoreChange(key, e.target.value)}
                                className="w-16 px-2 py-1 rounded bg-gray-700 text-white border border-gray-500 text-center"
                            /> 
                            <p className="ml-3">/ {scores[key].max}</p>
                        </div>
                    </div>
                ))}
                <div className="flex justify-between items-center mb-4 border-t border-gray-600 pt-3 mt-2">
                    <span className="font-bold text-xl">Total:</span>
                    {currentTeam && currentTeam.SecoundReviewScore ?
                        <span className="font-bold text-xl">{currentTeam.SecoundReviewScore} / 60</span> :
                        <span className="font-bold text-xl">{calculateTotalMarks()} / 60</span>
                    }
                </div>
                {currentTeam && !currentTeam.SecoundReview && (
                    <button
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold disabled:bg-gray-500"
                        onClick={handleSubmitScores}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Scores"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Marks;
