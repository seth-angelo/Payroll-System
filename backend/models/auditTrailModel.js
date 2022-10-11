const mongoose = require('mongoose')

const Schema = mongoose.Schema

const auditTrailSchema = new Schema({

  //Number of Working Days
  nWorkDays: {
    type: Number,
    required: true
  },
  //Total Working Hours
  tWorkHours: {
    type: Number,
    required: true
  },
  //Basic Salary
  basicSalary: {
    type: Number,
    required: true
  },
  //Tax Deduction
  taxDeduction: {
    type: Number,
    required: true
  },
  //Insurance Deduction
  insuranceDeduction: {
    type: Number,
    required: true
  },
  //Number of Unpaid Leave
  nUnpaidLeave: {
    type: Number,
  },
  //Number of Taxable Leave
  nTaxableLeave: {
    type: Number,
  },
  //Allowance & Bonus
  alBonus: {
    type: Number,
  },
  //Penalties
  penalties: {
    type: Number,
  },
  //Cash Advance
  cAdvance: {
    type: Number,
  },
  //Overtime Pay
  overPay: {
    type: Number,
  },
  //Undertime Pay Penalty
  uPayPenalty: {
    type: Number,
  },
  //Total Earning
  totalEarning: {
    type: Number,
    required: true
  },
  //Total Deductions
  totalDeductions: {
    type: Number,
    required: true
  },
  //Net Pay
  netPay: {
    type: Number,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('AuditTrail', auditTrailSchema)