const {Router} = require('express');
const router = new Router();
const {addProduct, deleteProduct, getProduct, getProducts, getCategories, getAllProducts, getProfileProducts, getOneMyProduct, putProduct} = require('../controllers/products.controller')
const {check} = require('express-validator')

const authenticateToken = require('../middlewares/protected.middleware');
const upload = require('../middlewares/upload.middleware')


//Routes
router.get('/products/get/:id', getProduct);
router.get('/products/get-products/:category', getProducts)
router.get('/products/categories', getCategories)
router.get('/products/get-all', getAllProducts)
router.get('/products/get-profile-products',authenticateToken, getProfileProducts)
router.get('/products/get-one-my/:id', authenticateToken, getOneMyProduct)

router.post('/products/add', authenticateToken, upload.array('images'),[
    check('title', "title: Это поле  не может быть пустым").notEmpty(),
    check('description', "description: Это поле не может быть пустым").notEmpty(),
    check('price', "price: Это поле не может быть пустым").notEmpty(),
     check('category', "category: Это поле не может быть пустым").notEmpty(),

    check('title', "title: Минимальная длина 4 символа, максимальная 30").isLength({min: 4, max: 30}),
    check('description', "description: Минимальная длина 10 символов, максимальная 1000").isLength({min: 10, max: 1000})
], addProduct)
router.put('/products/put/:id', authenticateToken, upload.array('images'), putProduct)
router.delete('/products/delete/:id', deleteProduct)

module.exports = router;