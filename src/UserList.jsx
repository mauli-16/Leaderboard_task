import React, { useEffect, useState } from "react";
import AddUser from "./AddUser"; 
import "./App.css";
import ClaimPoints from "./ClaimPoints";
import SeeHistory from "./SeeHistory";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  const fetchUsers = () => {
    fetch("http://localhost:5000/users") //fetching data
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers(); // ccalling function upon changes
  }, []);

  const usersPerPage = 5; //pagination logic
  const startIndex = (page - 1) * usersPerPage;
  const visibleUsers = users.slice(startIndex, startIndex + usersPerPage);
  
  //mapping and adding prev and next buttons
  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>

      <ul className="leaderboard-list">
        {visibleUsers.map((user, index) => (  //mapping users list
          <li key={user._id} className="leaderboard-item">
            <div className="user-info">
              <span className="rank">#{index + startIndex + 1}</span>
              <span className="name">{user.name}</span>
              <span className="points">{user.points} pts</span>
            </div>

            <div className="user-actions">
              <ClaimPoints userId={user._id} onClaimed={fetchUsers} />
              <SeeHistory username={user.name} />
            </div>
          </li>
        ))}
      </ul> 
      <div className="pagination-controls"> 
        <button className="prev"disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button> 
        <button className="next"
          disabled={startIndex + usersPerPage >= users.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      <AddUser onUserAdded={fetchUsers} />
    </div>
  );
};

export default UserList;
