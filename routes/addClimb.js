var moment = require('moment');
var _ = require('lodash');
var d = require('debug')('climbonio');

var args = process.argv.slice(2);
console.log('args: ' + args);

var weightClimbRating = {
    '04': 2,
    '06': 3,
    '07': 4,
    '08': 5,
    '09': 6,
    '10a': 8,
    '10b': 10,
    '10c': 12,
    '10d': 15,
    '11a': 16,
    '11b': 18,
    '11c': 20,
    '11d': 22,
    '12a': 24,
    '12b': 26,
    '12c': 28,
    '12d': 30
};

var weightBoulderRating = {
    'v0': 2,
    'v1': 4,
    'v2': 8,
    'v3': 12,
    'v4': 15,
    'v5': 20
};

var weightClimbType = {
    'tri': 1,
    'tric': 1,
    'sli': 2,
    'slic': 2,
    'tro': 2,
    'tlo': 6,
    'tfo': 3,
    'slo': 6,
    'sfo': 3, 
    'fso': 6
};


var profile = {
    defaultClimber: 'sc',
    defaultLocation: 'pgb',
    defaultIndoorOrOutdoor: 'i',
    defaultClimbType: 'tr'
};

var climber = profile.defaultClimber;
var location = profile.defaultLocation;
var indoorOrOutdoor = profile.defaultIndoorOrOutdoor;
var defaultClimbType = profile.defaultClimbType;

console.log('climber: ' + climber);
console.log('location: ' + location);
console.log('indoorOrOutdoor: ' + indoorOrOutdoor);
console.log('defaultClimbType: ' + defaultClimbType);



// Parse date
var date = moment(args[0], 'MM-DD-YYYY');
if (date.isValid() === false) {
    console.error('Error: Invalid date found: ' + args[0]);
    process.exit(1);
}
date = date.format('YYYY-MM-DD');
console.log('date: ' + date);



