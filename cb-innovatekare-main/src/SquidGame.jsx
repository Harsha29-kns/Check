import { useState } from "react";
import { io } from "socket.io-client";
import api from "./api";

const socket = io(api);

function SquidGame({ team }) {
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [final,setfinal]=useState(team.SquidScore)
  function handleSubmit(e) {
    e.preventDefault();

    if (!score || isNaN(score)) {
      setError("Please enter a valid numeric score");
      return;
    }

    socket.emit("leaderboard", { ...team, SquidScore: Number(score) });
    setError("Score Added");
    setfinal(final+Number(score))

  }

  return (
    <div className=" flex w-full justify-center">
    <div className="bg-white h-full  text-black p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-xl font-bold mb-4 text-center">{team.teamname}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <h1 className=" text-xl text-black mb-3"> Team Score {final}</h1> 
          <label htmlFor="score" className="block text-sm font-medium text-gray-700">
            Score
          </label>
          <input
            id="score"
            type="text"
            placeholder="Enter score"
            value={score}
            onChange={(e) => {setScore(e.target.value)
            setError("")}}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
    </div>
  );
}

export default SquidGame;
