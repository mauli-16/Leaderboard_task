import React, { useState } from "react";
import "./App.css";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setName("");
        onUserAdded(); // Refresh user list
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
        onChange={(e) => setName(e.target.value)}
      />
      <button className="claimPoints" onClick={handleAdd}>
        Add User
      </button>
    </div>
  );
};

export default AddUser;
