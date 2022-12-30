const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5001;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

//middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rtntsud.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



app.get('/', (req, res) => {
    res.send("Genius Car server runnig")
})

app.listen(port, () => {
    console.log('listening on port', port)
})