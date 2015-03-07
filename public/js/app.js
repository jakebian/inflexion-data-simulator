angular.module('sandbox', 
    [
        'simulated-data-source',
        'algorithms',
        'charts'
    ]
)

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
                start: 31800,
                delay: 30,
                steps: 2000
            });

            scope.$on('dataUpdate', function (evt, newEntry, fullDataSet) {
                insertEntry(newEntry);
                updateErgStats(newEntry);
                scope.$digest();
            });

            function insertEntry(newEntry) {
                scope.data.push(newEntry);
                scope.data = scope.data.slice(scope.data.length - 50);
            }
            function updateErgStats(newEntry) {
                ErgStats.update(newEntry);
                scope.ergStats = ErgStats.getData();
            }

        }
    }
]);