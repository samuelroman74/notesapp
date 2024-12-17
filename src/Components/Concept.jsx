// src/components/Note.js
import React, { useState } from 'react';
import './Concept.css'; // We'll create this CSS file next

const Concept = ({ note, deleteNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="note">
      <div className="note-header" onClick={toggleDescription}>
        <h3>{note.name}</h3>
        <button className="toggle-button">{isExpanded ? '▲' : '▼'}</button>
      </div>
      {isExpanded && (
        <div className="note-description" dangerouslySetInnerHTML={{ __html: note.description }} />
      )}
      {note.image && (
        <img src={note.image} alt={`visual aid for ${note.name}`} style={{ width: 400 }} />
      )}
      <button className="delete-button" onClick={() => deleteNote(note)}>
        Delete Note
      </button>
    </div>
  );
};

export default Concept;
