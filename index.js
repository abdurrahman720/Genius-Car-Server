const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5001;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rtntsud.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const servicesCollection = client.db("geniusCar").collection("services");
        const orderedCollection = client.db("geniusCar").collection("orders");

        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        });

        //orders api
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await orderedCollection.insertOne(order);
            console.log(result);
            res.send(result);
        });

        app.get("/orders", async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email}
            }
            const cursor = orderedCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = {
                _id: ObjectId(id)
            };
            const updatedOrder = {
                $set:{
                    status: status
                }
            }
            const result = await orderedCollection.updateOne(query, updatedOrder);
            res.send(result);
            console.log(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await orderedCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        })
    }
    
    finally {
    }
}
run().catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("Genius Car server runnig");
});

app.listen(port, () => {
    console.log("listening on port", port);
});
