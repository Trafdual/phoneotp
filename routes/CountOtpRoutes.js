const express = require('express')
const router = express.Router()
const CountOtp = require('../models/CountOtpModel')
const DoanhNghiep = require('../models/DoanhNghiepModel')
const axios = require('axios')

router.post('/postcountotp', async (req, res) => {
  try {
    const { token, phone } = req.body

    const doanhnghiep = await DoanhNghiep.findOne({ token })
    if (!doanhnghiep) {
      return res
        .status(401)
        .json({ message: 'Token doanh nghiệp không hợp lệ' })
    }

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const countOtpToday = await CountOtp.countDocuments({
      phone,
      ngay: { $gte: startOfDay, $lte: endOfDay }
    })

    if (countOtpToday >= 5) {
      return res.status(429).json({
        message: 'Số điện thoại đã vượt quá giới hạn gửi OTP trong ngày'
      })
    }

    const countoptlast = await CountOtp.findOne().sort({ transaction_id: -1 })
    const transaction = countoptlast ? countoptlast.transaction_id + 1 : 1

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpCreatedAt = new Date()

    const response = await axios.post(
      'https://otpapi.work/api/otp/send',
      {
        phone,
        otp,
        transaction_id: transaction.toString()
      },
      {
        headers: {
          Authorization: 'Bearer d0CmSCbPsl5W54afSbLv6zwyDzIb8uWy',
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.status === 'success') {
      const countotp = new CountOtp({
        doanhnghiep: doanhnghiep._id,
        phone,
        transaction_id: transaction,
        otp,
        ngay: otpCreatedAt
      })

      await countotp.save()
      doanhnghiep.countotp.push(countotp._id)

      return res.status(201).json({
        message: 'OTP đã gửi thành công và được lưu',
        otp,
        transaction_id: transaction
      })
    } else {
      return res.status(500).json({ message: 'Gửi OTP thất bại' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ' })
  }
})

router.post('/verifyotp', async (req, res) => {
  try {
    const { phone, otp } = req.body

    const latestOtp = await CountOtp.findOne({ phone, otp }).sort({ ngay: -1 })

    if (!latestOtp) {
      return res.status(400).json({ message: 'OTP không hợp lệ' })
    }
    const now = new Date()
    const diff = now - new Date(latestOtp.ngay)

    const OTP_EXPIRE_TIME = 5 * 60 * 1000

    if (diff > OTP_EXPIRE_TIME) {
      return res.status(400).json({ message: 'OTP đã hết hạn' })
    }

    return res
      .status(200)
      .json({ message: 'OTP hợp lệ', transaction_id: latestOtp.transaction_id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ' })
  }
})

module.exports = router
