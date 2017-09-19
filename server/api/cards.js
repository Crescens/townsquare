const config = require('../config.js');
const CardService = require('../repositories/cardService.js');

var cardService = new CardService({ dbPath: config.dbPath });

module.exports.init = function(server) {
    server.get('/api/cards', function(req, res, next) {
        cardService.getAllCards({ shortForm: true })
            .then(cards => {
                res.send({ success: true, cards: cards });
            })
            .catch(err => {
                return next(err);
            });
    });

    server.get('/api/packs', function(req, res, next) {
        cardService.getAllPacks()
            .then(packs => {
                res.send({ success: true, packs: packs });
            })
            .catch(err => {
                return next(err);
            });
    });

    server.get('/api/outfit', function(req, res) {
        cardService.getAllCards({ shortForm: true, type_code: 'outfit'})
            .then(cards => {
                res.send({ success: true, cards: cards });
            })
            .catch(err => {
                return next(err);
            });
    });

    server.get('/api/legend', function(req, res) {
        cardService.getAllCards({ shortForm: true, type_code: 'legend'})
            .then(cards => {
                res.send({ success: true, cards: cards });
            })
            .catch(err => {
                return next(err);
            });
    });
};
