const {
    ec_customer, 
    ec_customer_address,
    ec_customer_waris,
    mp_vendor_info, 
    mp_stores, 
    meta_boxes, 
    Sequelize, 
    users
} = require('../models');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeMailer = require('nodemailer');

module.exports = {
    async forgotPassword(req, res) {
        const {password, repassword, oldpassword} = req.body;
        const {id} = req.user;

        try {
            if (password !== repassword) {
                return res.status(400).json({message: 'Password not match'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

        const user = await ec_customer.findOne({
            where: {
                id: id
            }
        });

        const compare = await bcrypt.compare(oldpassword, user.password);

        if (!compare) {
            return res.status(400).json({message: 'Old password not match'});
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await ec_customer.update({
            password: hash
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({message: 'Password updated'});
    },

    async updateProfile(req, res) {
        const {id} = req.user;
        const {name, tanggal_lahir, telepon} = req.body;

        try {
            const user = await ec_customer.findOne({
                where: {
                    id: id
                }
            });
    
            if (!user) {
                return res.status(400).json({message: 'User not found'});
            }
    
            const data = {
                name: name.length > 0 ? name : user.name,
                dob: tanggal_lahir.length > 0 ? tanggal_lahir : user.dob,
                phone: telepon.length > 0 ? telepon : user.phone,
            }

            await ec_customer.update(data, {
                where: {
                    id: id
                }
            });
    
            return res.status(200).json({message: 'Profile updated'});
        } catch(e) {
            return res.status(500).json({message: e.message});
        }
    },

    async listCustomer(req, res) {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const search = req.query.search ? req.query.search: '';

        const offset = page * limit - limit;

        try {
            const customers = await ec_customer.findAndCountAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            email: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            phone: {
                                [Op.iLike]: `%${search}%`
                            }
                        }
                    ]
                },
                limit: parseInt(limit),
                offset: offset,
                include: ['customer_address', 'customer_paket', 'customer_recently_viewed_product', 'store', 'customer_review', 'customer_tier']
            });
    
            return res.status(200).json(
                customers
            );
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async currentUser(req, res) {
        const {id} = req.user;

        const user = await ec_customer.findOne({
            where: {
                id: id
            },
            include: ['customer_address', 'customer_paket', 'customer_recently_viewed_product']
        });

        return res.status(200).json(user);
    },

    async userInfo (req, res) {
        const {id} = req.user;

        try {
            const user = await ec_customer.findOne({
                where: {
                    id: id
                },
                include: ['customer_address', 'customer_paket', 'customer_recently_viewed_product', {
                    model: mp_stores,
                    as: 'store',
                    attributes: {
                        exclude: ['customer_id', 'idktp', 'ktp', 'origin_shipment', 'branch_shipment']
                    }
                }, 'customer_review', 'customer_tier', 'customer_waris'],
                attributes: {
                    exclude: ['password', 'created_at', 'updated_at', 'deleted_at', 'remember_token', 'id']
                }
            });
    
            if(!user) {
                return res.status(400).json({message: 'User not found'});
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Success user info',
                    data: user
                });
            }
        } catch (e) {
            return res.status(500).json({
                status: 500,
                message: e.message
            });
        }
    },

    async userAddress(req, res) {
        const {id} = req.user;

        const {
            nama,
            email,
            phone,
            negara,
            kota,
            alamat,
            kodepos,
            is_default
        } = req.body;

        try {
            const user = await ec_customer.findOne({
                where: {
                    id: id
                }
            });

            if (!user) {
                return res.status(400).json({message: 'User not found'});
            }

            if (nama?.length === 0 || email?.length === 0 || phone?.length === 0 || negara?.length === 0 || kota?.length === 0 || alamat?.length === 0 || kodepos?.length === 0) {
                return res.status(400).json({message: 'Please fill all field'});
            }

            const data = {
                name: nama,
                email: email,
                phone: phone,
                country: negara,
                city: kota,
                address: alamat,
                postal_code: kodepos,
                is_default: is_default? (is_default === 'true' ? 1 : 0) : 0
            }

            await ec_customer_address.create(data);

            return res.status(200).json({message: 'Address created'});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async userDeleteAddress (req, res) {
        const {id} = req.user;
        const {addressId} = req.params;

        try {
            const user = await ec_customer.findOne({
                where: {
                    id: id
                }
            });

            if (!user) {
                return res.status(400).json({message: 'User not found'});
            }

            const address = await ec_customer_address.findOne({
                where: {
                    id: addressId,
                    customer_id: id
                }
            });

            if(!address) {
                return res.status(400).json({message: 'Address not found / not belong to user'});
            } else {
                await ec_customer_address.destroy({
                    where: {
                        id: addressId
                    }
                });

                return res.status(200).json({message: 'Address deleted'});
            }

        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async userUpdateAddress (req, res) {
        const {id} = req.user;
        const {addressId} = req.params;

        const {
            nama,
            email,
            phone,
            negara,
            kota,
            alamat,
            kodepos,
            is_default
        } = req.body;

        try {
            const user = await ec_customer.findOne({
                where: {
                    id: id
                }
            });

            if (!user) {
                return res.status(400).json({message: 'User not found'});
            }

            const address = await ec_customer_address.findOne({
                where: {
                    id: addressId,
                    customer_id: id
                }
            });

            if(!address) {
                return res.status(400).json({message: 'Address not found / not belong to user'});
            } else {
                const data = {
                    name: nama ? nama : address.name,
                    email: email? email : address.email,
                    phone: phone ? phone : address.phone,
                    country: negara ? negara : address.country,
                    city: kota ? kota : address.city,
                    address: alamat ? alamat : address.address,
                    postal_code: kodepos ? kodepos : address.postal_code,
                    is_default: is_default? (is_default === 'true' ? 1 : 0) : address.is_default
                }

                await ec_customer_address.update(data, {
                    where: {
                        id: addressId
                    }
                });

                return res.status(200).json({message: 'Address updated'});
            }

        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async userAhliWaris (req, res) {
        const userId = req.user.id;

        const {
            nama,
            idktp,
            phone,
            alamat,
            provinsi,
            kota,
            kecamatan,
            is_same_ktp,
            tg_alamat,
            tg_provinsi,
            tg_kota,
            tg_kecamatan
        } = req.body;

        try {
            const user = await ec_customer.findOne({
                where: {
                    id: userId
                }
            });

            if (!user) {
                return res.status(400).json({message: 'User not found'});
            }

            if (nama === '' || nama === undefined || idktp === '' || idktp === undefined || phone === '' || phone === undefined || alamat === '' || alamat === undefined || provinsi === '' || provinsi === undefined || kota === '' || kota === undefined || kecamatan === '' || kecamatan === undefined || is_same_ktp === '' || is_same_ktp === undefined) {
                return res.status(400).json({message: 'Please fill all field'});
            }

            if (is_same_ktp === 'true') {
                const data = {
                    nama: nama,
                    customer_id: userId,
                    idktp: idktp,
                    phone: phone,
                    alamat: alamat,
                    provinsi: provinsi,
                    kota: kota,
                    kecamatan: kecamatan,
                    is_same_ktp: is_same_ktp
                }

                await ec_customer_waris.create(data);
            } else {
                if (tg_alamat === '' || tg_alamat === undefined || tg_provinsi === '' || tg_provinsi === undefined || tg_kota === '' || tg_kota === undefined || tg_kecamatan === '' || tg_kecamatan === undefined) {
                    return res.status(400).json({message: 'Please fill all field'});
                }

                const data = {
                    nama: nama,
                    customer_id: userId,
                    idktp: idktp,
                    phone: phone,
                    alamat: alamat,
                    provinsi: provinsi,
                    kota: kota,
                    kecamatan: kecamatan,
                    is_same_ktp: is_same_ktp,
                    tg_alamat: tg_alamat,
                    tg_provinsi: tg_provinsi,
                    tg_kota: tg_kota,
                    tg_kecamatan: tg_kecamatan
                }
                await ec_customer_waris.create(data);
            }
            return res.status(200).json({message: 'Ahli Waris created'});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    //admin
    async addAdmin(req, res) {
        const {first_name, last_name, username, email, password, repassword} = req.body;

        if (password !== repassword) {
            return res.status(400).json({message: 'Password not match'});
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await users.create({
            username: username,
            email: email,
            password: hash,
            super_user: 1,
            manage_supers: 1
        });

        return res.status(200).json({message: 'Admin created'});
    },

    async updateProfileAdmin(req, res) {
        const {id} = req.user;
        const {first_name, last_name, username, email} = req.body;

        if (id === '' || id === undefined) {
            return res.status(400).json({message: 'Please fill id field'});
        }

        const user = await users.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        await users.update({
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({message: 'Profile updated'});
    },

    async updateCustomerProfile(req, res) {
        const {id} = req.user;
        const {fullname, dateofbirth, phone} = req.body;
        
        //image upload path
        const image_link = req.files['image_link'];

        if (id === '' || id === undefined) {
            return res.status(400).json({message: 'Please fill id field'});
        }

        const user = await ec_customer.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        await ec_customer.update({
            fullname: fullname,
            dateofbirth: dateofbirth,
            phone: phone,
            avatar: image_link[0].path
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({message: 'Profile updated'});
    },

    //vendor
    async vendorInfo(req, res) {
        const {id} = req.user;

        try {
            const vendor = await mp_vendor_info.findOne({
                where: {
                    customer_id: id
                },
                attributes: {
                    exclude: ['customer_id', 'id']
                }
            });

            const store = await mp_stores.findOne({
                where: {
                    customer_id: id
                },
                attributes: {
                    exclude: ['customer_id', 'id']
                }
            });

            if (!vendor || !store) {
                return res.status(400).json({message: 'Vendor not found'});
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Success',
                    data: {
                        vendor_info: {
                            ...vendor.dataValues,
                            tax_info: JSON.parse(vendor.tax_info),
                            bank_info: JSON.parse(vendor.bank_info)
                        },
                        store_info: store
                    }
                });
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async vendorTax(req, res) {
        const userId = req.user.id;
        const {business_name,tax_id,address} = req.body;

        try {
            const vendor = await mp_vendor_info.findOne({
                where: {
                    customer_id: userId
                }
            });

            if (!vendor) {
                return res.status(400).json({message: 'Vendor not found or not registered as vendor'});
            }

            if (vendor.tax_info !== null) {
                const prevData = JSON.parse(vendor.tax_info);
                const newData = {
                    business_name: business_name ? business_name : prevData.business_name,
                    tax_id: tax_id ? tax_id : prevData.tax_id,
                    address: address ? address : prevData.address
                }

                await mp_vendor_info.update({
                    tax_info: JSON.stringify(newData)
                }, {
                    where: {
                        customer_id: userId
                    }
                });

                return res.status(200).json({message: 'Tax info updated'});

            } else {
                const data = {
                    business_name: business_name,
                    tax_id: tax_id,
                    address: address
                }

                await mp_vendor_info.update({
                    tax_info: JSON.stringify(data)
                }, {
                    where: {
                        customer_id: userId
                    }
                });

                return res.status(200).json({message: 'Tax info updated'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async vendorPayment(req, res) {
        const userId = req.user.id;
        const {
            method,
            name,
            code,
            number,
            full_name,
            upi_id,
            description,
            paypal_id,
        } = req.body;

        try {
            const vendor = await mp_vendor_info.findOne({
                where: {
                    customer_id: userId
                }
            });

            if (!vendor) {
                return res.status(400).json({message: 'Vendor not found or not registered as vendor'});
            }

            if (method === 'bank_transfer') {
                const data = {
                    name: name,
                    code: code,
                    number: number,
                    full_name: full_name,
                    upi_id: upi_id,
                    description: description,
                    paypal_id:null
                }

                await mp_vendor_info.update({
                    bank_info: JSON.stringify(data)
                }, {
                    where: {
                        customer_id: userId
                    }
                });

                return res.status(200).json({message: 'Payment info updated'});
            } else if (method === 'paypal') {
                const data = {
                    name: null,
                    code: null,
                    number: null,
                    full_name: null,
                    upi_id: null,
                    description: null,
                    paypal_id: paypal_id
                }

                await mp_vendor_info.update({
                    bank_info: JSON.stringify(data)
                }, {
                    where: {
                        customer_id: userId
                    }
                });

                return res.status(200).json({message: 'Payment info updated'});
            } else {
                return res.status(400).json({message: 'Payment Method not found'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async vendorProfile (req, res) {
        const userId = req.user.id;
        const {
            name,
            email,
            telepon,
            address,
            country,
            state,
            city,
            postal_code,
            description,
            content,
            company_name,
            kelurahan,
            kecamatan,
            id_ktp
        } = req.body;

        try {
            const store = await mp_stores.findOne({
                where: {
                    customer_id: userId
                }
            });

            if (!store) {
                return res.status(400).json({message: 'Store not found or not registered as vendor'});
            }

            let ktp, cover, logo;

            if(req.files.ktp !== undefined){
                ktp = req.files.ktp[0].path.replace("public/", "");
            } else {
                ktp = store.ktp;
            }

            if(req.files.cover !== undefined){
                cover = req.files.cover[0].path.replace("public/", "");
            } else {
                cover = store.cover;
            }

            if(req.files.logo !== undefined){
                logo = req.files.logo[0].path.replace("public/", "");
            } else {
                logo = store.logo;
            }

            const data = {
                name: name? name : store.name ,
                email: email? email : store.email,
                phone: telepon? telepon : store.telepon,
                address: address? address : store.address,
                country: country? country : store.country,
                state: state? state : store.state,
                city: city? city : store.city,
                zip_code: postal_code? postal_code : store.postal_code,
                description: description? description : store.description,
                content: content? content : store.content,
                company: company_name? company_name : store.company_name,
                kelurahan: kelurahan? kelurahan : store.kelurahan,
                kecamatan: kecamatan? kecamatan : store.kecamatan,
                idktp: id_ktp? id_ktp : store.id_ktp,
                ktp: ktp,
                covers: cover,
                logo: logo
            }

            console.log(data)

            await mp_stores.update(data, {
                where: {
                    customer_id: userId
                }
            });

            return res.status(200).json({message: 'Store profile info updated'});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async vendorTambahan(req, res) {
        const userId = req.user.id;
        const {
            facebook,
            instagram,
            twitter,
            youtube,
            linkedin
        } = req.body;

        try {
            const social = await meta_boxes.findOne({
                where: {
                    [Op.and]: [
                        {
                            reference_id: userId
                        },
                        {
                            meta_key: 'socials'
                        }
                    ]
                }
            });

            const background = await meta_boxes.findOne({
                where: {
                    [Op.and]: [
                        {
                            reference_id: userId
                        },
                        {
                            meta_key: 'background'
                        }
                    ]
                }
            });

            if (!social || !background) {
                return res.status(400).json({message: 'Store not found or not registered as vendor'});
            }
            let bgImage
            if (req.file !== undefined) {
                bgImage = req.file.path.replace("public/", "");
            } else {
                bgImage = background.meta_value;
            }


            const dataSocial = JSON.stringify({
                facebook: facebook,
                instagram: instagram,
                twitter: twitter,
                youtube: youtube,
                linkedin: linkedin
            })

            const dataBackground = JSON.stringify({
                background: bgImage
            })

            await meta_boxes.update(dataSocial, {
                where: {
                    [Op.and]: [
                        {
                            reference_id: userId
                        },
                        {
                            meta_key: 'socials'
                        }
                    ]
                }
            });

            await meta_boxes.update(dataBackground, {
                where: {
                    [Op.and]: [
                        {
                            reference_id: userId
                        },
                        {
                            meta_key: 'background'
                        }
                    ]
                }
            });

            return res.status(200).json({message: 'Store profile info updated'});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async listVendor(req, res) {
        try {
            const vendor = await mp_stores.findAll({
                where : {
                    [Op.and]: [
                        {
                            [Op.not]: [
                                {
                                    address: null
                                }
                            ]
                        },
                        {
                            [Op.not]: [
                                {
                                    state: null
                                }
                            ]
                        },
                        {
                            [Op.not]: [
                                {
                                    city: null
                                }
                            ]
                        },
                        {
                            [Op.not]: [
                                {
                                    zip_code: null
                                }
                            ]
                        }
                    ]
                },
                attributes: {
                    exclude: ['customer_id', 'idktp', 'ktp', 'origin_shipment', 'branch_shipment']
                },
            });

            if (!vendor) {
                return res.status(400).json({message: 'Vendor not found'});
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Success',
                    data: vendor
                });
            }

        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }
}