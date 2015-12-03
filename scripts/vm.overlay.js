(function (vm) {

    vm.Overlay = function (options) {
        this.map = options.map;
        this.const = options.const;

        this.dotsOverlay = new google.maps.OverlayView();
    };

    vm.Overlay.prototype.init = function (data) {
        var self = this;

        self.data = data;

        self.dotsOverlay.onAdd = function () {
            self.svg = d3.select(this.getPanes().overlayLayer)
                .append("svg")
                .attr({
                    "class": "map__overlay"
                });
        };

        self.dotsOverlay.draw = function () {
            var projection = this.getProjection();

            self.svg.selectAll("circle")
                .remove();

            self.svg.selectAll("circle")
                .data(self.data)
                .each(update)
                .enter()
                .append("circle")
                .each(update)
                .attr({
                    "class": function (d) { return d.characteristic == "0" ? "data_false" : "data_true"; }
                });

            function update(d) {
                return d3.select(this).attr({
                    "cx": function (d) { return projection.fromLatLngToDivPixel(d.gLatLng).x + self.const.cssShift; },
                    "cy": function (d) { return projection.fromLatLngToDivPixel(d.gLatLng).y + self.const.cssShift; },
                    "r": function (d) { return self.map.getZoom() / self.const.circleZoom; }
                });
            }
        };

        self.dotsOverlay.setMap(self.map);
    };

    vm.Overlay.prototype.redraw = function (newData) {
        this.data = newData;
        this.dotsOverlay.draw();
    };

})(window.app.vm);
