const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/DataStorage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

app.get('/api/posts', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 10; 

    const posts = await Post.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
