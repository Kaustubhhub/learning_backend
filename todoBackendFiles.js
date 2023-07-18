const bodyParser = require('body-parser');
const express = require('express');
const app =  express();
const fs = require('fs');
const { stringify } = require('querystring');
const port = 3000;

app.use(bodyParser.json());

function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) return i;
    }
    return -1;
}

function removeAtIndex(arr,id){
    var newArr = [];
    for(var i=0; i<arr.length; i++){
        if(i != id){
            newArr.push(arr[i]);
        }
    }

    return newArr;
}

app.get('/todos', (req, res) => {
    fs.readFile("todos.json", "utf8", (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  });

app.get("/todos/:id",(req,res)=>{
    fs.readFile("todos.json", "utf8", (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        var idx = findIndex(todos,parseInt(req.params.id));
        if(idx === -1){
            res.status(404).send();
        }else{
            res.json(todos[idx]);
        }
      });
});

app.post("/todos",(req,res)=>{
    var newTodo  = {
        title : req.body.title,
        description: req.body.description,
        id : Date.now()
    }

   fs.readFile("todos.json", "utf8", (err, data) => {
    const todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile("todos.json",JSON.stringify(todos),(err)=>{
        if(err)throw err;
        res.status(201).json(newTodo);
    });
  });
});

app.put("/todos/:id",(req,res)=>{
   fs.readFile("todos.json","utf-8",(err,data)=>{
    if(err)throw err;
    var todos = JSON.parse(data);
    var todoIndex = findIndex(todos,parseInt(req.params.id));
    if(todoIndex === -1){
        res.status(404).send("NO such todo");
    }else{
        todos[todoIndex].title = req.body.title;
        todos[todoIndex].description = req.body.description;
        fs.writeFile("todos.json",JSON.stringify(todos),(err)=>{
            if(err)throw err;
            res.status(200).send("THe todo has been modified !!");
        });
    }
   });
});


app.delete('/todos/:id', (req, res) => {
    fs.readFile("todos.json","utf-8",(err,data)=>{
        if(err)throw err;
        var todos = JSON.parse(data);
        var todoIndex = findIndex(todos, parseInt(req.params.id));
        if (todoIndex === -1) {
            res.status(404).send();
        }else{
            todos = removeAtIndex(todos,todoIndex);
            fs.writeFile("todos.json", JSON.stringify(todos),(err)=>{
                if(err)throw err;
                res.status(200).send();
            });
        }
    });
});


app.listen(port,()=>{
    console.log(`The server is running on port ${port}`);
})