const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const noteData = require('./db/db.json')
// const api = require('./routes/index.js')

// const { clog } = require('./middleware/clog');
// const api = require('./assets/index.js');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
// app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('./develop/public'));

// API GET Route 
app.get('/api/notes', (req, res) =>
    readFileAsync("./db/db.json", "utf-8").then((data) => {
        notes = [].concat(JSON.parse(data))
        res.json(notes)
    } )
);

// API POST Route 
app.post('/api/notes', (req, res) =>{
        const note = req.body;
    readFileAsync("./db/db.json", "utf-8").then((data) => {
         const notes = [].concat(JSON.parse(data));
         note.id = notes.length++
         notes.push(note);
         return notes
    }).then((notes) =>{
        writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/develop/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/develop/public/notes.html'))
);

// GET route for miscelanious routes
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/develop/public/notes.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
