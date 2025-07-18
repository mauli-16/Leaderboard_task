import React, { useState } from "react";
import "./App.css";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState(""); //setting name state

  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch("https://leaderboard-task-axdb.onrender.com/add", { //adding user
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setName("");
        onUserAdded(); //Refresh user list
        alert(data.message);
      } else {
        alert(data.error || "Failed to add user");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add-user-form">
      <input
        type="text"
        placeholder="Enter user name"
        value={name}
        onChange={(e) => setName(e.target.value)} //setting name value
      />
      
      <button className="claimPoints" onClick={handleAdd}> 
        Add User
      </button>
    </div>//calling the function to add above
  );
};

export default AddUser;
