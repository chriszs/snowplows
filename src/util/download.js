var http = require('http'),
    fs = require('fs'),
    parseString = require('xml2js').parseString,
    queue = require('queue-async');

function loadFile(name,cb) {
    if (!fs.existsSync('../data/orig/' + name)) {
        console.log(name + ' started');

        var file = fs.createWriteStream('../data/orig/' + name);
        var request = http.get('http://vdot-plows.s3.amazonaws.com/' + name, function(response) {
            response.pipe(file);

            console.log(name + ' completed');

            cb(null,name);
        });
    }
    else {
        console.log('skipping ' + name);

        cb(null,name);
    }
}

function listLoaded(err,xml) {
    var q = queue(1);

    console.log(xml.toString());

    parseString(xml, function (err, result) {
        var contents = result.ListBucketResult.Contents;
        contents.forEach(function (d) {
            q.defer(loadFile,d.Key[0]);
        });
    });

    q.awaitAll(function (err,files) {
        console.log('all done');
    });
}

function init() {
    fs.readFile('../data/list.xml',listLoaded);
}

init();