// import { Router } from "express"
// import userFunc from "../controllers/user"
const { Schema, model } = require('mongoose')
const { Router } = require("express")
const {test, createUser, levelComplete, editUser, login, findUser} = require("../controllers/user")

const router = Router()


router.get('/', test)
router.post('/createUser', createUser)
router.post('/editUser', editUser)
router.post('/levelComplete', levelComplete)
router.post('/login', login)
router.post('/findUser', findUser)

// export default router
module.exports = router
