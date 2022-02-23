const express = require('express');
const app = express();
const path = require('path');
const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid')



const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);



// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);


app.get('/api/notes', (req, res) =>
  readFileAsync("./db/db.json", "utf-8").then((data) => {
    notes = [].concat(JSON.parse(data))
    res.json(notes)
  })
);

app.post('/api/notes', (req, res) => {
  // const { title, text,} = req.body;

  const note = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4()
  };

  readFileAsync("./db/db.json", "utf8").then((data) => {
    // let notes = [].concat(JSON.parse(data));
    let savedNotes = JSON.parse(data)
    savedNotes.push(note)


    return savedNotes
  }).then((savedNotes) => {
    writeFileAsync("./db/db.json", JSON.stringify(savedNotes))

    res.json(savedNotes);
  })
});




// API DELETE Route 
app.delete('/api/notes/:id', (req, res) => {
  let deleteNote=req.params.id;
  readFileAsync("./db/db.json", "utf8").then((data) => {
    let savedNotes = JSON.parse(data);
    let newSave =[]
    console.log(savedNotes)
    // const newNotes = []
    for (let i = 0; i < savedNotes.length; i++) {
      if (deleteNote!== savedNotes[i].id) {
        newSave.push(savedNotes[i])
      }
    }
    return newSave
  }).then((newSave) => {
    writeFileAsync("./db/db.json", JSON.stringify(newSave))
    res.json(newSave);
  })
});



// GET route for miscelanious routes
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);