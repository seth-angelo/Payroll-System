const express = require('express')
const {
  getAuditTrail, 
  getOneAuditTrail,
  createAuditTrail,
  deleteAuditTrail,
  updateAuditTrail
} = require('../controllers/auditTrailControllers')

const router = express.Router()

// GET all audit trail data
router.get('/', getAuditTrail)

// GET a single audit trail data
router.get('/:id', getOneAuditTrail)

// POST a audit trail data
router.post('/', createAuditTrail)

// DELETE a audit trail data
router.delete('/:id', deleteAuditTrail)

// UPDATE a audit trail data
router.patch('/:id', updateAuditTrail)

module.exports = router

