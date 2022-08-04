const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ilfiw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db('simpleShop');
        const userCollection = database.collection('products');

        // get api
        app.get('/products', async (req, res) => {
            const cursor = userCollection.find({});
            const result = await cursor.toArray();
            console.log('get api');
            res.send(result);
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // post api
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await userCollection.insertOne(product);
            console.log('product added');
            res.json(result);
        });

        // put api
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    pdName: updatedProduct.pdName,
                    pdPrice: updatedProduct.pdPrice,
                    pdQuantity: updatedProduct.pdQuantity
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            console.log('updated pd');
            res.json(result);
        });

        // delete api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            console.log('delete pd');
            res.json(result);
        });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Node mongodb Products');
});

app.listen(port, () => {
    console.log('listening to port', port);
});