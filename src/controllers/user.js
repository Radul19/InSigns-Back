
const bcrypt = require('bcrypt');
const { Types } = require('mongoose');
const User = require("../models/userSchema")
const saltRounds = 10;
const userFunc = {}


userFunc.test = (req, res) => {
    console.log('#test')
    res.send('im working')
}

userFunc.createUser = async (req, res) => {
    console.log('#createUser')
    try {
        const { name, second_name, email, username, password, genre, birthdate } = req.body

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async (err, hash) => {
                // Store hash in your password DB.
                const newUser = await User.create({
                    name: name + ' ' + second_name,
                    email,
                    username,
                    password: hash,
                    genre,
                    birthdate
                })
                const { password, ...goodData } = newUser._doc
                console.log(goodData)
                res.send(goodData)
            });
        });



    } catch (error) {
        res.status(404).json({
            msg: 'Error ' + error.message
        })
    }
}
userFunc.editUser = async (req, res) => {
    console.log('#editUser')
    try {
        const { avatar = false, email = false, username = false, password = false, _id } = req.body

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password ? password : '',salt );

        let aux = `{
            ${username ? '"username":"' + username + '",' : ""}
            ${password ? '"password":"' + hash + '",' : ""}
            ${email ? '"email":"' + email + '",' : ""}
            ${avatar ? '"avatar":' + avatar + ',' : ""}
        }`
        aux = aux.replace(/\s/g, '')
        const lastIndex = aux.lastIndexOf(',')
        let data = aux.slice(0, lastIndex) + "" + aux.slice(lastIndex + 1);
        data = JSON.parse(data)

        const updatedUser = await User.findOneAndUpdate({ _id }, data, { new: true })

        const { _doc } = updatedUser
        const { password: _p, ...extraData } = _doc

        res.send(extraData)

    } catch (error) {
        console.log(error)
        res.status(404).json({
            msg: 'Error ' + error.message
        })
    }
}

userFunc.login = async (req, res) => {
    console.log('#login')
    try {
        const { namemail, password } = req.body

        const findUser = await User.findOne({ $or: [{ email: namemail }, { username: namemail }] })

        if (findUser) {
            // DO PASSWORDH CHECK
            bcrypt.compare(password, findUser.password, function (err, result) {
                if (result) {
                    const { password, ...goodData } = findUser._doc
                    console.log(goodData)
                    console.log('waaa')
                    res.send(goodData)
                } else {
                    console.log('pass error')
                    res.status(404).json({
                        msg: 'Contrasena incorrecta'
                    })
                }
            });
        } else {
            res.status(404).json({
                msg: 'No se encontro usuario con estos datos'
            })
        }

    } catch (error) {
        res.status(404).json({
            msg: 'Error ' + error.message
        })
    }
}
userFunc.levelComplete = async (req, res) => {
    console.log('#levelComplete')
    try {
        const { _id, classNumber, levelNumber, stars } = req.body

        const updatedUser = await User.findOneAndUpdate({ _id }, {
            $set: {
                [`class${classNumber}.${levelNumber}`]: stars,
            }
        }, { new: true })

        res.send(updatedUser)

    } catch (error) {
        res.status(404).json({
            msg: 'Error ' + error.message
        })
    }
}


userFunc.findUser = async (req, res) => {
    console.log('#findUser')
    try {

        const { _id } = req.body
        const findUser = await User.findOne({ _id })
        if (findUser) {
            res.send(findUser)
        } else {
            res.status(404).json({
                msg: 'No se encontró usuario'
            })
        }

    } catch (error) {
        res.status(404).json({
            msg: 'Error ' + error.message
        })
    }
}



module.exports = userFunc


// userFunc.test = async (req,res)=>{
//     console.log('#aaaaaaaa')
//     try {
//     } catch (error) {
//         res.status(404).json({
//             msg: 'Error '+ error.message
//         })
//     }
// }

// britors@pdvsa.com