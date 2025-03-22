const Products = require('../models/Product.model');
const Category = require('../models/Category.model')
const My_product = require('../models/My_product.model')
const { validationResult } = require('express-validator')
const { isValidObjectId } = require('mongoose')
const fs = require('fs')
const path = require('path')

class MethodsProduct {
    async getProduct(req, res) {
        try {
            const id = req.params.id;

            if (!isValidObjectId(id)) return res.status(400).json({ message: "Некорректный id" })

            const product = await Products.findById(id);
            if (!product) return res.status(404).json({ message: "Такого товара не существует" });

            res.status(200).json({ message: `Удалось получить товар с id: ${id}`, product })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка сервера при получении товара" })
        }
    }
    async getProducts(req, res) {
        try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const skip = (page - 1) * limit;
          const title = req.query.title?.trim().toLowerCase() || '';
          const category = req.params.category;

          const filter = { category }; 
      
          if (title) {
            filter.title = { $regex: title, $options: 'i' };
          }
      
          const products = await Products.find(filter).skip(skip).limit(limit);
      
          if (!products) return res.status(400).json({ message: "Ошибка при получении товаров" });
          if (products.length === 0) return res.status(404).json({ message: "Ни одного товара не найдено" });
      
          const totalProducts = await Products.countDocuments(filter);
          const totalPages = Math.ceil(totalProducts / limit);
      
          res.status(200).json({ message: "Вы успешно получили товары", products, totalPages });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Ошибка сервера при получении товаров" });
        }
      }
    async addProduct(req, res) {
        try {

            const { title, description, price, category } = req.body;

            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            const images = req.files;

            if (!images || !Array.isArray(images)) {
                return res.status(400).json({ message: "Не переданы изображения" });
            }
               
                
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);
                return res.status(400).json({ message: "Некорректные данные", errors: errorMessages });
            }
            const user = req.user;
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

            const imagesPath = images.map((image) => image.path)
            const faviconPath = imagesPath[0];
            
            for (const image of images) {
                if(Array.isArray(images)) {
                if (!allowedImageTypes.includes(image.mimetype) || imagesPath.length > 10) {
                        for (const imageToDelete of images) { 
                            try {
                                const uploadsDir = path.join(__dirname, '..');
                                const fullPath = path.join(uploadsDir, imageToDelete.path);
                                fs.unlink(fullPath, (err) => {
                                    if (err) {
                                        console.error(`Ошибка при удалении файла ${fullPath}:`, err);
                                    } else {
                                        console.log(`Файл ${fullPath} удален`);
                                    }
                                });
                            } catch (error) {
                                console.error(`Ошибка при удалении файла ${imageToDelete.path}:`, error);
                            }
                        }
                    }
                    if(!allowedImageTypes.includes(image.mimetype)) return res.status(400).json({ message: "Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WebP). Или превышен лимит" });
                    if(imagesPath.length > 10) return res.status(400).json({message: "Превышен лимит"})
                }
            }
        

        if(imagesPath.length > 10) return res.status(400).json({message: "Превышен лимит"})



            const product = new Products({ title, description, images: imagesPath, favicon: faviconPath, price, category });
            await product.save();
            const product_id = product._id;


            const my_product = new My_product({ title: product.title, description: product.description, images: product.images, favicon: product.favicon, price: product.price, category: product.category, userId: user.userId, my_id: product._id })
            if (!my_product) return res.status(400).json({ message: "Ошибка при добавлении товары в ваш" })

            await my_product.save()

            const findCategory = await Category.findOne({ name: category })
            if (!findCategory) {
                const newCategory = new Category({ name: category })
                await newCategory.save();
            }


            res.status(200).json({ message: "Товар успешно создан", product_id })

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка сервера при добавлении товара" })
        }
    }
    async deleteProduct(req, res) {
        try {
            const id = req.params.id;

            if (!isValidObjectId(id)) return res.status(400).json({ message: "Некорректный id" })

            const candidate = await Products.findById(id);
            if (!candidate) return res.status(404).json({ message: "Не найден товар" });


            if (candidate && candidate.images && Array.isArray(candidate.images)) {
                for (const imagePath of candidate.images) {
                    try {
                        const uploadsDir = path.join(__dirname, '..')
                        const fullPath = path.join(uploadsDir, imagePath);
                        fs.unlink(fullPath, (err) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(`Файл ${fullPath} удален`);
                            }
                        });
                    } catch (error) {
                        console.error(`Ошибка при удалении файла ${imagePath}:`, error);
                    }
                }
            }

            const delete_product = await Products.findByIdAndDelete(id);
            if (!delete_product) return res.status(400).json({ message: "Не удалось удалить товар" });


            const delete_user_product = await My_product.deleteOne({ my_id: id })
            if (!delete_user_product) return res.status(400).json({ message: "Ошибка при удалении user-product" })

            const probably_delete_category = await Products.find({ category: candidate.category })
            if (probably_delete_category.length === 0) {
                await Category.deleteOne({ name: candidate.category })
            }

            res.status(200).json({ message: "Товар успешно удален" })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка сервера при удалении товара" })
        }
    }
    async getCategories(req, res) {
        try {
            const categories = await Category.find();
            if (!categories) return res.status(400).json({ message: "Ошибка при получении категорий" })
            if (categories.length === 0) return res.status(404).json({ message: "Категории не найдены" })

            res.status(200).json({ message: "Вы успешно получили категории", categories })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка сервера при получении категорий" })
        }
    }
    async getAllProducts(req, res) {
        try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const skip = (page - 1) * limit;
          const title = req.query.title?.trim().toLowerCase() || ''; 
      

          const filter = title ? { title: { $regex: title, $options: 'i' } } : {};
      

          const products = await Products.find(filter)
            .skip(skip)
            .limit(limit);
      
          if (!products) return res.status(400).json({ message: "Ошибка при получении всех товаров" });
          if (products.length === 0) return res.status(404).json({ message: "Товары не найдены" });
      
          // Подсчитываем общее количество товаров, соответствующих фильтру
          const totalProducts = await Products.countDocuments(filter);
          const totalPages = Math.ceil(totalProducts / limit);
      
          res.status(200).json({
            message: "Вы успешно получили все товары",
            all_products: products, // Переименовали переменную для соответствия
            totalPages,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Ошибка сервера при получении всех товаров" });
        }
      }
      
      
    async getProfileProducts(req, res) {
        try {
            const user = req.user
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

            const my_products = await My_product.find({ userId: user.userId })
            if (!my_products) return res.status(400).json({ message: "Ошибка при получении моих товаров" })
            if (my_products.length === 0) return res.status(404).json({ message: "Вы не выложили ни одного товара" })

            res.status(200).json({ message: "Вы успешно получили товары", my_products: my_products })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "Ошибка сервера при получении товаров пользователя" })
        }
    }
    async getOneMyProduct(req, res) {
        try {
            const id = req.params.id;
            if (!isValidObjectId(id)) return res.status(400).json({ message: "Некорректный id" })

            const user = req.user
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

            const get_my_product = await My_product.findOne({ _id: id })
            if (!get_my_product) return res.status(404).json({ message: "Такой товар не найден" })
            if (String(get_my_product.userId) !== String(user.userId)) return res.status(400).json({ message: "Вы не авторизованы" })

            res.status(200).json({ message: "Удалось получить товар User", get_my_product })

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка сервера при получении товара User" })
        }
    }
    async putProduct (req, res) {
        try {
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            const user = req.user;
            if(!user) return res.status(401).json({message: "Вы не авторизованы"})

            const id = req.params.id;
            const { title, description, price, category } = req.body;
            const images = req.files;


            const updateFields = {}; 
            let hasChanges = false; 
    
            console.log(images.length)
            if (images.length !== 0 && images) {
                const imagesPath = images.map((image) => image.path);
                updateFields.images = imagesPath;
                updateFields.favicon = imagesPath[0];
                for (const image of images) {
                    if(Array.isArray(images)) {
                    if (!allowedImageTypes.includes(image.mimetype) || imagesPath.length > 10) {
                            for (const imageToDelete of images) { 
                                try {
                                    const uploadsDir = path.join(__dirname, '..');
                                    const fullPath = path.join(uploadsDir, imageToDelete.path);
                                    fs.unlink(fullPath, (err) => {
                                        if (err) {
                                            console.error(`Ошибка при удалении файла ${fullPath}:`, err);
                                        } else {
                                            console.log(`Файл ${fullPath} удален`);
                                        }
                                    });
                                } catch (error) {
                                    console.error(`Ошибка при удалении файла ${imageToDelete.path}:`, error);
                                }
                            }
                        }
                        if(!allowedImageTypes.includes(image.mimetype)) return res.status(400).json({ message: "Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WebP). Или превышен лимит" });
                        if(imagesPath.length > 10) return res.status(400).json({message: "Превышен лимит"})
                    }
                } 
               hasChanges = true;
            } else {
                const mp = await My_product.findById(id);

                const first_images = mp.images;
                const first_favicon = mp.favicon

                updateFields.images = first_images;
                updateFields.favicon = first_favicon          
            }
    
            if (title) {
                updateFields.title = title;
                hasChanges = true;
            }
            if (description) {
                updateFields.description = description;
                hasChanges = true;
            }
            if (price) {
                updateFields.price = price;
                hasChanges = true;
            }
            if (category) {
                updateFields.category = category;
                hasChanges = true;
            }
    
            if (!hasChanges) {
                return res.status(400).json({ message: "Вы ничего не изменили" });
            }
            const findMyProduct = await My_product.findById(id);
            if(!findMyProduct) return res.status(400).json({ message: "Продукт с таким id не найден"})

            const updatedProduct = await Products.findByIdAndUpdate(
                findMyProduct.my_id,
                { $set: updateFields },
                { new: true } 
            );

            const update_myProduct = await My_product.findByIdAndUpdate(
                id,
                {$set: updateFields},
                {new: true}
            )
            if (!updatedProduct || !update_myProduct) {
                return res.status(404).json({ message: "Товар не найден" });
            }
            if(updateFields.category) {

            const findCategory = await Category.findOne({ name: updateFields.category })
            if (!findCategory) {
                const newCategory = new Category({ name: updateFields.category })
                await newCategory.save();
            }
            }
            console.log(updateFields);
            
            res.status(200).json({ message: "Вы успешно изменили свой товар", product: updatedProduct });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка сервера при изменении данных" });
        }
    }
}
module.exports = new MethodsProduct();