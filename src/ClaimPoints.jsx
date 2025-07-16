import React, { useState } from "react";
import "./App.css";

const ClaimPoints = ({ userId, onClaimed }) => {
  const handlePoints = async () => {
    try {
      const res = await fetch("http://localhost:5000/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
       
        alert("points added successfully");
        onClaimed()
      } else {
        alert(data.error || "Failed to claim points");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button className="claimPoints" onClick={handlePoints}>
      Claim Points
    </button>
  );
};

export default ClaimPoints;
