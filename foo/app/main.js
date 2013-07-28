$(document).ready(function() {
    var fullyQualifiedUrl = function(url) {
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    };

    $('#replicate').on('click', function() {
        var staticCouch = fullyQualifiedUrl('../data');
        console.log('About to start replication');
        PouchDB.replicate(staticCouch, 'tinydata', function(err, changes) {
            if (err) {
                console.log('error', err);
                return;
            }
            console.log('replication', changes);
        });
    });

    $('#delete-database').on('click', function() {
        PouchDB.destroy('tinydata', function(err, info) {
            if (err) {
                console.log('database destroy error', err);
                return;
            }
            console.log('deleted "tinydata" database', info);
        });
    });

    $('#all-docs').on('click', function() {
        var tiles = new PouchDB('tinydata');
        tiles.allDocs(function(err, res) {
            if (err) {
                console.log('all docs error', err);
                return;
            }
            console.log('all docs:', res);
        });
    });
});
