var express = require('express');
var router = express.Router();
const flightsCtrl = require('../controllers/flights');

router.get('/', function(req, res, next) {
  res.redirect('/flights');
});
router.delete('/tickets/:id', flightsCtrl.deleteTicket)

module.exports = router;
