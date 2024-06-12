const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser,verifyUser,getUser } = require ('../controllers/authController')

//middleWare
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173' // Fix: Match the correct protocol and port
    })
)

// router.get('/', test);
router.post('/register', registerUser)
router.post('/login', loginUser,verifyUser)
router.post('/', verifyUser)

module.exports = router;