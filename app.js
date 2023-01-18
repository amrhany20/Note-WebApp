const express = require ("express");
const bodyParser = require ("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
let items = ["buy food","cook food","eat food"];
let workItems=[];
app.use(express.static("public"))
const date = require(__dirname+"/date.js");
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.get("/", function(req,res){
res.render("list",{listTitle:date.getDate(),newLI:items});
});
 app.post("/",function(req,res){
    let item = req.body.newItem;
    if(req.body.list==="Work"){
        workItems.push(item)
        res.redirect("/work");

    }else{    
        items.push(item);
        res.redirect("/");

    }
 });
 app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work list",newLI:workItems});
 });
 app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
 });
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});