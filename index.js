const express = require("express")
const cors = require("cors")
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000
const db_url = process.env.DB_CONNECT

const client = new MongoClient(db_url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json())
app.use(cors())

//get all leads//tested work
app.get('/leads', (req, res) => {
  client.connect (err => {
    if (!err) {
      const collection = client.db("JobTracker").collection("Leads");
      // perform actions on the collection object
      const results = collection.find({}).toArray((err, docs) => {
        console.log(docs);
        res.send(docs);
      });
    } else {
      console.log(err);
    }
    client.close();
  });
});


//get leads by search, using two path params//it works, but does not like spaces between words
app.get("/leads/:key/:value", (req, res) => {
  client.connect(err => {
    if (!err) {
      const collection = client.db("JobTracker").collection("Leads");
      // perform actions on the collection object
      const results = collection
      //deconstructing the properties of an object into a variable 
        .find({ [req.params.key]: req.params.value }) // Using [computed_property_name] for dynamic key naming
        .toArray((err, docs) => {
          console.log(docs);
          res.send(docs);
        });
    } else {
      console.log(err);
    }
    client.close();
  });
});

//post new lead
app.post("/lead", (req, res) => {
    const body = req.body;
    client.connect(async err => {
      if(!err) {
        const collection = client.db("JobTracker").collection("Leads");
        // perform actions on the collection object
        const results = await collection.insertOne(body);
        res.send(results.insertedId);
      }else {
        console.log(err)
      }
      
      client.close();
    });
});

//post many new leads//somehow that works
app.post("/leads", (req, res) => {
    const body = req.body;
    client.connect(async err => {
      if (!err) {
        const collection = client.db("JobTracker").collection("Leads");
        // perform actions on the collection object
        const results = await collection.insertMany(body);
        res.send(results);
      } else {
        console.log(err);
      }
      client.close();
    });
});

//update lead by ID//it works ;)
app.put("/leads/:ID", (req, res) => {
  const body = req.body;
  client.connect(async err => {
    if (!err) {
      const collection = client.db("JobTracker").collection("Leads");
      // perform actions on the collection object
      const results = await collection.updateOne(
        { _id: ObjectId(req.params.ID) },
        { $set: body }
      );
      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
  });
});

//delete lead by ID//f
app.delete("/leads/:ID", (req, res) => {
  client.connect(async err => {
    if (!err) {
      const collection = client.db("JobTracker").collection("Leads");
      // perform actions on the collection object
      const results = await collection.deleteOne({
        _id: ObjectId(req.params.ID)
      });
      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
  });
});


app.listen(port,() => {console.log(`Listening on port ${port}`)})

