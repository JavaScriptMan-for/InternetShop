const {Router} = require('express');
const router = new Router();
const { addItem, deleteItem, getItems, increase, decrease, getCount, hasItem, infoBasket } = require('../controllers/basket.controller')
const protected = require('../middlewares/protected.middleware')

router.get('/basket/get', protected, getItems)
router.get('/basket/count/:id', protected, getCount)
router.get('/basket/has-item/:id',protected, hasItem)
router.get('/basket/get-info', protected, infoBasket)
router.post('/basket/add/:id',protected, addItem)

router.put('/basket/increase/:id',protected, increase)
router.put('/basket/decrease/:id',protected, decrease)

router.delete('/basket/delete/:id',protected, deleteItem)
module.exports = router;