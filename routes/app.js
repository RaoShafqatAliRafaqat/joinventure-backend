const express = require('express');
const authController = require('../controller/authController');
const auth = require('../middlewares/auth');
const projectController = require('../controller/projectController');
const expenseController = require('../controller/expenseController');
const investorController = require('../controller/investorController');
const router = express.Router();

//testing
// router.get('/test', (req, res) => res.json({msg: 'working!'}))

//user

//register
router.post('/register', authController.register);

//login
router.post('/login', authController.login);

//logout
router.post('/logout', auth , authController.logout);

//refresh
router.get('/refresh', authController.refresh);

//project
// CRUD
//create
router.post('/project', auth , projectController.create);
//read all projects
router.get('/project/all', auth , projectController.getAll);
//read project by id
router.get('/project/:id', auth , projectController.getById);
//update
router.put('/project', auth , projectController.update);
//delete
router.delete('/project/:id', auth , projectController.delete);
//getAllchildbyid
router.get('/myproject/:id', auth , projectController.getAllMyProjects);

// investors (comments)
// add investors (create comment)
router.post('/investor', auth , investorController.create)
// read investors by project id (read comment)
router.get('/investor/:id', auth , investorController.getById)

// expenses 
// add expenses to project
//create
router.post('/expense', auth , expenseController.create)

//get all expenses 
router.get('/expense/:id', auth , expenseController.getById)

// Reports 
// create report
// read report


module.exports = router;