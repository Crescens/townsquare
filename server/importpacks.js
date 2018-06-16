/*eslint no-console:0 */
const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/townsquare');
const fs = require('fs');

let packs = JSON.parse(fs.readFileSync('./dtr-packs.json'));

db.collection('packs').remove({}, function() {
    db.collection('packs').insert(packs, function() {
        db.close();
    });
});
