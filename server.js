
const express = require('express'); //HTTP server library
const path = require('path'); // 

const fs = require('fs');   //Used to store & retrieve notes 

const app = express(); //Invoke express variable & call it app 

const PORT = process.env.PORT || 3001;

const util = require('util');

//Need to get the delete button to work 
const { v4: uuidv4 } = require('uuid');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const getNotes = () =>{
    return readFile('db/db.json','utf-8')
    .then(rawnotes =>[].concat(JSON.parse(rawnotes)))
}
//Middleware gets used during every request if the middleware has a function for that request it will perform that function
//Middleware is in the middle of the client request & route. 

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static('public'));

//GET route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET ROUTES
app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res)=>{
    getNotes().then(notes => res.json(notes))
})

// app.delete('/api/notes/:id', (req, res) => {

// })
// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
// In order to delete a note, you'll need to read all notes from the db.json file, 
// remove the note with the given id property, and then rewrite the notes to the db.json file.


app.post('/api/notes',(req, res)=>{
    getNotes().then(oldnotes =>{
       let newNote = {title:req.body.title, text:req.body.text, id:uuidv4()}
       let notes = [...oldnotes, newNote]
       writeFile('db/db.json',JSON.stringify(notes)).then(()=> res.json({msg:'Ok'}))

    })
})

app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})






















//GET /notes should return the notes.html file.

//GET * should return the index.html file.

// The following API routes should be created:

// GET /api/notes should read the db.json file and return all saved notes as JSON.

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. 
// You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).


