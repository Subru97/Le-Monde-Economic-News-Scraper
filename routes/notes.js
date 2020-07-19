const express = require('express'),
      router = express.Router(),
      db = require("../models");

router.get('/getNotes/:id', function (req,res){
  db.Article
    .findOne({_id: req.params.id})
    .populate('notes')
    .then(results => res.json(results))
    .catch(error => res.json(error));
});

router.get('/getSingleNote/:id', function (req,res) {
  db.Note
  .findOne({_id: req.params.id})
  .then( result => res.json(result))
  .catch(error => res.json(error));
});

router.post('/createNote', function (req,res){
  let { title, body, articleId } = req.body;
  let note = {
    title,
    body
  };
  db.Note
    .create(note)
    .then( result => {
      db.Article
        .findOneAndUpdate({_id: articleId}, {$push:{notes: result._id}},{new:true})
        .then( data => res.json(result))
        .catch( error => res.json(error));
    })
    .catch(error => res.json(error));
});

router.post('/deleteNote', (req,res)=>{
  let {articleId, noteId} = req.body;
  db.Note
    .remove({_id: noteId})
    .then(result => res.json(result))
    .catch(error => res.json(error));
});

module.exports = router;
