
const bcrypt = require('bcrypt');
const { Types } = require('mongoose');
const User = require("../models/userSchema")
const Code = require("../models/codeSchema")
const nodemailer = require('nodemailer');
const saltRounds = 10;
const userFunc = {}
/**qefzjgxebgwuuxar slyt
/**zqrocbnbbtmsueli ensenas
 */

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const transporterTest = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'ensenas.app1@gmail.com',
        pass: 'zqrocbnbbtmsueli'
    }
});

const mailTest = {
    from: 'ensenas.app1@gmail.com',
    to: 'radulito19@gmail.com',
    subject: 'Código de verificacion de cuenta',
    text: 'Ingrese el código xxx para verificar su cuenta de EnSeñas!'
};


userFunc.test = (req, res) => {
    console.log('#test')
    // transporter.sendMail(mailTest, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });

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
                    verify:false,
                    name: name + ' ' + second_name,
                    email,
                    username,
                    password: hash,
                    genre,
                    birthdate
                })
                const { password, ...goodData } = newUser._doc
                const randomNum = getRandomInt(100000, 999999)
                const newCode = await Code.create({
                    email: goodData.email,
                    code: randomNum,
                })


                /**  EMAIL AWAIT LOGIC */
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: 'ensenas.app1@gmail.com',
                        pass: 'zqrocbnbbtmsueli'
                    }
                });


                await new Promise((resolve, reject) => {
                    // verify connection configuration
                    transporter.verify(function (error, success) {
                        if (error) {
                            console.log(error);
                            reject(error);
                        } else {
                            console.log("Server is ready to take our messages");
                            resolve(success);
                        }
                    });
                });

                const mailData = {
                    from: 'ensenas.app1@gmail.com',
                    to: email,
                    subject: 'Código de verificacion de cuenta',
                    text: `Ingrese el código ${randomNum} para verificar su cuenta de EnSeñas!`
                };

                await new Promise((resolve, reject) => {
                    // send mail
                    transporter.sendMail(mailData, (err, info) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.log(info);
                            resolve(info);
                        }
                    });
                });

                // console.log(goodData)
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
        let hash = bcrypt.hashSync(password ? password : '', salt);

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
                    if (goodData.verify) {
                        res.send(goodData)
                    } else {
                        res.status(401).json({
                            msg: 'Verifique su codigo',
                            email: goodData.email
                        })
                    }
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

userFunc.verifyCode = async (req, res) => {
    console.log('#verifyCode')
    const { code } = req.body
    const findCode = await Code.findOne({ code })
    // console.log(findCode)
    if (findCode) {
        const findUser = await User.findOneAndUpdate({ email: findCode.email }, {
            $set: { verify: true }
        }, { new: true })
        const { password, ...goodData } = findUser._doc
        await Code.findOneAndDelete({ code })
        res.send(goodData)

    } else {
        res.status(404).json({
            msg: "Codigo incorrecto"
        })
    }

    try {
    } catch (error) {
        res.status(404).json({
            msg: 'Error ' + error.message
        })
    }
}

userFunc.createCode = async (req, res) => {
    console.log('#createCode')
    try {
        const { code, email } = req.body
        res.send(await Code.create({ code, email }))
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