angular.module('sandbox', ['simulated-data-source', 'algorithms'])
.directive('sandbox', 
            ['DataSource', 'ErgStats',
    function (DataSource, ErgStats) {

        return {
            scope: {},
            link: link,
            templateUrl: '/partials/sandbox.html'
        }

        function link(scope, elem) {
            scope.data = [];
            DataSource.initSimulation({
                delay: 10,
                steps: 2000
            });

            scope.$on('dataUpdate', function (evt, newEntry, fullDataSet) {
                scope.data.push(newEntry);
                updateErgStats(newEntry);
                scope.$digest();
            });

            function updateErgStats(newEntry) {
                ErgStats.update(newEntry);
                scope.ergStats = ErgStats.getData();
            }

        }
    }
]);