import express from 'express';
import 'dotenv/config';
import users from './db/users';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    const user = await users.getById(1);
    await res.json(user);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
