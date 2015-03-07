(function () {

//Angular machinery

angular.module('algorithms.erg-stats', [])
.service('ErgStats', function () {
    
    /**
     * Define local variables here
     */

    var engaged = 0;
    var ergReps = 0;
    var bikeReps = 0;
    var startTime;
    var endTime;
    var lastTime = 0;
    var repRate = 0;
    var totTime = 0;
    var Aax = [];
    var Aay = [];
    var Aaz = [];
    var Agx = [];
    var Agy = [];
    var Agz = [];
    var Distance = 0;
    var Split = 0;


    /**
     * Any other initializations should be done here (before the return)
     */


    /**
     * this exposes the update and getData functions, don't change.
     */
    return {
        update: update,
        getData: getData
    }


    /**
     * Define local functions below
     */


    function getData() {
        return {
            ergReps: ergReps,
            bikeReps: bikeReps,
            repRate: repRate,
            totTime: totTime,
            Distance: Distance
        }
    }

    function update(result){
        Aax.push(result.ax);
        Aay.push(result.ay);
        Aaz.push(result.az);
        Agx.push(result.gx);
        Agy.push(result.gy);
        Agz.push(result.gz);

        if (Aax.length > 10){
            Aax.shift();
            Aay.shift();
            Aaz.shift();

            Agx.shift();
            Agy.shift();
            Agz.shift();
            device = result.device;

            var mAax = average(Aax);
            var mAay = average(Aay);
            var mAaz = average(Aaz);

            var mAgx = average(Agx);
            var mAgy = average(Agy);
            var mAgz = average(Agz);

            var sAax = standardDeviation(Aax);
            var sAay = standardDeviation(Aay);
            var sAaz = standardDeviation(Aaz);

            var sAgx = standardDeviation(Agx);
            var sAgy = standardDeviation(Agy);
            var sAgz = standardDeviation(Agz);

            if (engaged == 0 && Math.abs(mAax) < 0.1 && sAax > 0.15 && sAax > 2*mAax && (Aax[Aax.length-1]-mAax)/sAax > 0.5){
                engaged = 1;
                startTime = result.createdAt;
                if (lastTime > 0){
                    totTime = totTime + (startTime - lastTime)/1000;
                    if (startTime - lastTime > 50) {
                        repRate = 60000/(startTime - lastTime);
                    }
                }
                lastTime = startTime;
            }
            
            if (engaged == 1 && (Aax[Aax.length-1]-mAax)/sAax < 0){
                engaged = 0;
                if (device == 0){
                    ergReps = ergReps + 1;
                }
                else if (device == 1){
                    bikeReps = bikeReps + 1;
                }
            }

            Distance = 10*ergReps;
            Split = (totTime*500)/(Distance*Distance);
            repRate = ergReps*60/totTime;
        }
    }

    function standardDeviation(values){
        var avg = average(values);

        var squareDiffs = values.map(function(value){
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });

        var avgSquareDiff = average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }

    function average(data){
        var sum = data.reduce(function(sum, value){
            return sum + value;
        }, 0);

        var avg = sum / data.length;
        return avg;
    }
});

})();