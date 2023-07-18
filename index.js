const express = require("express");
const port = 3000;
const app = express();
const bodyParser = require('body-parser')
var TODOS = [];

app.use(bodyParser.json());

function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) return i;
    }
    return -1;
}

function removeAtIndex(arr,id){
    var newArr = [];
    for(var i=0; i<TODOS.length; i++){
        if(i != id){
            newArr.push(TODOS[i]);
        }
    }

    return newArr;
}

app.get("/todos",(req,res)=>{
   res.send(TODOS);
});

app.get("/todos/:id",(req,res)=>{
   var idx = findIndex(TODOS,parseInt(req.params.id));
   if(idx === -1){
    res.send("This TODO doesnot exists");
   }else{
    res.send(TODOS[idx]);
   }
});

app.post("/todos",(req,res)=>{
   const newTodo = {
    title: req.body.title,
    description : req.body.description,
    id: Date.now()
   }

   TODOS.push(newTodo);
   res.json(newTodo);
});

app.put("/todos/:id",(req,res)=>{
   var idx = findIndex(TODOS, parseInt(req.params.id));
   if(idx === -1){
    res.status(404).send();
   }else{
    TODOS[idx].title = req.body.title;
    TODOS[idx].description = req.body.description;
    res.json(TODOS[idx]);
   }
});

app.delete("/todos/:id",(req,res)=>{
   var idx = findIndex(TODOS,parseInt(req.params.id));
    if(idx === -1){
        res.send("It has already been deleted !!");
    }else{
        TODOS = removeAtIndex(TODOS,idx);
        res.status(200).send();
    }
});


app.listen(port,()=>{
    console.log(`This server is running on port ${port}`);
})