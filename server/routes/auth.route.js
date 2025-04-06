const {Router} = require('express');
const router = new Router();
const {check} = require('express-validator')
const authenticateToken = require('../middlewares/protected.middleware')

const {register, login, verify, protected, fagotPassword, putPassword, logout, deleteAccount } = require('../controllers/auth.controller')

router.post('/users/register',[
    check('email', "email: Некорректный email").isEmail(),
    check('email', "email:  Это поле не может быть пустым").notEmpty(),

    check('password', "password: Длина пароля должна быть от 6 до 20 символов").isLength({min: 6, max: 20}),
    check('fullname', "Некорректное имя").isLength({max: 40, min: 2}),
    check('gender', "Некорректный пол").isIn(['man', 'woman']),
], register)

router.post('/users/login',[
    check('email', "Некорректный email").isEmail(),
    check('email', "Это поле не может быть пустым").notEmpty(),
    
    check('password', "Длина пароля должна быть от 6 до 20 символов").isLength({min: 6, max: 20}),
], login)
router.post('/users/verify',[
    check('clientCode', "Некорректный код").isLength({max: 6, min: 6})
], verify)
router.get('/users/protected', authenticateToken, protected);

router.post('/users/send-code-fagot',[
    check('email', "email: Некорректный email").isEmail(),
    check('email', "email:  Это поле не может быть пустым").notEmpty(),
], fagotPassword)
router.put('/users/put-password', [
    check('newPassword', "Некорректный пароль").isLength({min: 6, max: 20}),

    check('email', "email: Некорректный email").isEmail(),
    check('email', "email:  Это поле не может быть пустым").notEmpty(),
    check('code_verify', "Некорректный код").isLength({max: 6, min: 6})
], putPassword)

router.head('/users/logout', authenticateToken, logout)
router.delete('/users/delete-account', authenticateToken, deleteAccount)

module.exports = router;