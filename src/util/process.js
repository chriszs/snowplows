var fs = require('fs'),
    tsv = require('tsv'),
    queue = require('queue-async');

var fileName = '',
    callback = null;

function truckCallback(data) {
    var trucks = [];

    data.Trucks.forEach(function (d) {
        trucks.push({
            id: parseInt(d.TruckId),
            lat: parseFloat(d.Latitude),
            long: parseFloat(d.Longitude),
            plowDown: (d.PlowDown == 'True'),
            heading: parseInt(d.Heading),
            speed: parseInt(d.Speed),
            accuracy: parseInt(d.Accuracy)
        });
    });

    fs.writeFile('../data/' + fileName.replace('.json','.tsv'),tsv.stringify(trucks),function () {
        callback(null,fileName);
    });
}

function fileLoaded(err,contents) {
    eval(contents.toString()); // why eval? because these aren't really JSON files
}

function loadFile(name,cb) {
    fileName = name;
    callback = cb;

    fs.readFile('../data/orig/' + fileName,fileLoaded);
}

function init () {
    var q = queue(1);

    fs.readdir('../data/orig',function (err,files) {
        files.forEach(function (name) {
            if (name !== '.DS_Store') {
                q.defer(loadFile,name);
            }
        });
    });

    q.awaitAll(function () {
        console.log('all done');
    });

}

init();