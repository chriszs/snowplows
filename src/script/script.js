(function () {

    var width = 1000,
        height = 1000;

    var container, svg;

    var files, fileIndex = 0;

    var labels = [
        {
            name: 'Richmond',
            long: -77.436048,
            lat: 37.540725
        },
        {
            name: 'Washington',
            long: -77.036464,
            lat: 38.907231
        },
        {
            name: 'Fredericksburg',
            long: -77.46054,
            lat: 38.303184
        },
        {
            name: 'Staunton',
            long: -79.071696,
            lat: 38.149576
        },
    ];

    var truckLookup = {},
        truckList = [];

    var projection = d3.geo.albers()
        .rotate([96, 0])
        .center([18, 38.2])
        .parallels([29.5, 45.5])
        .scale(24070)
        .translate([width / 2, height / 2])
        .precision(0.1);

    var path = d3.geo.path()
        .projection(projection);

    var line = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate('linear');

    function dataLoaded(err,data) {
        // var trucks = data.Trucks;
        var trucks = data;

        trucks.forEach(function (d) {

            var coords = projection([d.long,d.lat]);

            d.x = coords[0];
            d.y = coords[1];

            if (d.plowDown === 'true') {
                if (!(d.id in truckLookup)) {
                    truckLookup[d.id] = [];
                    truckList.unshift(truckLookup[d.id]);
                }

                truckLookup[d.id].push({
                    id: d.id,
                    x: d.x,
                    y: d.y
                });
            }
        });

        var truck = svg.selectAll('.truck')
                        .data(trucks,function (d) {
                            return d.id;
                        });

        var newTruck = truck.enter()
                            .append('circle')
                                .attr('class','truck')
                                    .attr('r',2);

        truck.exit().remove();

        truck
            .transition()
                .duration(250)
                .attr('cx',function (d) {
                    return d.x;
                })
                .attr('cy',function (d) {
                    return d.y;
                });

        if (fileIndex % 5 === 0) {

            var truckTrail = svg.selectAll('.truckTrail')
                                .data(truckList,function (d) {
                                    return d[0].id;
                                });

            truckTrail.enter()
                        .append('path')
                        .attr('class','truckTrail');

            truckTrail
                .attr('d',function (d) {
                    return line(d.slice(0,100));
                });
        }
    }
/*
    function loadFile(file) {
        container.append('script')
                    .attr('src','http://vdot-plows.s3.amazonaws.com/' + file)
                    .attr('text/javascript');

        window.truckCallback = function (data) {
            dataLoaded(null,data);
        };
    }*/

    function nextFile() {
        if (fileIndex < files.length) {
            // loadFile(files[fileIndex]);
            d3.tsv('data/' + files[fileIndex].replace('.json','.tsv'),dataLoaded);

            fileIndex++;
        }
    }

    function drawLabels () {
        labels.forEach(function (d) {
            var coords = projection([d.long,d.lat]);

            d.x = coords[0];
            d.y = coords[1];
        });

        svg.selectAll('.label')
                .data(labels)
                .enter()
                    .append('text')
                        .attr('class','label')
                        .attr('x',function (d) {
                            return d.x;
                        })
                        .attr('y',function (d) {
                            return d.y;
                        })
                        .text(function (d) {
                            return d.name;
                        });
    }

    function listLoaded(err,list) {
        var nodes = list.childNodes[0].childNodes;

        files = [];

        for (i=0; i < nodes.length; i++) {
            if (nodes[i].nodeName == 'Contents') {
                var nodes2 = nodes[i].childNodes;
                for (i2=0; i2 < nodes2.length; i2++) {
                    if (nodes2[i2].nodeName == 'Key') {
                        files.push(nodes2[i2].innerHTML);
                    }
                }
            }
        }

        files = files.reverse();

        setInterval(nextFile,250);
    }

    function init() {
        container = d3.select('.vdotPlows');

        svg = container
                .append('svg')
                    .attr('width', width)
                    .attr('height', height);

        drawLabels();

        d3.xml('data/list.xml',listLoaded);
    }

    init();

})();