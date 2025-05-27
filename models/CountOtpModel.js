const mongoose = require('mongoose')

const countotpSchema = new mongoose.Schema({
  doanhnghiep: { type: mongoose.Schema.Types.ObjectId, ref: 'doanhnghiep' },
  phone: { type: String },
  otp: { type: String },
  transaction_id: { type: Number },
  ngay: { type: Date, default: Date.now }
})

const countotp = mongoose.model('countotp', countotpSchema)
module.exports = countotp
