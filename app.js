const express = require ("express");
const bodyParser = require ("body-parser");
const _ = require("lodash");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
const mongoose = require("mongoose");
//let items = ["buy food","cook food","eat food"];
let workItems=[];
app.use(express.static("public"))
//const date = require(__dirname+"/date.js");
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemSchema = new mongoose.Schema({
    name:String,
    });
const Item = mongoose.model("Item",itemSchema);
const listSchema = new mongoose.Schema({
    name:String,
    setofitems:[itemSchema]
    });
const List = mongoose.model("List",listSchema);

const item1 = new Item({
    name: "Welcome to your TODO list",
}); const item2 = new Item({
    name: "Click + to Add new Item ",
}); const item3 = new Item({
    name: "Click the checkbox to remove item",
}); 
const deafaultItems =[item1,item2,item3];


//date.getDate()
app.get("/", function(req,res){
    Item.find({},function (err,foundItems) {
        if(foundItems.length===0){
            Item.insertMany(deafaultItems,function (err) {
                if (err) {
                    console.log(err);
                }else{
                    console.log("kollo tammaaamn");
                }
                
            });
            res.redirect("/");
        }else{
        res.render("list",{listTitle:"Today",newLI:foundItems});

        }
        
    });
});
 app.post("/",function(req,res){
    let item = req.body.newItem;
    let listName = req.body.list;
    const nItem = new Item ({
        name:item
    });
    if(listName === "Today"){
        nItem.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,foundlist){
                foundlist.setofitems.push(nItem)
                foundlist.save();
                res.redirect("/"+listName);
        });  
    }
    
        
    });
    // if(req.body.list==="Work"){
    //     workItems.push(item)
    //     res.redirect("/work");

    // }else{    
    //     items.push(item);
    //     res.redirect("/");

    // }
 //});
 app.post("/delete", function (req,res) {
    const ln = req.body.ln;
    const chkd =req.body.checkbox;
    console.log(chkd);
    if(ln ==="Today"){
        Item.findByIdAndDelete(chkd,function (err) {
            if (!err) {console.log("Deleted");res.redirect("/");}});}
         else{
            List.findOneAndUpdate({name:ln},{$pull:{setofitems:{_id:chkd}}},function (err, flist) {
            if(!err){console.log("ayhga"); res.redirect("/"+ln);}else{console.log(err);}});}   
 });
 app.get("/:lname",function(req,res){
    const nlname = _.capitalize(req.params.lname);
    List.findOne({name:nlname},function(err,foundlist){
        if(!err){
            if (foundlist) {
                res.render("list",{listTitle:foundlist.name,newLI:foundlist.setofitems});
                    }else{
            const nlist = new List({
                name:nlname,
                setofitems:deafaultItems
            });
            console.log(nlist.setofitems);
            nlist.save();
            res.redirect("/"+nlname);
        }
    }else{console.log(err);}
    });
    
});
 app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
 });
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});