var workouts = {};
var inSummary = false;
var summary = '';
_.each(args.slice(1), function(token) {

    console.log('\ntoken: ' + token);

    if (inSummary) {
        summary += token + ' ';
        return;
    }

    switch (token) {
        
    case '--':
        inSummary = true;
        return;

    case 'sc':
    case 'cl':
        climber = token;
        console.log('climber: ' + climber);
        return;

    case 's':
    case 'sl':
        defaultClimbType = 'sl';
        console.log('defaultClimbType: ' + defaultClimbType);
        return;
    case 'tr':
        defaultClimbType = 'tr';
        console.log('defaultClimbType: ' + defaultClimbType);
        return;

    case 'i':
        indoorOrOutdoor = 'i';
        console.log('indoorOrOutdoor: ' + indoorOrOutdoor);
        return;
    case 'o':
        indoorOrOutdoor = 'o';
        console.log('indoorOrOutdoor: ' + indoorOrOutdoor);
        return;

    case 'pgb':
    case 'pgsf':
    case 'pgsv':
        location = token;
        console.log('location: ' + location);
        return;

    case 'donner':
    case 'yv':
    case 'tuo':
    case 'tahoe':
        location = token;
        console.log('location: ' + location);
        indoorOrOutdoor = 'o';
        console.log('indoorOrOutdoor: ' + indoorOrOutdoor);
        return;
    }



    // Normalize the climb rating (for sorting, etc)
    // a -> 10a, b -> 10b, c -> 10c, d -> 10d
    // 5.4 -> '04 ', 5.5 -> '05 ', ..., 5.9 -> '09 '
    // 4 -> '04 ', 5 -> '05 ', ..., 9 -> '09 '
    // v0 -> 'v0 ', v1 -> 'v1 ', ..., v5 -> 'v5 '
    if ((token.indexOf('a') === 0) ||
        (token.indexOf('b') === 0) ||
        (token.indexOf('c') === 0) ||
        (token.indexOf('d') === 0))  {
        token = '10' + token;
    } else if ((token.indexOf('5.4') === 0) ||
               (token.indexOf('5.5') === 0) ||
               (token.indexOf('5.6') === 0) ||
               (token.indexOf('5.7') === 0) ||
               (token.indexOf('5.8') === 0) ||
               (token.indexOf('5.9') === 0))  {
        token = '0' + token.slice(2);
        token = insert(token, 2, ' ');
    } else if ((token.indexOf('4') === 0) ||
               (token.indexOf('5') === 0) ||
               (token.indexOf('6') === 0) ||
               (token.indexOf('7') === 0) ||
               (token.indexOf('8') === 0) ||
               (token.indexOf('9') === 0))  {
        token = '0' + token;
        token = insert(token, 2, ' ');
    } else if ((token.indexOf('v0') === 0) ||
               (token.indexOf('v1') === 0) ||
               (token.indexOf('v2') === 0) ||
               (token.indexOf('v3') === 0) ||
               (token.indexOf('v4') === 0) ||
               (token.indexOf('v5') === 0))  {
        token = insert(token, 2, ' ');
    }
    


    // Handle 10ax2, 10ax2.5, 10ax.5, 
    // Given 10x2.5
    // - multiplier: 2
    // - fraction: .5
    var multiplier = '1';
    var fraction = null;
    var indexOfX = token.indexOf('x');
    if (indexOfX > -1) {
        var climb = token.substring(0, indexOfX);
        multiplier = token.substring(indexOfX + 1);
        var indexOfDot = multiplier.indexOf('.');
        if (indexOfDot > -1) {
            fraction = multiplier.substring(indexOfDot);
            multiplier = multiplier.substring(0, indexOfDot);
            console.log('climb: ' + climb);
            console.log('multiplier: ' + multiplier);
            console.log('fraction: ' + fraction);
        }
        else {
            console.log('climb: ' + climb);
            console.log('multiplier: ' + multiplier);
        }
        token = climb;
    }
    else {
        var indexOfDot = token.indexOf('.');
        if (indexOfDot > -1) {
            var climb = token.substring(0, indexOfDot);
            multiplier = '0';
            fraction = token.substring(indexOfDot);
            console.log('climb: ' + climb);
            // console.log('multiplier: ' + multiplier);
            console.log('fraction: ' + fraction);
            token = climb;
        }
    }
    
    var rating = token.slice(0, 3);
    switch (rating) {
    case '04 ':
    case '05 ':
    case '06 ':
    case '07 ':
    case '08 ':
    case '09 ':
    case '10a':
    case '10b':
    case '10c':
    case '10d':
    case '11a':
    case '11b':
    case '11c':
    case '11d':
    case '12a':
    case '12b':
    case '12c':
    case '12d':

        // Find and/or set climb metadata
        // - climbType: tr, sl, sfo, tl, tf, fs
        // - indoorOrOutdoor: 'i', 'o'
        // - crack: '', 'c'
        var climbType = defaultClimbType;
        var crack = '';

        // Split the rating from the metadata
        var metadata = token.slice(3, token.length);

        switch (metadata) {
        case '':
            break;
        case 'c':
            crack = 'c';
            break;
        case 'tr':
            climbType = 'tr';
            break;
        case 'trc':
            climbType = 'tr';
            crack = 'c';
            break;
        case 's':
        case 'sl':
            climbType = 'sl';
            break;
        case 'sc':
        case 'slc':
            climbType = 'sl';
            crack = 'c';
            break;
        case 'sf':
            climbType = 'sf';
            break;
        case 'tl':
            climbType = 'tl';
            break;
        case 'tf':
            climbType = 'tf';
            break;
        case 'fs':
            climbType = 'fs';
            break;
        default:
            console.error('Error: Unknown metadata for the climb: ' + metadata);
            process.exit(1);
        }

        console.log(rating + ' ' + climbType + indoorOrOutdoor + crack);

        switch (indoorOrOutdoor) {
        case 'i':
            switch (climbType) {
            case 'tr':
            case 'sl':
                // Valid types (tr & sl)
                break;
            default:
                console.error('Error: Indoor climb types must be either tr or sl (climbType: ' + climbType + ').');
                process.exit(1);
            }
            break;
        case 'o':
            if (crack === 'c') {
                console.error('Error: Outdoor climb types must not be annotated as cracks.');
                process.exit(1);
            }
            break;
        }


        // Lazily create the climber session if one doesn't already exist
        if (workouts[climber] === undefined) {
            workouts[climber] = {};
            workouts[climber].climber = climber;
            workouts[climber].date = '';
            workouts[climber].location = '';
            workouts[climber].summary = '';
        }

        // Lazily create climbs for the climber's session if none exixts
        if (workouts[climber].climbs === undefined) {
            workouts[climber].climbs = {};
        }

        for (i = 0; i < multiplier; i++) {
            if (workouts[climber].climbs[rating + ' ' + climbType + indoorOrOutdoor + crack] === undefined) {
                workouts[climber].climbs[rating + ' ' + climbType + indoorOrOutdoor + crack] = 1;
            }
            else {
                workouts[climber].climbs[rating + ' ' + climbType + indoorOrOutdoor + crack]++;
            }
        }

        if (fraction) {
            if (workouts[climber].climbs[rating + ' ' + climbType + indoorOrOutdoor + crack] === undefined) {
                workouts[climber].climbs[rating + ' ' + climbType + indoorOrOutdoor + crack] = 0.5;
            }
            else {
                workouts[climber].climbs[rating + ' ' + climbType + indoorOrOutdoor + crack] += 0.5;
            }
        }
        break;
        
    case 'v0 ':
    case 'v1 ':
    case 'v2 ':
    case 'v3 ':
    case 'v4 ':
    case 'v5 ':

        // Lazily create the climber session if one doesn't already exist
        if (workouts[climber] === undefined) {
            workouts[climber] = {};
            workouts[climber].climber = climber;
            workouts[climber].date = '';
            workouts[climber].location = '';
            workouts[climber].summary = '';
        }

        // Lazily create boulders for the climber's session if none exixts
        if (workouts[climber].boulders === undefined) {
            workouts[climber].boulders = {};
        }

        for (i = 0; i < multiplier; i++) {
            if (workouts[climber].boulders[rating] === undefined) {
                workouts[climber].boulders[rating] = 1;
            }
            else {
                workouts[climber].boulders[rating]++;
            }
        }
        
        if (fraction) {
            workouts[climber].boulders[rating] += .5;
        }
        break;

    default:
        console.error('Error: Unknown value (' + token + ').');
        process.exit(1);
    }
});

