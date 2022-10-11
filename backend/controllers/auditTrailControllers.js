const auditTrailRoutes = require('../models/auditTrailModel')
const mongoose = require('mongoose')

// get all audit trail data
const getAuditTrail = async (req, res) => {
  const audittrail = await auditTrailRoutes.find({}).sort({ createdAt: -1 })

  res.status(200).json(audittrail)
}

// get a single audit trail data
const getOneAuditTrail = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Empty' })
  }

  const audittrail = await auditTrailRoutes.findById(id)

  if (!auditTrailRoutes) {
    return res.status(404).json({ error: 'Empty' })
  }

  res.status(200).json(audittrail)
}

// dummy create audit trail data for testing
const createAuditTrail = async (req, res) => {
  const {
    nWorkDays,
    tWorkHours,
    basicSalary,
    taxDeduction,
    insuranceDeduction,
    nUnpaidLeave,
    nTaxableLeave,
    alBonus,
    penalties,
    cAdvance,
    overPay,
    uPayPenalty,
    totalEarning,
    totalDeductions,
    netPay
  } = req.body

  // add to the database
  try {
    const audittrail = await auditTrailRoutes.create({
      nWorkDays,
      tWorkHours,
      basicSalary,
      taxDeduction,
      insuranceDeduction,
      nUnpaidLeave,
      nTaxableLeave,
      alBonus,
      penalties,
      cAdvance,
      overPay,
      uPayPenalty,
      totalEarning,
      totalDeductions,
      netPay
    })
    res.status(200).json(audittrail)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a audit trail data
const deleteAuditTrail = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Empty' })
  }

  const audittrail = await auditTrailRoutes.findOneAndDelete({ _id: id })

  if (!audittrail) {
    return res.status(400).json({ error: 'Empty' })
  }

  res.status(200).json(audittrail)
}

// update a audit trail data
const updateAuditTrail = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Empty' })
  }

  const audittrail = await auditTrailRoutes.findOneAndUpdate({ _id: id }, {
    ...req.body
  })

  if (!audittrail) {
    return res.status(400).json({ error: 'Empty' })
  }

  res.status(200).json(audittrail)
}

module.exports = {
  getAuditTrail,
  getOneAuditTrail,
  createAuditTrail,
  deleteAuditTrail,
  updateAuditTrail
}