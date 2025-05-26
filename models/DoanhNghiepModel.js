const mongoose = require('mongoose')

const doanhnghiepSchema = new mongoose.Schema({
  name: { type: String },
  token: { type: String },
  countotp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'countotp' }]
})

const DoanhNghiep = mongoose.model('doanhnghiep', doanhnghiepSchema)
module.exports = DoanhNghiep
