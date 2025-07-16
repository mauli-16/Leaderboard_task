import React, { useState } from "react";

const SeeHistory = ({ username }) => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/history/${username}`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button onClick={fetchHistory} className="claimPoints">
        See History
      </button>
      {history.length > 0 && (
        <ul className="history-list">
          {history.map((entry, index) => (
            <li key={index}>
              ◦ +{entry.addedPoints} pts on{" "}
              {new Date(entry.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SeeHistory;
