/*eslint no-console:0 */
const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/townsquare');
const fs = require('fs');
const _ = require('underscore');

let packs = JSON.parse(fs.readFileSync('./dtr-packs.json'));
let totalCards = JSON.parse(fs.readFileSync('./dtr-cards.json'));

db.collection('packs').remove({}, function() {
    db.collection('packs').insert(packs);
});

db.collection('cards').remove({}, function() {
    db.collection('cards').insert(totalCards, function() {
        db.close();
    });
});
