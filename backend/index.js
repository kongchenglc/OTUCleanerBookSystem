import Koa from 'koa';
import Router from 'koa-router';
import { MongoClient, ObjectId } from 'mongodb'; 
import dotenv from 'dotenv';

dotenv.config();
const app = new Koa();
const router = new Router();
const uri = process.env.MONGODB_URI;

async function connectDB() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const db = client.db('testdb');

        app.context.db = db;
    } catch (err) {
        console.error(err);
    }
}

// 1. Retrieve all users (GET /users)
router.get('/users', async (ctx) => {
    const collection = ctx.db.collection('users'); // Get the users collection
    const users = await collection.find({}).toArray(); // Find all user documents
    ctx.body = users; // Set the response body to the user data
});

// 2. Create a new user (POST /users)
router.post('/users', async (ctx) => {
    const user = ctx.request.body; // Get user data from the request body
    const collection = ctx.db.collection('users'); // Get the users collection
    const result = await collection.insertOne(user); // Insert the new user into the collection
    ctx.body = { id: result.insertedId, ...user }; // Return the created user data with its ID
});

// 3. Update a user (PUT /users/:id)
router.put('/users/:id', async (ctx) => {
    const { id } = ctx.params; // Get the user ID from the path parameters
    const updatedUser = ctx.request.body; // Get updated user data from the request body
    const collection = ctx.db.collection('users'); // Get the users collection
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedUser }); // Update the user document
    ctx.body = { id, ...updatedUser }; // Return the updated user data
});

// 4. Delete a user (DELETE /users/:id)
router.delete('/users/:id', async (ctx) => {
    const { id } = ctx.params; // Get the user ID from the path parameters
    const collection = ctx.db.collection('users'); // Get the users collection
    await collection.deleteOne({ _id: new ObjectId(id) }); // Delete the user document
    ctx.body = { message: `User with ID ${id} deleted` }; // Return a deletion message
});

// Register the routes with the application
app.use(router.routes()).use(router.allowedMethods());


connectDB().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
});
