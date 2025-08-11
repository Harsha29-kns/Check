import axios from "axios";
import { useEffect, useState } from "react";
import api from "./api";
import "./foodDet.css";

function FoodDet() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalItems: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let res = await axios.get(`${api}/food`);
        const teamsData = res.data;
        setTeams(teamsData);

        // Calculate stats
        const totalOrders = teamsData.length;
        let totalItems = 0;
        let totalRevenue = 0;
        let pendingOrders = 0;

        teamsData.forEach(team => {
          if (team.food && Array.isArray(team.food)) {
            totalItems += team.food.reduce((sum, item) => sum + (item.quantity || 0), 0);
          }
          totalRevenue += team.price || 0;
          if (!team.foodDelivered) {
            pendingOrders++;
          }
        });

        setStats({
          totalOrders,
          totalItems,
          totalRevenue,
          pendingOrders
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const markAsDelivered = async (teamId) => {
    try {
      await axios.put(`${api}/event/markFoodDelivered/${teamId}`);
      
      // Update local state
      setTeams(teams.map(team => {
        if (team._id === teamId) {
          return { ...team, foodDelivered: true };
        }
        return team;
      }));

      // Update stats
      setStats({
        ...stats,
        pendingOrders: stats.pendingOrders - 1
      });

    } catch (error) {
      console.error("Error marking food as delivered:", error);
    }
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(selectedTeam?._id === team._id ? null : team);
  };

  if (loading) {
    return (
      <div className="food-loading">
        <div className="spinner"></div>
        <p>Loading food orders...</p>
      </div>
    );
  }

  return (
    <div className="food-container">
      <h1 className="food-title">Food Orders Dashboard</h1>
      
      <div className="food-stats-container">
        <div className="food-stat-box">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="food-stat-box">
          <div className="stat-icon">🍽️</div>
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="food-stat-box">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Revenue</div>
        </div>
        <div className="food-stat-box">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{stats.pendingOrders}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="food-teams-container">
        <h2>Team Orders</h2>
        
        {teams.length === 0 && (
          <div className="food-no-orders">No food orders found</div>
        )}

        {teams.map((team) => (
          <div 
            key={team._id} 
            className={`food-team-card ${team.foodDelivered ? 'delivered' : ''} ${selectedTeam?._id === team._id ? 'expanded' : ''}`}
            onClick={() => handleTeamClick(team)}
          >
            <div className="food-team-header">
              <h3>{team.teamname}</h3>
              <div className={`food-status ${team.foodDelivered ? 'status-delivered' : 'status-pending'}`}>
                {team.foodDelivered ? 'Delivered' : 'Pending'}
              </div>
            </div>

            <div className="food-team-details">
              {team.food && team.food.length > 0 ? (
                <div className="food-items-list">
                  {team.food.map((item, idx) => (
                    <div key={idx} className="food-item">
                      <span className="food-item-name">{item.name}</span>
                      <span className="food-item-qty">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="food-no-items">No items ordered</div>
              )}

              <div className="food-team-footer">
                <div className="food-price">Total: ₹{team.price?.toFixed(2) || "0.00"}</div>
                
                {!team.foodDelivered && (
                  <button 
                    className="food-deliver-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsDelivered(team._id);
                    }}
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodDet;