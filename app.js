const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");

const app = express();
app.set('view engine', 'ejs');   //use ejs as view engine
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


/*var items=["task 1","task 2","task 3"];
var workItems=[];*/
var tasks=[];

async function main(){
    await mongoose.connect("mongodb+srv://ishaan3082:ishaan300802@ishaan.sorej2r.mongodb.net/toDoListDB?retryWrites=true&w=majority");
}
main().catch(err=>{
    console.log(err);
})

const itemSchema=new mongoose.Schema({
    name:String
});

const Item=mongoose.model("Item",itemSchema);

const listSchema={
    name:String,
    items:[itemSchema]
}
const List=mongoose.model("List",listSchema);
const item1=new Item({
    name:"Task 1"
});

const item2=new Item({
    name:"Task 2"
});

const item3=new Item({
    name:"Task 3"
});

const defaultarr=[item1,item2,item3];



app.get("/", function(req, res){
    
    let day=date.getDay();

async function read(){
        try {
           tasks= await Item.find({});
           console.log(tasks.length);
           if(tasks.length===0){
            await Item.insertMany(defaultarr);
            console.log("Success");
            res.redirect("/")
           }
           else{
        res.render("list",{listTitle:day,newListItems:tasks});
           }
        } catch (error) {
            console.log(error);
        }
    }
   read();
});
app.post("/", function(req,res){

    
    const itemName=req.body.newItem;
    const item=new Item({
        name:itemName
    });
    item.save();
    res.redirect("/");
});
app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    async function checkItemDelete(){
        try {
            await Item.findByIdAndRemove(checkedItemId);
            console.log("krdia del");
        } catch (error) {
            console.log(error);
        }
    }
    checkItemDelete();
    res.redirect("/");

})
app.get("/:customListName",function(req,res){
    const customListName=req.params.customListName;
    List.findOne({name:customListName})
    const list=new List({
        name:customListName,
        items: defaultarr
    })
    console.log(list);
    list.save();
    res.redirect("/:")
})

app.post("/work", function(req,res){
    var item=req.body.newItem;
    workItems.push(item);
    res.redirect("/work"); //ye krke fir upar var define kia
});
app.get("/about", function(req,res){
    
    res.render("about"); //ye krke fir upar var define kia
});
app.listen(3000, function(){
  console.log("Server started on port 3000.");
});




