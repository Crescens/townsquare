const winston = require('winston');
require('winston-daily-rotate-file');

let rotate = new (winston.transports.DailyRotateFile)({
    filename: __dirname + '/logs/throneteki',
    datePattern: '-yyyy-MM-dd.log',
    timestamp: true,
    json: false,
    zippedArchive: true
});

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({ json: false, timestamp: true }),
<<<<<<< HEAD
        new winston.transports.File({ filename: __dirname + '/logs/townsquare.log', json: false, timestamp: true })
=======
        rotate
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    ]
});

module.exports = logger;
