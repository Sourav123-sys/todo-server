
//import
const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 4000


//middleware
app.use(bodyParser.json())
//app.use(cors())
const corsConfig = {
    origin: true,
    credentials: true,
  }
  app.use(cors(corsConfig))
  app.options('*', cors(corsConfig))





//connect to db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eowzq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {

        await client.connect();
        const todoCollection = client.db('todo-app').collection('todo')
        console.log("todo  connected")



    
        app.get("/tasks", async (req, res) => {
            const query = {};
            const cursor = todoCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        // read task by single id
        app.get("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.findOne(query);
            res.send(result);
        });

        // get add task data by post
        app.post("/tasks", async (req, res) => {
            const newTask = req.body;
            const result = await todoCollection.insertOne(newTask);
            res.send(result);
        });

        // delete task
        app.delete("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        });

        //Update
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const updateTasks = req.body
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    selected: updateTasks.newSelected
                }
            }

            const result = await todoCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
    } finally {
    }
}

run().catch(console.dir);