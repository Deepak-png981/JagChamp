const express = require('express');
require('dotenv').config();
const connectDB = require('./db/ConnectDB');
const userAuthRouter = require('./routes/User/userAuth.routes');
const adminAuthRouter = require('./routes/Admin/adminAuth.routes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

//middlewaress
app.use(cors());
app.use(express.json());

connectDB(); //connecting to DB

app.use('/api/v1/user/auth', userAuthRouter);
app.use('/api/v1/admin/auth', adminAuthRouter)

app.listen(PORT, () => {
    console.log(`Server is running fine on ${PORT}`);
})