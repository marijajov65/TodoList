var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Todo = require('../models/Todo')



const privateKey = process.env.JWT_PRIVATE_KEY


router.get('/all', async function(req, res, next) {
    const todos = await Todo.find()
    return res.status(200).json({"todos": todos})
});

router.use(function(req, res, next) {
      if (req.header("Authorization")) {
          try {
              req.payload = jwt.verify(req.header("Authorization"), privateKey, { algorithms: ['RS256'] })
          } catch(error) {
              return res.status(401).json({"error": error.message});
          }
      } else {
          return res.status(401).json({"error": "Unauthorized"});
      }
      next()
  })



router.get('/', async function(req, res, next) {
    const todos = await Todo.find().where('author').equals(req.payload.id).exec()
    return res.status(200).json({"todos": todos})
});

router.patch("/",async function(req,res,next){
    const temp = await Todo.findOne({_id: req.body._id}).exec()
    if(req.payload.id != temp.author){
        return res.status(401).json({"error": "Unauthorized"});
    }
    var date = ""
    if(req.body.dateCompleted==''){
        date = new Date().toLocaleDateString('en-us')
    }
    const filter = {_id:req.body._id}
    const update = {dateCompleted:date}
    let todoRes = await Todo.findOneAndUpdate(filter,update);
    todoRes = await Todo.findOne(filter);
    return res.status(200).json({"todo": todoRes})
});


router.delete("/",async function(req,res,next){
    const temp = await Todo.findOne({_id: req.body._id}).exec()
    if(req.payload.id != temp.author){
        return res.status(401).json({"error": "Unauthorized"});
    }
    const todo = await Todo.deleteOne({_id: req.body._id}).then(function(){
        console.log("data deleted"); 
    }).catch(function(error){
        console.log(error);
    })
    return res.status(200).json({"todo": todo})
});

//new todo
router.post('/', async function (req, res) {
    console.log(req.payload.id)
  const todo = new Todo({
    "title": req.body.title,
    "description": req.body.description,
    "dateCreated": req.body.dateCreated,
    "dateCompleted": req.body.dateCompleted,
    "author": req.payload.id
    })

    await todo.save().then( savedTodo => {
        console.log(savedTodo.author)
        return res.status(201).json({
            "id": savedTodo._id,
            "title": savedTodo.title,
            "description": savedTodo.description,
            "dateCreated": savedTodo.dateCreated,
            "dateCompleted": savedTodo.dateCompleted,
            "author": savedTodo.author
        })
    }).catch( error => {
        return res.status(500).json({"error": error.message})
    });
})

module.exports = router;
