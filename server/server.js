import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// import router from './routes/index.js';
import connectDB from './config/db.js'

const PORT = process.env.PORT || 5000;

const app  = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Server is running');
});

//app.use('/api', router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

await connectDB()