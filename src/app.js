const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const protectedRoute = require("./routes/protectedRoute");

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/protected", protectedRoute);

require("dotenv").config();
const PORT = process.env.PORT || 6001;

// app.get("/", (req, res) => {
//   res.send("GET");
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
