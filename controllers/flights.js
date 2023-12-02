const Flight = require('../models/flight');
const Ticket = require('../models/ticket');

module.exports = {
    index,
    new: newFlight,
    create,
    show,
    newTicket,
    createTicket,
    deleteTicket
};

async function index(req, res) {
    const flights = await Flight.find({}).sort({departs:1});
    const curDate = new Date();
    res.render('flights/index', {
        title: 'All Flights',
        curDate,
        flights
    });
};

function newFlight(req, res) {
    const newFlight = new Flight();
    const dt = newFlight.departs;
    let departsDate = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`;
    departsDate += `-${dt.getDate().toString().padStart(2, '0')}T${dt.toTimeString().slice(0, 5)}`;
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

async function show(req, res) {
    const flight = await Flight.findById(req.params.id);
    flight.destinations.sort((a,b) => {
        return new Date(a.arrival) - new Date(b.arrival);
    });
    const tickets = await Ticket.find({flight: flight._id});
    let unvisited = ['AUS', 'DFW', 'DEN', 'LAX', 'SAN']
    flight.destinations.forEach((d) => {
        unvisited = unvisited.filter((u) => u !== d.airport && u !== flight.airport)
    });
    res.render('flights/show', { title: 'Flight Details', flight, tickets, unvisited });
};

function newTicket(req, res) {
    const id = req.params.id
    res.render('tickets/new', {
        title: 'Add Ticket',
        id,
        errorMsg: ''
    });
};

async function createTicket(req, res) {
    try {
        await Ticket.create(req.body)
        res.redirect(`/flights/${req.body.flight}`)
    } catch (err) {
        console.log(err);
        res.render('tickets/new', {
            title: 'Add Ticket',
            errorMsg: err.message
        });
    };
};

async function deleteTicket(req, res) {
    await Ticket.deleteOne({'flight': req.body.flight});
    try {
        res.redirect(`/flights/${req.params.id}`,);
    } catch(err) {
        console.log(err);
    };
};