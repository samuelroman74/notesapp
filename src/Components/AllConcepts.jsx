import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl, uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../../amplify_outputs.json";
import './Concepts.css';
import Concept from './Concept'

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

const AllConcepts = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data: notes } = await client.models.Note.list();
    await Promise.all(
      notes.map(async (note) => {
        if (note.image) {
          const linkToStorageFile = await getUrl({
            path: ({ identityId }) => `media/${identityId}/${note.image}`,
          });
          note.image = linkToStorageFile.url;
        }
        return note;
      })
    );
    setNotes(notes);
  }

  async function fetchAllNotes() {
    const { data: notes } = await client.models.Note.list();
    return notes;
  }

  async function deleteNote({ id }) {
    const { data: deletedNote } = await client.models.Note.delete({ id });
    fetchNotes();
  }

  function handleNoteClick(event) {
    if (event.target.classList.contains('note-link')) {
      const noteId = event.target.dataset.noteId;
      const note = notes.find(note => note.id === noteId);
      if (note) {
        viewNoteDetails(note);
      }
    }
  }

  function viewNoteDetails(note) {
    // Display note details in a modal or any suitable component
    console.log(note); // For now, log the note details
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <Flex
          className="App"
          justifyContent="center"
          alignItems="center"
          direction="column"
          width="70%"
          margin="0 auto"
        >
          <Heading level={1}>AMOR</Heading>
          <Divider />
          <Heading level={2}>Current Concepts</Heading>
          <Grid className="notes-grid" onClick={handleNoteClick}>
  {notes.map((note) => (
        <Concept key={note.id} note={note} deleteNote={deleteNote} /> 
    // <Flex key={note.id || note.name} direction="column" justifyContent="center" alignItems="center" gap="2rem" border="1px solid #ccc" padding="2rem" borderRadius="5%" className="box">
    //   <View>
    //     <Heading level="3">{note.name}</Heading>
    //   </View>
    //   <div className="note-parent" dangerouslySetInnerHTML={{ __html: note.parent }} />
    //   <div className="note-description" dangerouslySetInnerHTML={{ __html: note.description }} />
    //   {note.image && (
    //     <Image
    //       src={note.image}
    //       alt={`visual aid for ${note.name}`}
    //       style={{ width: 400 }}
    //     />
    //   )}
    //   <Button variation="destructive" onClick={() => deleteNote(note)}>Delete Concept</Button>
    // </Flex>
  ))}
</Grid>

          <Button onClick={signOut}>Sign Out</Button>
        </Flex>
      )}
    </Authenticator>
  );
}

export default AllConcepts;
