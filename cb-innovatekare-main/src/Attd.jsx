import { useEffect, useState } from "react";
import "./admin.css";
import axios from "axios";
import api from "./api";
import AttenCard from "./components/Atted";

function Attd() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSector, setCurrentSector] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState(sessionStorage.getItem("password"));
    const [error, setError] = useState("");
    const sectors = ["456", "067", "101", "001", "218","199"];

    useEffect(() => {
        async function data() {
            try {
                let res = await axios.get(`${api}/event/students`);
                res = await res.data;
                setTeams(res);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        }
        if(password == "kluitkare2025"){
            setIsAuthenticated(true)
        }
        if (isAuthenticated) {
            data();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "kluitkare2025") {
            setIsAuthenticated(true);
            sessionStorage.setItem("password",password)
            setError("");
        } else {
            setError("Incorrect password. Please try again.");
        }
    };

    const getSectorTeams = (sectorIndex) => {
        const start = sectorIndex * 15;
        const end = start + 15;
        console.log(teams.slice(start, end))
        return teams.slice(start, end);
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl text-white text-center mb-6">Attendance Dashboard Login</h2>
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
    
    return (
        <div className="bg-gray-900 flex flex-col min-h-screen p-4">
            <h1 className="text-3xl text-white text-center mt-4 mb-6">Attendance Dashboard</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loading-spinner text-white text-xl">Loading...</div>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap justify-center mb-6">
                        {sectors.map((sector, index) => (
                            <button
                                key={sector}
                                className={`mx-2 px-4 m-2 py-2 rounded ${currentSector === index ? 'bg-blue-700' : 'bg-gray-700'} text-white`}
                                onClick={() => setCurrentSector(index)}
                            >
                                {sector}
                            </button>
                        ))}
                    </div>
                    <div className="mb-8">
                        <h2 className="text-2xl text-white mb-4">{sectors[currentSector]} Sector</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getSectorTeams(currentSector).map((team, i) => (
                                <details key={team._id} className="col-span-1 bg-gray-800 rounded-xl overflow-hidden">
                                    <summary className="text-white cursor-pointer p-4 hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span>{currentSector * 15 + i + 1}. {team.teamname}</span>
                                            <span className={`text-sm ${team.lead?.FourthAttd ? 'text-green-500' : 'text-gray-400'}`}>
                                                {team.lead?.FourthAttd ? 'Submitted' : 'Pending'}
                                            </span>
                                        </div>
                                    </summary>
                                    <div className="p-2">
                                        <AttenCard team={team} />
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                    <div className="text-right mt-4">
                        <button 
                            onClick={() => setIsAuthenticated(false)} 
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Attd;