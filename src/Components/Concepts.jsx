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

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

const Concepts = () => {
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

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    const descriptionText = form.get("description");
    const parentText = form.get("parent");
    //const casesText = form.get("cases");
    //const existenceText = form.get("existence"); 
    const allNotes = await fetchAllNotes(); // Fetch all notes to find their names

    // Process the description to convert note names to clickable links
    const processedDescription = descriptionText.replace(/(\b\w+\b)/g, (match) => {
      const note = allNotes.find((note) => note.name === match);
      if (note) {
        return `<span class="note-link" data-note-id="${note.id}">${match}</span>`;
      }
      return match;
    });

    const processedParent = parentText.replace(/(\b\w+\b)/g, (match) => {
      const note = allNotes.find((note) => note.name === match);
      if (note) {
        return `<span class="note-link" data-note-id="${note.id}">${match}</span>`;
      }
      return match;
    });

    const { data: newNote } = await client.models.Note.create({
      name: form.get("name"),
      parent: processedParent,
      description: processedDescription, // Save the processed description
      image: form.get("image").name,
    });

    if (newNote.image) {
      await uploadData({
        path: ({ identityId }) => `media/${identityId}/${newNote.image}`,
        data: form.get("image"),
      }).result;
    }

    fetchNotes();
    event.target.reset();
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
          <View as="form" margin="3rem 0" onSubmit={createNote}>
            <Flex
              direction="column"
              justifyContent="center"
              gap="2rem"
              padding="2rem"
            >
              <TextField
                name="name"
                placeholder="Concept Name"
                label="Concept Name"
                required
              />
              <TextField 
                name="parent"
                placeholder="Concept Parent"
                label="Concept Parent"
                required
                />
              <TextField
                name="description"
                placeholder="Concept Description"
                label="Concept Description"
                required
              />
              <View
                name="image"
                as="input"
                type="file"
                alignSelf="end"
                accept="image/png, image/jpeg"
              />

              <Button type="submit" variation="primary">
                Create Concept
              </Button>
            </Flex>
          </View>
          <Divider />
          <Heading level={2}>Current Concepts</Heading>
          <Grid className="notes-grid" onClick={handleNoteClick}>
  {notes.map((note) => (
    <Flex key={note.id || note.name} direction="column" justifyContent="center" alignItems="center" gap="2rem" border="1px solid #ccc" padding="2rem" borderRadius="5%" className="box">
      <View>
        <Heading level="3">{note.name}</Heading>
      </View>
      <div className="note-parent" dangerouslySetInnerHTML={{ __html: note.parent }} />
      <div className="note-description" dangerouslySetInnerHTML={{ __html: note.description }} />
      {note.image && (
        <Image
          src={note.image}
          alt={`visual aid for ${note.name}`}
          style={{ width: 400 }}
        />
      )}
      <Button variation="destructive" onClick={() => deleteNote(note)}>Delete Concept</Button>
    </Flex>
  ))}
</Grid>

          <Button onClick={signOut}>Sign Out</Button>
        </Flex>
      )}
    </Authenticator>
  );
}

export default Concepts;
