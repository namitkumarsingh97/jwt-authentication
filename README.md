# JWT Authentication in Node.js

## Token-based authentication

- It's the most common approach of authentication for for securing web applications.
- It involves generating and validating tokens (usually JSON Web Tokens, JWTs) to authenticate users.

Here’s how we can implement token-based authentication in a Node.js web application:

### Step 1 - Choose an Authentication Strategy:

Decide on the type of authentication we want to implement. Common options include username/password, social media login (e.g., using OAuth), or token-based authentication (e.g., JWT).

### Step 2 - Set Up Node.js Project:

> npm init

### Step 3 - Install required Dependency Packages:

Depending on our chosen authentication strategy, we may need to install relevant packages. here, we’re using JWT, we can install the ‘jsonwebtoken’ package:

> npm install jsonwebtoken

### Step 4 - Create a User Model:

Define a user model to store user data in database (e.g., MongoDB, PostgreSQL, or MySQL). We can use an ORM like Mongoose (for MongoDB) or Sequelize (for SQL databases). a simplified coding snippet for MongoDB and Mongoose is below:

```
--> models/User.js

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
 username: { type: String, unique: true, required: true },
 password: { type: String, required: true },
 });
module.exports = mongoose.model('User', userSchema);
```

### Step 5 - Create Routes and Controllers:

Set up routes and controllers for user registration, login, and authentication.

```
--> routes/auth.js

 const express = require('express');
 const router = express.Router();
 const User = require('../models/User');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');

// User registration
 router.post('/register', async (req, res) => {
 try {
 const { username, password } = req.body;
 const hashedPassword = await bcrypt.hash(password, 10);
 const user = new User({ username, password: hashedPassword });
 await user.save();
 res.status(201).json({ message: 'User registered successfully' });
 } catch (error) {
 res.status(500).json({ error: 'Registration failed' });
 }
 });

// User login
 router.post('/login', async (req, res) => {
 try {
 const { username, password } = req.body;
 const user = await User.findOne({ username });
 if (!user) {
 return res.status(401).json({ error: 'Authentication failed' });
 }
 const passwordMatch = await bcrypt.compare(password, user.password);
 if (!passwordMatch) {
 return res.status(401).json({ error: 'Authentication failed' });
 }
 const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
 expiresIn: '1h',
 });
 res.status(200).json({ token });
 } catch (error) {
 res.status(500).json({ error: 'Login failed' });
 }
 });

module.exports = router;
```

### Step 6 - Protect Routes:

Implement middleware to protect routes that require authentication. we can use a middleware function to verify JWT tokens:

```
--> middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, 'your-secret-key');
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;
```

### Step 7 - Use Authentication Middleware:

Apply the authentication middleware to protect specific routes in application:

```
--> routes/protectedRoute.js

 const express = require('express');
 const router = express.Router();
 const verifyToken = require('../middleware/authMiddleware');

// Protected route
 router.get('/', verifyToken, (req, res) => {
 res.status(200).json({ message: 'Protected route accessed' });
 });

module.exports = router;
```
