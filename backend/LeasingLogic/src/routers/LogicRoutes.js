const express = require('express');
const logicRoutes = express.Router();
const addLandLeasingDetails =require('../controllers/addLandLeasingDetails');
const getUserDetails = require('../controllers/getUserDetails');
const userMiddleware = require('../middlewares/userMiddlewares');

logicRoutes.use(userMiddleware)
logicRoutes.post('/lease-out', addLandLeasingDetails)
logicRoutes.get('/userdetails', getUserDetails)


module.exports = logicRoutes;