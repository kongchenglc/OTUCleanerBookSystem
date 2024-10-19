import Koa from 'koa';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

const app = new Koa();
dotenv.config();
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

app.use(async (ctx) => {
    const collection = ctx.db.collection('users');
    const users = await collection.find({}).toArray();
    ctx.body = users;
});

// 启动应用并连接数据库
connectDB().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
});
