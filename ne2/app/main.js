$(document).ready(function() {
    var fullyQualifiedUrl = function(url) {
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    };

    $('#replicate').on('click', function() {
        var staticCouch = fullyQualifiedUrl('../tiles');
        console.log('About to start replication');
        PouchDB.replicate(staticCouch, 'tiles', function(err, changes) {
            if (err) {
                console.log('error', err);
                return;
            }
            console.log('replication', changes);
        });
    });

    $('#delete-database').on('click', function() {
        PouchDB.destroy('tiles', function(err, info) {
            if (err) {
                console.log('database destroy error', err);
                return;
            }
            console.log('deleted "tiles" database', info);
        });
    });

    $('#all-docs').on('click', function() {
        var tiles = new PouchDB('tiles');
        tiles.allDocs(function(err, res) {
            if (err) {
                console.log('all docs error', err);
                return;
            }
            console.log('all docs:', res);
        });
    });
});


new ol.Map({
    layers: [
        new ol.layer.TileLayer({
            source: new ol.source.XYZ({
                maxZoom: 22,
                minZoom: 0,
                tileUrlFunction: function(tileCoord, projection) {
                    if (tileCoord === null) {
                        return undefined;
                    }
                    var pouch = new PouchDB('tiles');
                    var stringCoord = [tileCoord.z, tileCoord.y, tileCoord.x]
                        .join('-');

                    return function(cb) {
                        pouch.getAttachment(
                                stringCoord, 'tile.png', function(err, res) {
                            if (err && err.error == 'not_found') {
                                return;
                            }
                            var url = window.URL.createObjectURL(res);
                            cb(url);
                        });
                    };
                }
            })
        })
    ],
    //renderer: ol.RendererHint.CANVAS,
    //renderer: ol.RendererHint.DOM,
    //renderer: ol.RendererHint.WEBGL,
    target: 'map',
    view: new ol.View2D({
        center: [0, 0],
        zoom: 2
    })
});
