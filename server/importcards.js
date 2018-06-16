/*eslint no-console:0 */
const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/townsquare');
const fs = require('fs');

let totalCards = JSON.parse(fs.readFileSync('./dtr-cards.json'));

db.collection('cards').remove({}, function() {
    db.collection('cards').insert(totalCards, function() {
        db.close();
    });
});
