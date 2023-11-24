const {kodepos, Sequelize} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async listKodepos(req, res) {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const search = req.query.search ? req.query.search: '';

        const offset = page * limit - limit;

        try {
            const kodeposAll = await kodepos.findAndCountAll({
                where: {
                    [Op.or]: [
                        {
                            kodepos: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            provinsi: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            kota: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            kecamatan: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            kelurahan: {
                                [Op.iLike]: `%${search}%`
                            }
                        }
                    ]
                },
                order: [
                    ['kodepos', 'ASC']
                ],
                limit: parseInt(limit),
                offset: offset,
            });
            res.status(200).json({
                status: 200,
                message: 'Success',
                pages: page,
                data: kodeposAll
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 500,
                message: "Failed get kodepos data"
            });
        }
    },
    async kodeposById(req, res) {
        const {id} = req.query

        try {
            const kodepos = kodepos.findOne({
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: 'Success',
                status: 200,
                data: kodepos
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({
                status: 500,
                message: "Failed get kodepos data"
            })
        }
    }
}