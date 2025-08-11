import { useEffect, useState } from "react";
import axios from "axios";
import api from "./api";
import { io } from "socket.io-client";
import SquidGame from "./SquidGame"; // Assuming this component exists
import { useNavigate } from "react-router-dom";

const socket = io(api);

// Naruto Themed Loader Component
const NarutoLoader = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <svg width="80" height="80" viewBox="0 0 100 100" className="animate-spin" style={{ animationDuration: '2s' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#FF5722" strokeWidth="4" />
            <circle cx="50" cy="50" r="15" fill="#FF5722" />
            <path d="M50 5 C 74.85 5, 95 25.15, 95 50 C 95 25.15, 74.85 5, 50 5" fill="none" stroke="#FF5722" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="120 50 50" dur="0.67s" repeatCount="indefinite" />
            </path>
            <path d="M50 5 C 25.15 5, 5 25.15, 5 50 C 5 25.15, 25.15 5, 50 5" fill="none" stroke="#FF5722" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" from="120 50 50" to="240 50 50" dur="0.67s" repeatCount="indefinite" />
            </path>
             <path d="M5 50 C 5 74.85, 25.15 95, 50 95 C 25.15 95, 5 74.85, 5 50" fill="none" stroke="#FF5722" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" from="240 50 50" to="360 50 50" dur="0.67s" repeatCount="indefinite" />
            </path>
        </svg>
        <p className="text-orange-400 text-xl font-naruto mt-4">Loading Missions...</p>
    </div>
);


function Admin() {
    const [teams, setTeams] = useState([]);
    const [verifiedCount, setVerifiedCount] = useState(0);
    const [notVerifiedCount, setNotVerifiedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sectors, setSectors] = useState(["456", "067", "101", "001", "218", "199"]);
    const [currentSectorIndex, setCurrentSectorIndex] = useState(0);
    const [showNotVerifiedModal, setShowNotVerifiedModal] = useState(false);
    const navigate = useNavigate();

    // --- New States for Domain Management ---
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [allDomains, setAllDomains] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        // This function now fetches teams and domains separately to prevent a total failure.
        async function fetchData() {
            setLoading(true);
            try {
                // --- Step 1: Fetch Teams (Primary Data) ---
                const teamsRes = await axios.get(`${api}/event/students`);
                const teamsData = teamsRes.data;
                setTeams(teamsData);
                setVerifiedCount(teamsData.filter(team => team.verified).length);
                setNotVerifiedCount(teamsData.filter(team => !team.verified).length);

                // --- Step 2: Fetch Domains (Secondary Data) ---
                try {
                    // IMPORTANT: You still need to create this '/domains' endpoint.
                    const domainsRes = await axios.get(`${api}/domains`);
                    setAllDomains(domainsRes.data);
                } catch (domainError) {
                    console.error("Could not fetch domains:", domainError);
                }

            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    
    // --- Handler for Changing a Team's Domain ---
    const handleDomainChange = async (teamId, newDomain) => {
        // Keep a copy of the original state in case of an error
        const originalTeams = [...teams];
        
        // Optimistically update the UI for a better user experience
        setTeams(prevTeams =>
            prevTeams.map(t =>
                t._id === teamId ? { ...t, Domain: newDomain } : t
            )
        );

        try {
            // IMPORTANT: You need to create this '/admin/updateDomain' endpoint on your backend.
            await axios.post(`${api}/admin/updateDomain`, {
                teamId: teamId,
                domain: newDomain
            });
        } catch (error) {
            console.error("Failed to update domain:", error);
            alert("Error: Could not update domain. Reverting the change.");
            // If the API call fails, revert the UI to the original state
            setTeams(originalTeams);
        }
    };


    const getTeamsInCurrentSector = () => {
        const currentSector = sectors[currentSectorIndex];
        return teams.filter(team => team.Sector === currentSector);
    };

    const handleSelectSector = (index) => {
        if (index >= 0 && index < sectors.length) {
            setCurrentSectorIndex(index);
        }
    };
    
    // Filter teams for the domain modal based on search term
    const filteredTeams = teams.filter(team =>
        team.teamname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6" style={{ backgroundImage: `url('https://images6.alphacoders.com/605/605598.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <div className="relative z-10">
                <h1 className="text-5xl font-naruto text-orange-500 text-center mb-10 drop-shadow-lg">Hokage's Dashboard</h1>
                
                <div className="flex flex-col md:flex-row justify-around mb-10 gap-6">
                    <div className="bg-green-800/50 border-2 border-green-500 text-white p-8 rounded-xl shadow-lg flex-1 text-center backdrop-blur-md">
                        <h2 className="text-2xl font-semibold mb-2">Verified Teams</h2>
                        <p className="text-5xl font-bold">{verifiedCount}</p>
                    </div>
                    <div
                        className="bg-red-800/50 border-2 border-red-500 text-white p-8 rounded-xl shadow-lg flex-1 text-center cursor-pointer backdrop-blur-md"
                        onClick={() => setShowNotVerifiedModal(true)}
                    >
                        <h2 className="text-2xl font-semibold mb-2">Pending Verification</h2>
                        <p className="text-5xl font-bold">{notVerifiedCount}</p>
                    </div>
                    <div className="bg-blue-800/50 border-2 border-blue-500 text-white p-8 rounded-xl shadow-lg flex-1 text-center backdrop-blur-md">
                        <h2 className="text-2xl font-semibold mb-2">Total Teams</h2>
                        <p className="text-5xl font-bold">{teams.length}</p>
                    </div>
                     <button
                        className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg font-semibold transition"
                        onClick={() => {
                            const futureTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();
                            socket.emit("domainOpen", { open: futureTime });
                        }}
                    >
                        Open Domain
                    </button>
                </div>

                {/* Not Verified Teams Modal */}
                {showNotVerifiedModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-md">
                        <div className="bg-gray-900 border-2 border-orange-500/50 rounded-xl shadow-lg p-8 w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl text-orange-400 font-naruto">Pending Verification</h2>
                                <button className="text-gray-400 hover:text-white text-3xl" onClick={() => setShowNotVerifiedModal(false)}>&times;</button>
                            </div>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {teams.filter(team => !team.verified).map((team, i) => (
                                    <div key={team._id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center shadow">
                                        <div>
                                            <p className="text-white font-semibold mb-1">#{i + 1} - {team.teamname}</p>
                                            <p className="text-gray-400 text-sm">{team.email}</p>
                                        </div>
                                        <button
                                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold shadow transition"
                                            onClick={async () => {
                                                await axios.post(`${api}/event/event/verify/${team._id}`);
                                                setTeams(prev => prev.map(t => t._id === team._id ? { ...t, verified: true } : t));
                                            }}
                                        >
                                            Verify
                                        </button>
                                    </div>
                                ))}
                                {teams.filter(team => !team.verified).length === 0 && (
                                    <p className="text-gray-400 text-center">All teams are verified!</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Domain Selections Modal */}
                {showDomainModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-md">
                        <div className="bg-gray-900 border-2 border-orange-500/50 rounded-xl shadow-lg p-6 w-full max-w-3xl flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl text-orange-400 font-naruto">Change Team Domains</h2>
                                <button className="text-gray-400 hover:text-white text-3xl" onClick={() => setShowDomainModal(false)}>&times;</button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search for a team..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 mb-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:border-orange-500"
                            />
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                {filteredTeams.map(team => (
                                    <div key={team._id} className="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center shadow gap-3">
                                        <p className="text-white font-semibold">{team.teamname}</p>
                                        <select
                                            value={team.Domain || ''}
                                            onChange={(e) => handleDomainChange(team._id, e.target.value)}
                                            className="w-full sm:w-1/2 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:border-orange-500"
                                        >
                                            <option value="" disabled>-- Select a Domain --</option>
                                            {allDomains.map(domain => (
                                                <option key={domain.id} value={domain.name}>
                                                    {domain.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                                {filteredTeams.length === 0 && (
                                    <p className="text-gray-400 text-center py-4">No teams found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center flex-wrap gap-3 mb-8">
                    {sectors.map((sector, index) => (
                        <button
                            key={sector}
                            onClick={() => handleSelectSector(index)}
                            className={`px-6 py-2 rounded-lg font-semibold shadow transition ${
                                currentSectorIndex === index
                                    ? 'bg-orange-600 text-white scale-105'
                                    : 'bg-gray-700/80 text-gray-300 hover:bg-orange-500/70 hover:text-white'
                            }`}
                        >
                            Sector {sector}
                        </button>
                    ))}
                </div>

                 <div className="flex justify-center flex-wrap gap-4 mb-8">
                    <button
                        className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg transition"
                        onClick={() => navigate("/all-teams")}
                    >
                        View & Assign All Teams
                    </button>
                    <button
                        className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold shadow-lg transition"
                        onClick={() => setShowDomainModal(true)}
                    >
                        Change Team Domains
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64"><NarutoLoader /></div>
                ) : (
                    <>
                        <h2 className="text-3xl text-orange-400 mb-6 text-center font-naruto">
                            Sector {sectors[currentSectorIndex]} Teams
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {getTeamsInCurrentSector().map((team, i) => (
                                <div
                                    key={team._id}
                                    className="bg-gray-800/80 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition backdrop-blur-sm border border-orange-500/30"
                                >
                                    <p className="text-lg text-orange-400 font-bold mb-2">
                                        #{i + 1} - {team.teamname}
                                    </p>
                                    <div className="w-full mb-4">
                                        <SquidGame team={team} />
                                    </div>
                                    {!team.verified && (
                                        <button
                                            className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold shadow transition"
                                            onClick={async () => {
                                                await axios.post(`${api}/event/event/verify/${team._id}`);
                                                // Refresh logic can be improved here
                                            }}
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {getTeamsInCurrentSector().length === 0 && (
                            <div className="bg-gray-800/80 p-8 text-center rounded-lg mt-8 shadow-lg backdrop-blur-sm">
                                <p className="text-gray-400 text-lg">No teams found in Sector {sectors[currentSectorIndex]}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Admin;
