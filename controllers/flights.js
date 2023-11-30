const Flight = require('../models/flight');

module.exports = {
    index,
    new: newFlight,
    create
};

async function index(req, res) {
    const flights = await Flight.find({});
    res.render('flights/index', {
        title: 'All Flights',
        flights
    });
};

function newFlight(req, res) {
    const newFlight = new Flight();
    const dt = newFlight.departs;
    let departsDate = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`;
    departsDate += `-${dt.getDate().toString().padStart(2, '0')}T${dt.toTimeString().slice(0, 5)}`;
    console.log(departsDate)
    res.render('flights/new', {
        title: 'Add Flight',
        departsDate,
        errorMsg: ''
    });
};

async function create(req, res) {
    if (!req.body.departs) delete req.body.departs;
    try {
        await Flight.create(req.body);
        res.redirect('/flights');
    } catch (err) {
        console.log(err);
        res.render('flights/new', {
            title: 'All Flights',
            errorMsg: err.message
        });
    };
};