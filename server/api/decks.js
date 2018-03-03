<<<<<<< HEAD
const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/townsquare');
const ObjectId = mongoskin.ObjectId;
const logger = require('../log.js');
=======
const monk = require('monk');
const config = require('../config.js');
const DeckService = require('../services/DeckService.js');
const {wrapAsync} = require('../util.js');

let db = monk(config.dbPath);
let deckService = new DeckService(db);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

module.exports.init = function(server) {
    server.get('/api/decks/:id', wrapAsync(async function(req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(!req.params.id || req.params.id === '') {
            return res.status(404).send({ message: 'No such deck' });
        }

        let deck = await deckService.getById(req.params.id);

        if(!deck) {
            return res.status(404).send({ message: 'No such deck' });
        }

        if(deck.username !== req.user.username) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        res.send({ success: true, deck: deck });
    }));

    server.get('/api/decks', wrapAsync(async function(req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let decks = await deckService.findByUserName(req.user.username);
        res.send({ success: true, decks: decks });
    }));

    server.put('/api/decks/:id', wrapAsync(async function(req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let deck = await deckService.getById(req.params.id);

        if(!deck) {
            return res.status(404).send({ message: 'No such deck' });
        }

        if(deck.username !== req.user.username) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

<<<<<<< HEAD
        db.collection('decks').findOne({ _id: ObjectId.createFromHexString(req.params.id) }, function(err, deck) {
            if(err) {
                res.send({ success: false, message: 'Error saving deck' });
                logger.info(err.message);
                return next(err);
            }

            if(!deck) {
                res.status(404).send({ message: 'No such deck' });

                return next();
            }

            if(deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            var data = JSON.parse(req.body.data);

            db.collection('decks').update({ _id: mongoskin.helper.toObjectID(req.params.id) },
                {
                    '$set': {
                        name: data.deckName,
                        drawCards: data.drawCards,
                        outfit: data.outfit,
                        legend: data.legend,
                        lastUpdated: new Date()
                    }
                });

            res.send({ success: true, message: 'Saved' });
        });
    });

    server.post('/api/decks', function(req, res, next) {
=======
        let data = Object.assign({ id: req.params.id }, JSON.parse(req.body.data));

        deckService.update(data);

        res.send({ success: true, message: 'Saved' });
    }));

    server.post('/api/decks', wrapAsync(async function(req, res) {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

<<<<<<< HEAD
        var data = JSON.parse(req.body.data);

        db.collection('decks').insert({
            username: req.user.username,
            name: data.deckName,
            drawCards: data.drawCards,
            outfit: data.outfit,
            legend: data.legend,
            lastUpdated: new Date()
        }, function(err) {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true });
        });
    });

    server.delete('/api/decks/:id', function(req, res, next) {
=======
        let deck = Object.assign(JSON.parse(req.body.data), { username: req.user.username });
        await deckService.create(deck);
        res.send({ success: true });
    }));

    server.delete('/api/decks/:id', wrapAsync(async function(req, res) {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let id = req.params.id;

        let deck = await deckService.getById(id);

        if(!deck) {
            return res.status(404).send({ success: false, message: 'No such deck' });
        }

        if(deck.username !== req.user.username) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        await deckService.delete(id);
        res.send({ success: true, message: 'Deck deleted successfully', deckId: id });
    }));
};
