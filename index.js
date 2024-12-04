import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db= new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "To_Do",
    password:"",
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


async function checkList() {
    const result= await db.query(
        "SELECT id, task_name, deadline FROM list"
    );
let list=[];

    result.rows.forEach((task)=>{
       const task_name=task.task_name;
       const deadline=task.deadline;
       const id= task.id;
       const tk={id, task_name, deadline};
       list.push(tk);
    });
    return list;
}
app.get("/", async (req, res)=>{
    const lists= await checkList();
    console.log(lists);
 
    res.render("index.ejs", {
        task: lists
    });
});

app.post("/add", async (req, res)=>{
    try {
        await db.query(
            "INSERT INTO list (task_name, deadline) VALUES ($1, $2)",
            [req.body["task"], req.body["date"]]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});
app.post("/delete/:id", async (req, res)=>{
    try {
        await db.query(
            "DELETE FROM list WHERE id= $1 ;", 
            [req.params.id]
        );
        console.log(req.params.id);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.post("/update/:id", async (req, res)=>{
    try {
        await db.query(
            "UPDATE list SET task_name=$1 WHERE id=$2 ;", 
            [req.body["task_update"], req.params.id]
        );
        console.log(req.params.id);
        console.log(req.body["task_update"]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  