const express = require('express')
const router = express.Router()
const DoanhNghiep = require('../models/DoanhNghiepModel')

const crypto = require('crypto')

router.post('/postdoanhnghiep', async (req, res) => {
  try {
    const { name } = req.body

    if (!name)
      return res.status(400).json({ message: 'Tên doanh nghiệp là bắt buộc.' })

    const token = crypto.randomBytes(32).toString('hex')
    const doanhnghiep = new DoanhNghiep({ name, token })
    await doanhnghiep.save()

    res
      .status(201)
      .json({ message: 'Tạo doanh nghiệp thành công', doanhnghiep })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ' })
  }
})


module.exports = router
