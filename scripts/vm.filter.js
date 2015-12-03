(function(vm) {

    vm.Filter = function(options) {
        this.selector = options.selector;
        this.const = options.const;
        this.overlayRedrawCallback = options.overlayRedrawCallback;

        this.filterBlock = document.querySelector(this.selector.filterBlock)
    };

    vm.Filter.prototype.init = function(data) {
        var self = this;

        self.data = data;

        var svg = d3.select(self.filterBlock).append("svg")
            .attr("class", "filter__svg");

        var width = svg.node().getBoundingClientRect().width - self.const.padding * 2 - self.const.border * 2;
        var height = svg.node().getBoundingClientRect().height - self.const.border * 2;

        var minDate = d3.min(self.data, function(d) { return d.key; });
        var maxDate = d3.max(self.data, function(d) { return d.key; });

        var maxCount = d3.max(self.data, function(d) { return d.count; });

        var xScale = d3.scale.linear()
            .domain([minDate, maxDate])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([0, maxCount])
            .range([height / 2, 0]);

        /* areas */

        var falseData = d3.svg.area()
            .interpolate("basis")
            .x(function(d) { return xScale(d.key); })
            .y0(height / 2)
            .y1(function(d) { return yScale(d.falseValuesCount); });

        var trueData = d3.svg.area()
            .interpolate("basis")
            .x(function(d) { return xScale(d.key); })
            .y0(height / 2 + self.const.delimiterWidth)
            .y1(function(d) { return height + self.const.delimiterWidth - yScale(d.trueValuesCount); });

        var areasGroup = svg.append("g");

        areasGroup.append("path")
            .attr({
                class: "data_false",
                d: falseData(self.data)
            });
            
        var filterLine = 5;

        areasGroup.append("path")
            .attr({
                class: "filter_line",
                d: "M-" + filterLine + " " + (height + self.const.delimiterWidth) / 2 + " H" + (width + filterLine)
            });

        areasGroup.append("path")
            .attr({
                class: "data_true",
                d: trueData(self.data)
            });

        /* areas */

        var brush = d3.svg.brush()
            .x(xScale)
            .extent(xScale.domain())
            .on("brush", update);

        var brushGroup = svg.append("g")
            .attr("class", "filter__brush")
            .call(brush);

        brushGroup.append("rect")
            .attr({
                class: "filter__extent-cap filter__extent-cap_left",
                x: xScale(minDate) - self.const.padding,
            });

        brushGroup.append("rect")
            .attr({
                class: "filter__extent-cap filter__extent-cap_right",
                x: xScale(maxDate),
            });

        brushGroup.selectAll("rect")
            .attr({
                height: height
            });

        brushGroup.selectAll("[class*=filter__extent-cap]")
            .attr({
                width: self.const.padding
            });

        brushGroup.append("text")
            .attr({
                class: "filter__text_count_false",
                y: height * 0.25,
            })
            .text(self.data.reduce(function(sum, current) { return sum + current.falseValuesCount; }, 0));

        brushGroup.append("text")
            .attr({
                class: "filter__text_count_true",
                y: height * 0.75,
            })
            .text(self.data.reduce(function(sum, current) { return sum + current.trueValuesCount; }, 0));

        brushGroup.selectAll("[class*=filter__text_count]")
            .classed("filter__text filter__text_count", true)
            .attr({
                x: xMove(),
                dx: function() { return -this.textContent.length / 4 + "em"; },
                dy: self.const.font + "em"
            });

        brushGroup.append("text")
            .text(brushExtentToText(brush.extent()[0]))
            .attr({
                class: "filter__text_limit_left",
                x: xScale(brush.extent()[0]),
                dx: function() { return -this.textContent.length / 2 + "em" },
            });

        var rigthLimitText = 4;

        brushGroup.append("text")
            .text(brushExtentToText(brush.extent()[1]))
            .attr({
                class: "filter__text_limit_right",
                x: xScale(brush.extent()[1]) + rigthLimitText
            });

        brushGroup.selectAll("[class*=filter__text_limit]")
            .classed("filter__text filter__text_limit", true)
            .attr({
                y: height,
                dy: -self.const.font * 1.5 + "em"
            });

        function update() {
            var brushExtent = brush.extent();

            var from = brushExtent[0];
            var to = brushExtent[1];

            var falseValuesCount = 0;
            var trueValuesCount = 0;

            var newData = from != to
                ? self.data
                    .filter(function(e) { return from <= e.key && e.key <= to })
                    .reduce(function(result, current) {
                        falseValuesCount += current.falseValuesCount;
                        trueValuesCount += current.trueValuesCount;
                        current.falseValues
                            .concat(current.trueValues)
                            .forEach(function(e) { result.push(e); });
                        return result;
                    }, [])
                : [];

            brushGroup.selectAll("[class*=filter__text_count_false]")
                .text(falseValuesCount);
            brushGroup.selectAll("[class*=filter__text_count_true]")
                .text(trueValuesCount);

            brushGroup.selectAll("[class*=filter__text_count]")
                .attr({
                    x: xMove()
                });

            brushGroup.selectAll("[class*=filter__text_limit_left]")
                .text(brushExtentToText(from))
                .attr({
                    x: xScale(from),
                    dx: function() { return -this.textContent.length / 2 + "em" },
                });

            brushGroup.selectAll("[class*=filter__text_limit_right]")
                .text(brushExtentToText(to))
                .attr({
                    x: xScale(to) + rigthLimitText
                });

            brushGroup.selectAll("[class*=filter__text_count]")
                .attr({
                    dx: function() { return -this.textContent.length / 4 + "em"; }
                })

            brushGroup.selectAll("[class*=filter__extent-cap_left]")
                .attr({
                    width: xScale(brush.extent()[0]) + self.const.padding
                });

            brushGroup.selectAll("[class*=filter__extent-cap_right]")
                .attr({
                    x: xScale(brush.extent()[1]),
                    width: xScale(maxDate) - xScale(brush.extent()[1]) + self.const.padding
                });

            self.overlayRedrawCallback(newData);
        };

        function xMove() {
            return xScale(brush.extent()[0]) + (xScale(brush.extent()[1]) - xScale(brush.extent()[0])) / 2;
        };

        function brushExtentToText(extent) {
            var date = new Date(extent);
            return date.getDate() + " " + self.const.months[date.getMonth()] + " " + date.getFullYear();
        };
    };

})(window.app.vm);
