# JWT Authentication in Node.js

## Token-based authentication

- It's the most common approach of authentication for securing web applications.
- It involves generating and validating tokens (usually JSON Web Tokens, JWTs) to authenticate users.

Here’s how we can implement token-based authentication in a Node.js web application:

### 1. Choose an Authentication Strategy:

Decide on the type of authentication we want to implement. Common options include username/password, social media login (e.g., using OAuth), or token-based authentication (e.g., JWT).

### 2. Set Up Node.js Project:

> npm init

### 3. Install required Dependency Packages:

Depending on our chosen authentication strategy, we may need to install relevant packages. here, we’re using JWT, we can install the ‘jsonwebtoken’ package:

> npm install jsonwebtoken bcrypt mongoose

### 4. Create a User Model:

Define a user model to store user data in database (e.g., MongoDB, PostgreSQL, or MySQL). We can use an ORM like Mongoose (for MongoDB) or Sequelize (for SQL databases). a simplified coding snippet for MongoDB and Mongoose is below:

```
--> src/models/User.js

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
 username: { type: String, unique: true, required: true },
 password: { type: String, required: true },
 });
module.exports = mongoose.model('User', userSchema);
```

### 5. Create Routes and Controllers:

Set up routes and controllers for user registration, login, and authentication.

```
--> src/routes/auth.js

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

### 6. Protect Routes:

Implement middleware to protect routes that require authentication. we can use a middleware function to verify JWT tokens:

```
--> src/middleware/authMiddleware.js

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

### 7. Use Authentication Middleware:

Apply the authentication middleware to protect specific routes in application:

```
--> src/routes/protectedRoute.js

 const express = require('express');
 const router = express.Router();
 const verifyToken = require('../middleware/authMiddleware');

// Protected route
 router.get('/', verifyToken, (req, res) => {
 res.status(200).json({ message: 'Protected route accessed' });
 });

module.exports = router;
```

### 8. Start Your Express Application:

Set up your main application file app.js and start the Express server:

```
--> src/app.js

 const express = require('express');
 const app = express();
 const authRoutes = require('./routes/auth');
 const protectedRoute = require('./routes/protectedRoute');
 app.use(express.json());
 app.use('/auth', authRoutes);
 app.use('/protected', protectedRoute);
 const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
 });
```

### 9. Run Your Application:

Start your Node.js application using

> npm start

This example demonstrates a basic implementation of authentication in a Node.js web application using Express.js, MongoDB for storing user data, and JWT for token-based authentication. Remember to replace `’your-secret-key’` with a strong, secret key and consider using environment variables for configuration and security. Additionally, in a production environment, you should use HTTPS to secure communication between the client and server.
