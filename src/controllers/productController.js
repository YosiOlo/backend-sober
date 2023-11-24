const { where } = require('sequelize');
const {
    ec_product_categories, 
    ec_customer,
    ec_customer_recently_viewed_product,
    ec_products, 
    Sequelize,
    ec_options, 
    ec_option_value,
    ec_global_options,
    ec_global_option_value,
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
    ec_product_variations,
    ec_product_variation_items,
    ec_product_collection_products,
    ec_product_collections,
    ec_product_tags,
    ec_product_tag_product,
    ec_product_with_attribute_set,
    ec_product_labels,
    ec_product_label_products,
    mp_stores,
    sequelize
} = require('../models');
const fs = require('fs');
const jwt = require('jsonwebtoken');
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
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
            });
        }   
    },

    async listProducts(req, res) {
        page = req.query.page || 1;
        limit = req.query.limit || 10;
        search = req.query.search || '';

        kategori = req.query.kategori || '';
        kategori_2 = req.query.kategori_2 || '';
        kategori_3 = req.query.kategori_3 || '';

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
                orderby = 'id'
                order = 'ASC'
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
                            [Op.and]: [
                                {
                                    kategori1: {
                                        [Op.or]: [
                                            {
                                                [Op.iLike]: `%${kategori}%`
                                            },
                                            {
                                                [Op.eq]: null
                                            }
                                        ]
                                    }
                                },
                                {
                                    kategori2: {
                                        [Op.or]: [
                                            {
                                                [Op.iLike]: `%${kategori_2}%`
                                            },
                                            {
                                                [Op.eq]: null
                                            }
                                        ]
                                    }
                                },
                                {
                                    kategori3: {
                                        [Op.or]: [
                                            {
                                                [Op.iLike]: `%${kategori_3}%`
                                            },
                                            {
                                                [Op.eq]: null
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            is_variation: 0
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
                }, {
                    model: ec_product_label_products,
                    as: 'product_labels',
                    attributes: {
                        exclude: ['product_id', 'id']
                    },
                    include: [{
                        model: ec_product_labels,
                        as: 'deflabel',
                        attributes: {
                            exclude: ['id','created_at','updated_at']
                        }
                    }]
                },'brand', 'reviews'],
                attributes: {
                    exclude: ['content','description']
                }
            });
            let arrays = [];
            products.rows.map((product) => {
                let images = []
                const split = product.dataValues.images.split(',').map((image) => {
                    //remove backslash, double quote, and square bracket
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });
                let diskon
                if (product.dataValues.hpp > product.dataValues.sale_price) {
                    diskon = ((product.dataValues.hpp - product.dataValues.sale_price) / product.dataValues.hpp) * 100;
                    diskon = Math.round(diskon) + "%"
                } else {
                    diskon = null
                }
                arrays.push({
                    discount: diskon,
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
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
            });
        }   
    },

    async listProductsByVendor(req, res) {
        let {id} = req.params;

        if (isNaN(id)) {
            id = id.replace(/'/g, "''");
        }
        
        try {
            const product = await ec_products.findAll({
                where: {
                    [Op.or]: [
                        {
                            is_variation: 0,
                            '$store.name$': Sequelize.where(Sequelize.fn('lower', Sequelize.fn('replace', Sequelize.col('store.name'), ' ', '-')), 'LIKE', '%' + id + '%'),
                            [Op.not]: {
                                store_id: null
                            }
                        },
                        {
                            is_variation: 0,
                            store_id: isNaN(id) ? null : id,
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
                attributes: {
                    exclude: ['content','description']
                }
            });

            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Product Not Found',
                    data: {}
                });
            } else {
                let arrays = [];
                product.map((product) => {
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
                    message: 'success get product',
                    data: arrays
                })
            }
        } catch(e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
            });
        }
    },

    async detailProduct(req, res) {
        let id = req.params.id;
        const tokens = req.cookies? req.cookies.token_remember : null;

        if (isNaN(id)) {
            id = id.replace(/'/g, "''");
        }
        
        try {
            const product = await ec_products.findOne({
                where: {
                    [Op.or]: [
                        {
                            name: Sequelize.where(Sequelize.fn('lower', Sequelize.fn('replace', Sequelize.col('ec_products.name'), ' ', '-')), 'LIKE', '%' + id + '%'),
                            is_variation: 0
                        },{
                            id: isNaN(id) ? null : id,
                            is_variation: 0
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
                }, {
                    model: ec_product_variations,
                    as: 'product_variations',
                    include: [{
                        model: ec_product_variation_items,
                        as: 'items',
                        attributes: {
                            exclude: ['attribute_id','variation_id']
                        },
                        include: [{
                            model: ec_product_attributes,
                            as: 'var_items',
                            // include: [{
                            //     model: ec_product_attribute_sets,
                            //     as: 'set_data',
                            //     attributes: {
                            //         exclude: ['id','order','status','created_at','updated_at','display_output']
                            //     },
                            // }],
                            attributes: {
                                exclude: ['id','attribute_set_id','order','status','created_at','updated_at']
                            },
                        }]
                    }],
                    attributes: {
                        exclude: ['configurable_product_id', 'id']
                    },
                }, {
                    model: ec_product_with_attribute_set,
                    as: 'product_attribute_set',
                    attributes: {
                        exclude: ['attribute_set_id','product_id']
                    },
                    include: [{
                        model: ec_product_attribute_sets,
                        as: 'attribute_set',
                        attributes: {
                            exclude: ['id','status','created_at','updated_at']
                        },
                        include: [{
                            model: ec_product_attributes,
                            as: 'set_data',
                        }]
                    }]
                    
                }, {
                    model: ec_product_label_products,
                    as: 'product_labels',
                    attributes: {
                        exclude: ['product_id']
                    },
                    include: [{
                        model: ec_product_labels,
                        as: 'deflabel',
                        attributes: {
                            exclude: ['id','created_at','updated_at']
                        }
                    }]
                }, 'brand', 'reviews'],
                attributes: {
                    exclude: ['kategori1','kategori2','kategori3']
                }
            });
            try {
                if (tokens != null) {
                    const decoded = jwt.verify(tokens, process.env.JWT_SECRET);
                    const userId = decoded.id;
                    const user = await ec_customer.findOne({
                        where: {
                            id: userId
                        }
                    });
                    if (user) {
                        await ec_customer_recently_viewed_product.create({
                            product_id: product.dataValues.id,
                            customer_id: userId
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
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
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
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
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
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
                orderby = 'id'
                order = 'ASC'
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
                        },
                        {
                            is_variation: 0
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
                attributes: {
                    exclude: ['content','description']
                }
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
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
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
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
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
            cross_sale,
            tags,
            attributes_variation,
            options,
        } = req.body;
        try {
            //check field
            if (!name || !etalase || !description 
                || !content || !price || !stock || !weight 
                || !sku || !kategori_1 || !kategori_2 
                || !kategori_3 || !barcodes || !brand_id || !fee
                || !hpp || !sale_price || !cost_per_item || !stock_status
                || !wide || !length || !height
                ) {
                return res.status(400).json({
                    status: 400,
                    message: 'field is required (name, etalase, description, content, price, stock, weight, sku, kategori_1, kategori_2, kategori_3, barcodes, brand_id, fee, hpp, sale_price, cost_per_item, stock_status, wide, length, height)',
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
            if (related_products != '' && related_products != undefined) {
                try {
                    const relatedProductsArray = JSON.parse(related_products);
                    relatedProductsArray.map(async (related_product) => {
                        await ec_product_related_relations.create({
                            from_product_id: product.dataValues.id,
                            to_product_id: related_product
                        });
                    });
                } catch (error) {
                    return res.status(400).json({
                        status: 400,
                        message: 'Related Products must be an array',
                    });
                }
            }

            //add product cross sale
            if (cross_sale != '' && cross_sale != undefined) {
                try {
                    const crossSaleArray = JSON.parse(cross_sale);
                    crossSaleArray.map(async (cross_sale) => {
                        await ec_product_cross_sale_relations.create({
                            from_product_id: product.dataValues.id,
                            to_product_id: cross_sale
                        });
                    });
                } catch (error) {
                    return res.status(400).json({
                        status: 400,
                        message: 'Cross Sale Products must be an array',
                    });
                }
            }

            //add product collections
            if (product_collections != '' && product_collections != undefined) {
                try {
                    const productCollectionsArray = JSON.parse(product_collections);
                    productCollectionsArray.map(async (product_collection) => {
                        //check collection
                        const collection = await ec_product_collections.findOne({
                            where: {
                                id: product_collection
                            }
                        });
                        if (!collection) {
                            return res.status(400).json({
                                status: 400,
                                message: 'Product Collection Not Found',
                            });
                        }
                        await ec_product_collection_products.create({
                            product_collection_id: product_collection,
                            product_id: product.dataValues.id
                        });
                    });
                } catch (error) {
                    return res.status(400).json({
                        status: 400,
                        message: 'Product Collections must be an array',
                    });
                }
            }

            //add product tags
            if (tags != undefined && tags != '') {
                try {
                    const tagsArray = JSON.parse(tags);
                    tagsArray.map(async (tag) => {
                        //check tag
                        const tagExist = await ec_product_tags.findOne({
                            where: {
                                id: tag
                            }
                        });
                        if (!tagExist) {
                            return res.status(400).json({
                                status: 400,
                                message: 'Tag Not Found',
                            });
                        }
                        await ec_product_tag_product.create({
                            product_id: product.dataValues.id,
                            tag_id: tag
                        });
                    });
                } catch (error) {
                    return res.status(400).json({
                        status: 400,
                        message: 'Tags must be an array',
                    });
                }
            }

            //add product options
            if (options != undefined && options != '') {
                try {
                    const optionsArray = JSON.parse(options);
                    optionsArray.map(async (option, index) => {
                        if (!option.name || !option.type || !option.is_required || !option.values) {
                            return res.status(400).json({
                                status: 400,
                                message: `field is required (name, type, is_required, values) on index ${index}`,
                            });
                        }
                        const datas = await ec_options.create({
                            product_id: product.dataValues.id,
                            name: option.name,
                            option_type: option.type,
                            is_required: option.is_required,
                            order: index
                        });
                        const optionId = datas.dataValues.id;
                        const optionValuesArray = option.values;
                        optionValuesArray.map(async (optionValue, index) => {
                            if (!optionValue.label || !optionValue.price || !optionValue.price_type) {
                                return res.status(400).json({
                                    status: 400,
                                    message: `field is required (label, price, price_type) on index ${index}`,
                                });
                            }
                            await ec_option_value.create({
                                option_id: optionId,
                                option_value: optionValue.label,
                                affect_price: optionValue.price,
                                order: index,
                                affect_type: optionValue.price_type,
                            });
                        });
                    });
                } catch (error) {
                    return res.status(400).json({
                        status: 400,
                        message: 'Options must be an object',
                    });
                }
            }

            //add product attributes
            if (attributes_variation != undefined && attributes_variation != '') {
                try {
                    const attributesVariationArray = JSON.parse(attributes_variation);
                    attributesVariationArray.map(async (attribute, index) => {
                        //check attribute sets
                        const attributeSet = await ec_product_attribute_sets.findOne({
                            where: {
                                id: attribute
                            }
                        });
                        if (!attributeSet) {
                            return res.status(400).json({
                                status: 400,
                                message: 'Attribute Set Not Found',
                            });
                        }
                        
                        const sets = await ec_product_with_attribute_set.create({
                            product_id: product.dataValues.id,
                            attribute_set_id: attribute,
                            order: 0
                        });
                      
                    });
                } catch (error) {
                    return res.status(400).json({
                        status: 400,
                        message: 'Attributes must be an object',
                    });
                }
            }
  
            return res.status(200).json({
                status: 200,
                message: 'Success Add Product',
                data: product
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
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
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
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
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
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
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
            });   
        }
    }
}
        