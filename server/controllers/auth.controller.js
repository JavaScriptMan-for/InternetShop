const {validationResult} = require('express-validator')
const User = require('../models/User.model');
const bcrypt = require('bcrypt')
const MailOptions = require('../services/mailOptions.service');
const transporter = require('../services/transporter.service')
const createCode = require('../services/create-code.service')
const jwt = require('jsonwebtoken')

const code = createCode();
let code2 = createCode();
let token;
let newUser;
class AuthController {
    async register (req, res) {
        try {
            const { email, fullname, password, password_verify, gender } = req.body;

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg); 
                return res.status(400).json({ message: "Некорректные данные", errors: errorMessages }); 
            }
         
            const candidate = await User.findOne({ email });
            if(candidate) return res.status(400).json({message: "Такой пользователь уже зарегистрирован"})
    
            if(password !== password_verify) return res.status(400).json({message: "Пароли должны совпадать"}) 

            const hashedPassword = await bcrypt.hash(password, 8);
            newUser = new User({ email, password: hashedPassword, fullname, gender })
            //Отправка письма
           const options = new MailOptions(
            `${process.env.MY_EMAIL} Accessfull`,
             email, 
             "Подтверждение регистрации на нашем сайте",
             `
             <h1>Подтвердите регистрацию</h1>
             <p>${code}</p>
             `
        )

        const mail = await transporter.sendMail(options);
        if(!mail) return res.status(400).json({message: "Ошибка при отправке письма"})

            res.status(200).json({message: "Код отправлен на почту", email})
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Ошибка сервера при регистрации"})
        }
    }
    async login (req, res) {
        try {
            const {email, password} = req.body;

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg); 
                return res.status(400).json({ message: "Некорректные данные", errors: errorMessages }); 
            }
            const candidate = await User.findOne({ email });
            if(!candidate) return res.status(400).json({message: "Неверный логин или пароль"})

            const isMatch = await bcrypt.compare(password, candidate.password);
            if (!isMatch) return res.status(400).json({ message: "Неверный логин или пароль" })

             token = jwt.sign(
                { userId: candidate._id, fullname: candidate.fullname, gender: candidate.gender }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }      
            );
            res.status(200).json({message: "Вы успешно авторизовались", token})
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Ошибка сервера при авторизации"})
        }
    }
    async verify (req, res) {
        try {
            const {clientCode} = req.body;

            const errors = validationResult(req);
            if(!errors.isEmpty()) return res.status(400).json({message: "Некорректный код"})
                console.log(code, clientCode)
            if(Number(code) !== Number(clientCode)) return res.status(400).json({message: "Неверный код"})

            await newUser.save();
            const user_id = newUser._id;

            res.status(201).json({message: "Пользователь успешно создан", id: user_id})
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Ошибка сервера при верификации"})
        }
    }
    async protected (req, res) {
        if(!req.user) return res.status(400).json({message: "Пользователь не найден"})
        res.status(200).json({ message: 'Проверка успешно прошла', user: req.user, token });
    }
    async fagotPassword (req, res) {
        try {
            const { email } = req.body;

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg); 
                return res.status(400).json({ message: "Некорректные данные", errors: errorMessages }); 
            }
            code2 = createCode();
            const options = new MailOptions(
                `${process.env.MY_EMAIL} Accessfull`,
                 email, 
                 "Подтверждение изменения пароля",
                 `
                 <h1>Подтвердите изменение пароля</h1>
                 <p>${code2}</p>
                 `
            )
            const mail = await transporter.sendMail(options);
            if(!mail) return res.status(400).json({message: "Ошибка при отправке письма"})
    
            res.status(200).json({message: "Письмо успешно отправлено", email})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: "Ошибка сервера"})
        }
    }
    async putPassword (req, res) {
        try {
            const { email, code_verify, newPassword } = req.body;

         

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg); 
                return res.status(400).json({ message: "Некорректные данные", errors: errorMessages }); 
            }

               if(Number(code_verify) !== Number(code2)) return res.status(400).json({message: "Некорректный код"})

            const findUser = await User.findOne({email});
            if(!findUser) return res.status(400).json({message: "Пользователь с таким email не найден"})

            const hashedPassword = await bcrypt.hash(newPassword, 8);

            const rename_password = await User.updateOne({email}, {password: hashedPassword});

            if(!rename_password) return res.status(400).json({message: "Ошибка при изменении пароля"})

            res.status(200).json({message: "Пароль успешно изменён"})
            
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Ошибка сервера при изменении пароля"})
        }
    }
    async logout (req, res) {
        try {
            res.status(200).clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None', 
                secure: true,    
            }).json({ message: "Успешно вышли из аккаунта" });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Ошибка сервера при выходе из аккаунта"})
        }
    }
    async deleteAccount (req, res) {
        try {
           const user = req.user
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

           const deleteAccountVar = await User.findByIdAndDelete(user.userId)
           if(!deleteAccountVar) return res.status(400).json({message: "Не удалось удалить аккаунт"})

            res.status(200).json({message: "Вы успешно удалили аккаунт"})
            
        } catch (error) {
            console.error(error);
            res.status(500)    
        }
    }
}

module.exports = new AuthController();