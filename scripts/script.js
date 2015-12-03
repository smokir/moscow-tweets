(function () {

    var map = new app.vm.Map({
        selector: {
            mapBlock: "[id=js-map]"
        }
    });

    var overlay = new app.vm.Overlay({
        map: map.map,
        const: {
            cssShift: 4000,
            circleZoom: 3
        }
    });

    var filter = new app.vm.Filter({
        selector: {
            filterBlock: "[id=js-filter]"
        },
        const: {
            padding: 90,
            border: 1,
            delimiterWidth: 3,
            font: 0.6,
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        overlayRedrawCallback: overlay.redraw.bind(overlay)
    });

    var data = new app.vm.Data({
        path: "data.csv",
        delimiter: ";",
        overlayInitCallback: overlay.init.bind(overlay),
        filterInitCallback: filter.init.bind(filter)
    });

})();
