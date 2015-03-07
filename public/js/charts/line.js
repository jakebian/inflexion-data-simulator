angular.module('chart.line', [])
.directive('lineChart', [function () {
    return {
        scope: {
            data: '='
        },
        link: link
    }

    function link(scope, elem) {
        scope.$watch(function() {return scope.data.length}, updateChart);
        var width = elem.width();
        var height = 500;
        var svg = d3.select(elem[0]).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")

        function updateChart() {
            svg.text('')
            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .x(function(d) { return x(d.createdAt); })
                .y(function(d) { return y(d.ax); })
                .interpolate('basis');
            var data = scope.data.slice(Math.max(scope.data.length - 50))
                x.domain(d3.extent(data, function(d) { return d.createdAt; }));
                y.domain(d3.extent(data, function(d) { return d.ax; }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("x-acceleration");

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);
        }
    }
}]);