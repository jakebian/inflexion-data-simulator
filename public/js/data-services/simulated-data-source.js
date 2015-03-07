angular.module('simulated-data-source', [])
.service('DataSource', [
             '$http','$rootScope','$timeout',
    function ($http , $rootScope , $timeout) {
        var State = {};

        return {
            initSimulation: initSimulation,
        };

        function initSimulation(config) {
            State = {
                collection : {},
                source : {},
                sourceKeys : [],
                currentKeyIndex : config.start,
            };

            fetchData().then(function (result) {
                console.log('fetched data');
                State.source = result.data.data;
                State.sourceKeys = Object.keys(State.source);
                startSimulation(config);
            });
        }

        function startSimulation(config) {

            function delayedUpdate() {
                $timeout(function () {
                    stepCollection();
                    if (State.currentKeyIndex < config.start + config.steps) {
                        delayedUpdate();
                    }
                }, config.delay);
            }

            delayedUpdate();
        }

        function fetchData() {
            return $http.get('/data/data.json');
        }

        function stepCollection() {
            var sourceKey = State.sourceKeys[State.currentKeyIndex];
            updateCollection(sourceKey);
            State.currentKeyIndex++;
            $rootScope.$broadcast('dataUpdate',State.source[sourceKey], State.collection);
        }

        function updateCollection(key) {
            State.collection[key] = State.source[key];
        }

    }
]);