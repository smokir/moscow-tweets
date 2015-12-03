(function (vm) {

    vm.Data = function (options) {
        var path = options.path;
        var delimiter = options.delimiter;

        var overlayInitCallback = options.overlayInitCallback;
        var filterInitCallback = options.filterInitCallback;

        var dsv = d3.dsv(delimiter, "text/plain");

        dsv(path, function (csv) {
            var data = csv;

            data.forEach(function (e) {
                var year = e.date.match(/\d{4}/g)[0];
                var month = e.date.match(/\.\d{2}\./g)[0].replace(/\./g, "");
                var day = e.date.match(/^\d{2}\./g)[0].replace(/\./g, "");

                var date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

                e.dateMs = date.getTime();
                e.gLatLng = new google.maps.LatLng(e.lat, e.lng);
            });

            overlayInitCallback(data);

            var nest = d3.nest()
                .key(function (d) { return d.dateMs; })
                .key(function (d) { return d.characteristic; })
                .entries(data);

            nest.forEach(function (d) {
                var falseValues = d.values.filter(function (e) { return e.key == "0"; }) || [];
                d.falseValues = falseValues[0] ? falseValues[0].values : [];
                d.falseValuesCount = falseValues[0] ? falseValues[0].values.length : 0;

                var trueValues = d.values.filter(function (e) { return e.key == "1"; }) || [];
                d.trueValues = trueValues[0] ? trueValues[0].values : [];
                d.trueValuesCount = trueValues[0] ? trueValues[0].values.length : 0;

                d.count = d.falseValuesCount + d.trueValuesCount;
            });

            filterInitCallback(nest);
        });
    };

})(window.app.vm);
