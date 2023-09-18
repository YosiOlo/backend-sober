const { where } = require('sequelize');
const {
    ec_product_categories, 
    ec_products, 
    Sequelize,
    ec_product_categories1,
    ec_product_categories2,
    ec_product_categories3,
    ec_product_attribute_sets_translations,
    ec_product_attribute_sets,
    ec_product_attributes_translations,
    ec_product_attributes,
    ec_product_categories_translations,
    ec_product_category_product,
    ec_product_etalase,
    ec_product_translations,
    ec_product_related_relations,
    ec_product_cross_sale_relations,
    mp_stores
} = require('../models');
const fs = require('fs');
const Op = Sequelize.Op;

module.exports = {
    async listProductCategories(req, res) {
        page = req.query.page || 1;
        limit = req.query.limit || 10;
        search = req.query.search || '';
        offset = (page - 1) * limit;
        try {
            const productCategories = await ec_product_categories1.findAndCountAll({
                where: {
                    [Op.and] : {
                        name: {
                            [Op.iLike]: `%${search}%`
                        },
                        is_featured: 1      
                    }
                },
                limit: +limit,
                offset: +offset,
                include: [{
                    model: ec_product_categories2,
                    as: 'category_child_1',
                    include: [{
                        model: ec_product_categories3,
                        as: 'category_child_2',
                    }]
                }]
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Product Categories',
                data: productCategories
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },

    async listProducts(req, res) {
        page = req.query.page || 1;
        limit = req.query.limit || 10;
        search = req.query.search || '';
        offset = (page - 1) * limit;

        let orderby , order;
        switch (req.query.orderby) {
            case 'terbaru':
                orderby = 'created_at'
                order = 'DESC'
                break;
            case 'terlaris':
                orderby = 'terjual'
                order = 'DESC'
                break;
            case 'termurah':
                orderby = 'price'
                order = 'ASC'
                break;
            case 'termahal':
                orderby = 'price'
                order = 'DESC'
                break;
            case 'etalase':
                orderby = 'etalase'
                order = 'ASC'
                break;
            default:
                orderby = 'created_at'
                order = 'DESC'
                break;
        }

        try {
            const products = await ec_products.findAndCountAll({
                where: {
                    [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: `%${search}%`
                        },
                    },{
                        description: {
                            [Op.iLike]: `%${search}%`
                        }
                    }
                ]
                },
                limit: parseInt(limit),
                offset: offset,
                order: [
                    [orderby, order]
                ],
                include: [{
                    model: ec_product_categories1,
                    as: 'kategori_1',
                    on: Sequelize.literal('"ec_products"."kategori1" = "kategori_1"."id"::text')
                }, {
                    model: ec_product_categories2,
                    as: 'kategori_2',
                    on: Sequelize.literal('"ec_products"."kategori2" = "kategori_2"."id"::text')
                }, {
                    model: ec_product_categories3,
                    as: 'kategori_3',
                    on: Sequelize.literal('"ec_products"."kategori3" = "kategori_3"."id"::text')
                }, {
                    model: mp_stores,
                    as: 'store',
                    attributes: {
                        exclude: ['ktp','idktp']
                    }
                }, {
                    model: ec_product_related_relations,
                    as: 'related_products',
                    attributes: {
                        exclude: ['from_product_id', 'id']
                    },
                }, {
                    model: ec_product_cross_sale_relations,
                    as: 'cross_sale_products',
                    attributes: {
                        exclude: ['from_product_id', 'id']
                    },
                },'brand', 'reviews'],
            });
            let arrays = [];
            products.rows.map((product) => {
                let images = []
                const split = product.dataValues.images.split(',').map((image) => {
                    //remove backslash, double quote, and square bracket
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });
                arrays.push({
                    ...product.dataValues,
                    images: images
                });
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Products',
                data: {
                    count: products.count,
                    rows: arrays
                }
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },

    async detailProduct(req, res) {
        const {id} = req.params;
        try {
            const product = await ec_products.findOne({
                where: {
                    id: id
                },
                include: [{
                    model: ec_product_categories1,
                    as: 'kategori_1',
                    on: Sequelize.literal('"ec_products"."kategori1" = "kategori_1"."id"::text')
                }, {
                    model: ec_product_categories2,
                    as: 'kategori_2',
                    on: Sequelize.literal('"ec_products"."kategori2" = "kategori_2"."id"::text')
                }, {
                    model: ec_product_categories3,
                    as: 'kategori_3',
                    on: Sequelize.literal('"ec_products"."kategori3" = "kategori_3"."id"::text')
                }, {
                    model: mp_stores,
                    as: 'store',
                    attributes: {
                        exclude: ['ktp','idktp']
                    }
                }, {
                    model: ec_product_related_relations,
                    as: 'related_products',
                    attributes: {
                        exclude: ['from_product_id', 'id']
                    },
                }, {
                    model: ec_product_cross_sale_relations,
                    as: 'cross_sale_products',
                    attributes: {
                        exclude: ['from_product_id', 'id']
                    },
                }, 'brand', 'reviews'],
            });
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Product Not Found',
                    data: {}
                });
            } else {
                let images = []
                const split = product.dataValues.images.split(',').map((image) => {
                    //remove backslash, double quote, and square bracket
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });

                return res.status(200).json({
                    status: 200,
                    message: 'Success Get Product',
                    data: {
                        ...product.dataValues,
                        images: images
                    }
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },

    async deleteProduct(req, res) {
        const {id} = req.params;
        try {
            const product = await ec_products.findOne({
                where: {
                    id: id
                }
            });
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Product Not Found',
                    data: {}
                });
            } else {
                await product.destroy();

                //delete images from public folder
                const split = product.dataValues.images.split(',').map((image) => {
                    //remove backslash, double quote, and square bracket
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    fs.unlink(`./public/${image}`, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    }
                    );
                });

                //check relations
                const relatedProducts = await ec_product_related_relations.findAll({
                    where: {
                        from_product_id: id
                    }
                });

                if (relatedProducts) {
                    relatedProducts.map(async (relatedProduct) => {
                        await relatedProduct.destroy();
                    });
                }

                return res.status(200).json({
                    status: 200,
                    message: 'Success Delete Product',
                    data: {}
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },

    async vendorProducts(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;

        page = req.query.page || 1;
        limit = req.query.limit || 10;
        search = req.query.search || '';
        offset = (page - 1) * limit;

        let orderby , order;
        switch (req.query.orderby) {
            case 'terbaru':
                orderby = 'created_at'
                order = 'DESC'
                break;
            case 'terlaris':
                orderby = 'terjual'
                order = 'DESC'
                break;
            case 'termurah':
                orderby = 'price'
                order = 'ASC'
                break;
            case 'termahal':
                orderby = 'price'
                order = 'DESC'
                break;
            case 'etalase':
                orderby = 'etalase'
                order = 'ASC'
                break;
            default:
                orderby = 'created_at'
                order = 'DESC'
                break;
        }

        try {
            const products = await ec_products.findAndCountAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {
                                    name: {
                                        [Op.iLike]: `%${search}%`
                                    },
                                },{
                                    description: {
                                        [Op.iLike]: `%${search}%`
                                    }
                                }
                            ]
                        },
                        {
                            store_id: storeId
                        }
                    ]
                },
                include: [{
                    model: ec_product_categories1,
                    as: 'kategori_1',
                    on: Sequelize.literal('"ec_products"."kategori1" = "kategori_1"."id"::text')
                }, {
                    model: ec_product_categories2,
                    as: 'kategori_2',
                    on: Sequelize.literal('"ec_products"."kategori2" = "kategori_2"."id"::text')
                }, {
                    model: ec_product_categories3,
                    as: 'kategori_3',
                    on: Sequelize.literal('"ec_products"."kategori3" = "kategori_3"."id"::text')
                }, {
                    model: ec_product_related_relations,
                    as: 'related_products',
                    attributes: {
                        exclude: ['from_product_id', 'id']
                    },
                }, {
                    model: ec_product_cross_sale_relations,
                    as: 'cross_sale_products',
                    attributes: {
                        exclude: ['from_product_id', 'id']
                    },
                }, 'brand'],
                limit: parseInt(limit),
                offset: offset,
                order: [
                    [orderby, order]
                ],
            });
            let arrays = [];
            products.rows.map((product) => {
                let images = []
                const split = product.dataValues.images.split(',').map((image) => {
                    //remove backslash, double quote, and square bracket
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });
                arrays.push({
                    ...product.dataValues,
                    images: images
                });
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Get Products',
                data: {
                    count: products.count,
                    rows: arrays
                }
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    },

    async vendorDelete(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {id} = req.params;

        try {
            const product = await ec_products.findOne({
                where: {
                    id: id,
                    store_id: storeId
                }
            });
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Product Not Found / Unauthorized Vendor',
                    data: {}
                });
            } else {
                //delete images from public folder
                const split = product.dataValues.images.split(',').map((image) => {
                    //remove backslash, double quote, and square bracket
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");

                    //delete image from public folder
                    fs.unlink(`./public/${image}`, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    }
                    );
                });
                await product.destroy();

                //check relations
                const relatedProducts = await ec_product_related_relations.findAll({
                    where: {
                        from_product_id: id
                    }
                });

                if (relatedProducts) {
                    relatedProducts.map(async (relatedProduct) => {
                        await relatedProduct.destroy();
                    });
                }

                return res.status(200).json({
                    status: 200,
                    message: 'Success Delete Product',
                    data: {}
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    },

    async addProduct(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        
        const {
            name,
            etalase, 
            description, 
            content,
            with_storehouse_management,
            allow_checkout_when_out_of_stock,
            brand_id,
            product_collections,
            price, 
            fee,
            hpp,
            is_variation,
            sale_price,
            cost_per_item,
            stock, 
            stock_status,
            wide,
            length,
            height,
            weight, 
            sku, 
            kategori_1,
            kategori_2,
            kategori_3,
            barcodes,
            related_products,
            cross_sale
        } = req.body;
        try {
            //check field
            if (!name || !etalase || !description 
                || !content || !price || !stock || !weight 
                || !sku || !kategori_1 || !kategori_2 
                || !kategori_3 || !barcodes || !brand_id || !fee
                || !hpp || !sale_price || !cost_per_item || !stock_status
                || !wide || !length || !height || !product_collections
                ) {
                return res.status(400).json({
                    status: 400,
                    message: 'All field is required',
                });
            }

            if (req.files.length < 1) {
                return res.status(400).json({
                    status: 400,
                    message: 'Image is required, minimum 1 image',
                });
            }
            //check if product exist
            const productExist = await ec_products.findOne({
                where: {
                    name: name,
                    store_id: storeId
                }
            });
            if (productExist && is_variation == false) {
                //delete images
                req.files.map((file) => {
                    fs.unlink(`./${file.path}`, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    }
                    );
                });
                return res.status(400).json({
                    status: 400,
                    message: 'Product already exist',
                });
            }
            //check if barcode exist
            const barcodeExist = await ec_products.findOne({
                where: {
                    barcode: barcodes,
                    store_id: storeId
                }
            });
            if (barcodeExist) {
                //delete images
                req.files.map((file) => {
                    fs.unlink(`./${file.path}`, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    }
                    );
                });
                return res.status(400).json({
                    status: 400,
                    message: 'Barcode already exist',
                });
            }

            let images = [];
            req.files.map((file) => {
                //remove public path
                file.path = file.path.replace('public/', '');
                images.push(file.path);
            });
            //serialize images
            images = JSON.stringify(images);
                            
            const product = await ec_products.create({
                name: name,
                etalase: etalase,
                description: description,
                content: content,
                status: 'publish',
                images: images,
                sku: sku,
                allow_checkout_when_out_of_stock: allow_checkout_when_out_of_stock,
                with_storehouse_management: with_storehouse_management,
                brand_id: brand_id,
                hpp: hpp,
                fee: fee,
                price: price,
                sale_price: sale_price,
                start_date: new Date(),
                length: length,
                wide: wide,
                height: height,
                weight: weight,
                stock_status: stock_status,
                created_by_id: 0,
                created_by_type: 'vendor',
                product_type: 'simple',
                barcode: barcodes,
                cost_per_item: cost_per_item,
                store_id: storeId,
                approved_by: 0,
                kategori1: kategori_1,
                kategori2: kategori_2,
                kategori3: kategori_3,
                terjual: 0
            });

            //add product related
            if (JSON.parse(related_products).length > 0) {
                JSON.parse(related_products).map(async (related_product) => {
                    await ec_product_related_relations.create({
                        from_product_id: product.dataValues.id,
                        to_product_id: related_product
                    });
                });
            }

            //add product cross sale
            if (JSON.parse(cross_sale).length > 0) {
                JSON.parse(cross_sale).map(async (cross_sale) => {
                    await ec_product_cross_sale_relations.create({
                        from_product_id: product.dataValues.id,
                        to_product_id: cross_sale
                    });
                });
            }

            return res.status(200).json({
                status: 200,
                message: 'Success Add Product',
                data: product
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });   
        }
    },

    async updateProduct(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {id} = req.params;
        const {
            name, 
            description, 
            price, 
            stock, 
            weight, 
            sku, 
            images, 
            category_id, 
            attribute_set_id
        } = req.body;
        try {
            const product = await ec_products.findOne({
                where: {
                    id: id,
                    store_id: storeId
                }
            });
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Product Not Found / Unauthorized Vendor',
                    data: {}
                });
            } else {
                await product.update({
                    name: name,
                    description: description,
                    price: price,
                    stock: stock,
                    weight: weight,
                    sku: sku,
                    images: images,
                    category_id: category_id,
                    attribute_set_id: attribute_set_id
                });
                return res.status(200).json({
                    status: 200,
                    message: 'Success Update Product',
                    data: product
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });   
        }
    },

    async vendorDeleteEtalase(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {etalase} = req.body;

        try {
            const product = await ec_products.findAll({
                where: {
                    store_id: storeId,
                    etalase: etalase
                }
            });

            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Product Not Found / Unauthorized Vendor',
                    data: {}
                });
            } else {
                product.map(async (item) => {
                    await item.destroy();
                });
                return res.status(200).json({
                    status: 200,
                    message: 'Success Delete Product',
                    data: {}
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });   
        }
    },

    async vendorUpdateEtalase(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {etalase,new_etalase} = req.body;

        try {
            const product = await ec_products.findAll({
                where: {
                    store_id: storeId,
                    etalase: etalase
                }
            });

            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Product Not Found / Unauthorized Vendor',
                    data: {}
                });
            } else {
                product.map(async (item) => {
                    await item.update({
                        etalase: new_etalase
                    });
                });
                return res.status(200).json({
                    status: 200,
                    message: 'Success Update Product',
                    data: {}
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });   
        }
    }
}
        