// Add the date, location, and summary into each climber's climbing session,
// and sort the climbs based on rating
console.log('args: ' + args);
_.each(workouts, function(workout) {
    if (date) {
        workout.date = date;
    }
    if (location) {
        workout.location = location;
    }
    if (summary) {
        workout.summary = summary.trim();
    }

    if (workout.climbs) {
        var orderedClimbs = {};
        Object.keys(workout.climbs).sort().forEach(function(key) {
            orderedClimbs[key] = workout.climbs[key];
        });
        workout.climbs = orderedClimbs;
    }
    
    if (workout.boulders) {
        var orderedBoulders = {};
        Object.keys(workout.boulders).sort().forEach(function(key) {
            orderedBoulders[key] = workout.boulders[key];
        });
        workout.boulders = orderedBoulders;
    }

    console.log('Workout for ' + workout.climber + ': ' + JSON.stringify(workout, null, 4));
});

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

// Routes 2015
// node addClimb 3/7 yv goblet 5.6 cl first yv climb 5.1 unnamed crack swan slab; I climbed swan 5.8 tr
// node addClimb 1/1  9 9tr 9c 9trc 9s 9sl 9sc 9slc o 9 9tr 9s 9sl 9sf 9tl 9tf 9fs i 10c 10ctr 10cc 10ctrc 10cs 10csl 10csc 10cslc o 10c 10ctr 10cs 10csl 10csf 10ctl 10ctf 10cfs -- positive test
// node addClimb 11/1 pgb bx2
// node addClimb 10/7 pgb 8x2 d a
// node addClimb 9/13 pgb 11c 9 6 cl 6x3
// node addClimb 7/30 pgb
// node addClimb 7/20 pgb 11cx2 11bx2 ax2 9 -- Shyam
// node addClimb 7/19 pgb cl 4x2 sc 9 11c 11c 11c 11a 8 9 11b
// node addClimb 7/17 pgb d a b a 11c 11a
// node addClimb 7/7 pgb 11c 11c 8 b 11bx3 b
// node addClimb 7/5 pgb 7 8 9 8 9 7 6 6 8 6 7 8 9 7 8 9 4 8 9 7 9 8 7 7 9 9 8 8 9 9 6 cl 4x2 -- 'climbed everything > 4< a'
// node addClimb 6/30 pgb 11d dx3.5 v2 -- My very first 11d clean
// node addClimb 6/28 pgb 11bx3 d c 8 9 11a 11b a.5 d
// node addClimb 6/25 pgb v0 11d 11a 12a 11a 11b 11b 11c 11b
// node addClimb 6/23 pgb d.5 d 7 b 8 11b 8 d
// node addClimb 6/21 pgb 11d 11a 11b 11b 11a 11b 11a 11b 11c 12a b
// node addClimb 6/18 pgb 11b a 8 9 7 b 11d b 11a c a
// node addClimb 6/16 pgb 11bx2 b 8 9 d 11b a
// node addClimb 6/11 pgb 11c 11a a 11d 11a a c 11b b
// node addClimb 6/1 pgb 11c 11a 11a 9 7 6 11b 12a 8
// node addClimb 5/31 donner o cl 4x2
// node addClimb 5/25 pgb d v2 11b d 11b 8 11c 8 c ax2 7 c -- Peter Weller joined
// node addClimb 5/23 pgb 11a 6 7 9 6 11a c 6 7 8 c b a 9 6 11b d b 7 cl 5.6x.5 5.6x.5 -- Caden quitting half way up still
// node addClimb 5/21 pgb 11cs 9s bs 12a 11a 11b a 8 9 c -- with Peter Weller
// node addClimb 5/19 pgb as 9s csx2 11cs bs 9sx2 8x2
// node addClimb 5/17 pgb 11cs 9s 12a 11c 11bx3 c b a c cl 6.5 7.5 4x7 -- 'cleaned 11cs lead; asea climbed with Caden'
// node addClimb 5/15 pgb -- sent from yahoo ipad
// node addClimb 5/11 pgb 9 c 9 b 11a c 11c d
// node addClimb 5/10 pgb 12a 11c 11a b 9s 11as cl 5.4x2 -- 11as onsite
// node addClimb 5/7 pgb 9s 11bs cs as 12a 11c bs 11b 11a 8
// node addClimb 5/5 pgb 9sx2 as ds 11ax2
// node addClimb 5/3 pgb 9s 11bs bs 8s as ds 9x2 a b c cl 5.4 -- lead fall on d
// node addClimb 4/30 pgb 9 b 12a.5 b cx2
// node addClimb 4/28 pgb v2x2 c b 11b.5 11a a b c 8 7 a 9
// node addClimb 4/26 pgb cl 4.5 7.5 sc d 7 11b c b 8 11a b 11a a -- Caden quitting halfway up but boulders
// node addClimb 4/24 pgb cl 6 4x2 sc 11a b d 11b c 8 b 11b 11b b 7 11b
// node addClimb 4/21 pgb a 9 11a 11b cx1.5 b b 11a 8 11a
// node addClimb 4/19 pgb cl 4x3 6 sc c a 7 11bx1.5 c c a d 9 8 11b
// node addClimb 4/17 pgb cl 5.6 4x2 sc 11ax3 11b c b 6 9 a bx2 v0 9c
// node addClimb 4/14 pgb ax2 b 11ax2 d 11a 11b d a c -- 75m
// node addClimb 4/13 -- 69m
// node addClimb 4/12 pgb a d 9 d b 11a 11bx2 a 8 6 d b cl 6 4x2
// node addClimb 4/11 -- first 10k+ day
// node addClimb 4/10 pgb b a a b d c d d 9 8 -- switched left shoe
// node addClimb 4/7 pgb v0x2 v1 c d d 9 c c
// node addClimb 4/6 v1x8 v2 v0
// node addClimb 4/5 11b 11a d c b 8 a 9 b 8 cl 5.4x3
// node addClimb 3/31 7 a c c a 9 b 8 6 b cl 4x3
// node addClimb 2/21 v0x2 v1 v2x2 8x2 b 9 9 9 b 11b c 11b
// node addClimb 2/19 v0x2 bx2 c b cl 5.4
// node addClimb 2/17 9 7 d c 7 8 a b 11a 11a b
// node addClimb 2/13 cl 5.4x4 sc b 11ax2 d a 7 8 a b a
// node addClimb 2/7 cl 5.4 sc 11a a
// node addClimb 2/6 a c 11b d 7 a d 9
// node addClimb 2/3 11a b 11a 11a d a d a b
// node addClimb 1/25 cl 5.5x3 5.4x2 sc cs 11a c d
// node addClimb 1/22 csx2 9s b a cl 5.6 5.4x4
// node addClimb 1/20 9s cs bs as 11a 11b b d 11d 9c
// node addClimb 1/17 8 11ax3 c 9 b 9 cl 5.4x3 5.6x1.5
// node addClimb 1/15 c d 11a ax2 d b cl 5.4x11 5.6x2
// node addClimb 11/13 b 9 9 12a.5 11b cl 5.6x3 5.4 -- Cadens first time to top of middle wall pgb
// node addClimb 1/3 9 b a c d a 8 9 c 6 c d a cl 5.6x6
// node addClimb 1/4 8 a b 9 c cl 5.4x2
// node addClimb 11/6 c d 11a b d b 11a cl 5.4x3 5.5x2
// node addClimb 1/8 12a 9 c cl 5.4x2 5.6 -- first 12 but not clean
// node addClimb 1/11 c d 12a 11a c 9 11b.5 c d a cl 5.6x3 5.4x3
