
import React from 'react';
import './Taskbar.css'; 

const Taskbar = ({ items }) => {
  return (
    <div className="taskbar">
      {items.map((item, index) => (
        <button key={index} className="taskbar-item" onClick={() => item.onClick()}>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Taskbar;
