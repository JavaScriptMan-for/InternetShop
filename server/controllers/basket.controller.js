const Basket = require('../models/Basket.model');
const Products = require('../models/Product.model')

const jwt = require('jsonwebtoken')
const {isValidObjectId} = require('mongoose')

class BasketController {
    async getItems (req, res) {
        try {
            const user = req.user;
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})
            
            const get_products_in_basket = await Basket.find({userId: user.userId})
            if(!get_products_in_basket) return res.status(400).json({message: "Не удалось получить товары из корзины"})
            if(get_products_in_basket.length === 0) return res.status(404).json({message: "Ни одного товара не добавлено в корзину"})

            res.status(200).json({message: "Вы успешно получили товары из корзины", get_products_in_basket})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: "Ошибка сервера при получении товаров из корзины"})
        }
    }
    async addItem (req, res) {
        try {
           const id = req.params.id;
           const user = req.user
           
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

           if (!isValidObjectId(id)) return res.status(400).json({message: "Некорректный id"})

           const product = await Products.findById(id);
           if(!product) return res.status(400).json({message: "Не удалось добавить товар. Возможно этот товар был удалён"})
          
            if(
                !product.title
                || !product.description
                || !product.price
                || !product._id
                || !product.images
            ) return res.status(400).json({message: "Некоторые поля пропущены"})



            const basket = new Basket({title: product.title, description: product.description, price: product.price, userId: user.userId, images: product.images, favicon: product.favicon, my_id: product._id, count: 1})
            if(!basket) return res.status(400).json({message: "Ошибка при добавлении товара в корзину"})
            
            await basket.save()
            res.status(201).json({message: "Товар успешно добавлен в корзину"})

        } catch (error) {
            console.error(error)
            res.status(500).json({message: "Ошибка сервера при добавлении товара в корзину"})
        }
    }
    async deleteItem (req, res) {
        try {
            const id = req.params.id;
            if(!isValidObjectId(id)) return res.status(400).json({message: "Некорректный id"});
            
            const item = await Basket.findById(id);
            if(!item) return res.status(400).json({message: "Элемент не найден в корзине"})

            const delete_item = await Basket.findByIdAndDelete(id);
            if(!delete_item) return res.status(400).json({message: "Не удалось удалить элемент из корзины"})

            res.status(200).json({message: "Элемент успешно удалён из корзины"})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: "Ошибка сервера при удаления товара из корзины"})
        }
    }
    async increase (req, res) {
        try {
            const id = req.params.id;
            if(!isValidObjectId(id)) return res.status(400).json({message: "Некорректный id"});
            
            const user = req.user;
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

            const count = await Basket.findById(id);
            if(!count) return res.status(400).json({message: "Не удалось найти товар"});
    
            // Преобразуем count.count в число, если это строка или что-то другое
            const currentCount = Number(count.count);

            // Проверяем, что currentCount - это число и оно не NaN
            if (isNaN(currentCount)) {
                return res.status(400).json({ message: "Некорректное значение count" });
            }
    
            const result = currentCount + 1;
    
            //  Добавим проверку, что результат - целое число
            if (!Number.isInteger(result)) {
                return res.status(400).json({message: "Некорректное значение count"});
            }
    
            const plus = await Basket.findByIdAndUpdate(id, { count: result });
            if (!plus) return res.status(400).json({ message: "Не увеличить" });
    
            res.status(200).json({ message: "Вы успешно увеличили количество одного товара в корзине", result });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка сервера при увеличении количества товара в корзине" });
        }
    }
    async decrease (req, res) {
        try {
            const id = req.params.id;
            if(!isValidObjectId(id)) return res.status(400).json({message: "Некорректный id"});
            
            const user = req.user;
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

            const count = await Basket.findById(id);
            if(!count) return res.status(400).json({message: "Не удалось найти товар"});
    
            // Преобразуем count.count в число, если это строка или что-то другое
            const currentCount = Number(count.count);
            console.log(currentCount)
            // Проверяем, что currentCount - это число и оно не NaN
            if (isNaN(currentCount)) {
                return res.status(400).json({ message: "Некорректное значение count" });
            }
            let result = currentCount;

            if(result === 1 || result < 1) {
                return res.status(400).json({message: "Невозможно уменьшить"})
             }

            result = currentCount - 1;

            
    
            //  Добавим проверку, что результат - целое число
            if (!Number.isInteger(result)) {
                return res.status(400).json({message: "Некорректное значение count"});
            }
    
            const plus = await Basket.findByIdAndUpdate(id, { count: result });
            if (!plus) return res.status(400).json({ message: "Не увеличить" });
    
            res.status(200).json({ message: "Вы успешно уменьшили количество одного товара в корзине", result});
        } catch (error) {
          console.error(error);
          res.status(500).json({message: "Ошибка сервера при уменьшении количества товара в корзине"})
        }
    }
    async getCount (req, res) {
        try {
            const id = req.params.id
            if(!isValidObjectId(id)) return res.status(400).json({message: "Некорректный id"});
            
            const user = req.user;
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

            const find_count = await Basket.findById(id);
            if(!find_count) return res.status(404).json({message: "Продукт не найден"})


            const count = find_count.count;
            console.log(count, find_count)
            
            res.status(200).json({message: "Успешно", count})
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Ошибка сервера при получении count"})
        }
    }
    async hasItem (req, res) {
        try {
            const id = req.params.id;
            if(!isValidObjectId(id)) return res.status(400).json({message: "Некорректный id"});

            const find = await Basket.findOne({my_id: id});
            
            if(!find) {
                return res.status(200).json({message: "Не найдено", isFind: false})
            }
            res.status(200).json({message: "Найдено", isFind: true})

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Ошибка сервера"})
        }
    }
    async infoBasket (req, res) {
        try {
            const user = req.user
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

            const basket = await Basket.find({userId: user.userId})   
            if(!basket) return res.status(404).json({message: "Корзина пуста"})
            
            let price = 0

             basket.forEach((item) => {       
                price += Number(item.price * item.count)
            }
            )
            const full_price = price;

            const count = await Basket.countDocuments({userId: user.userId})
            if(!count || count < 1) return res.status(404).json({message: "Корзина пуста"})

           
            //Еще какая нибудь информация

            res.status(200).json({message: "Вы успешно получили информацию о корзине",count, full_price})
            
        } catch (error) {
           console.error(error);
           res.status(500).json({message: "Ошибка сервера при получении информации о корзине"})     
        }
    }
}

module.exports = new BasketController();