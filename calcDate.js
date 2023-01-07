const toDateTime = (secs) => {
    let timeStamp = new Date(1970, 0, 1); // Epoch
    timeStamp.setSeconds(secs);
    return timeStamp;
}


const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
"JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

exports.toDateTime = toDateTime
exports.monthNames = monthNames