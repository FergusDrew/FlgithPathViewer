class Analytics {
    constructor(data) {
        this.UKCorners = [
            {
                x: -8.2939453125,
                y: 59.512029386502704
            },
            {
                x: 2.4716796874999996,
                y: 59.512029386502704
            },
            {
                x: 2.4716796874999996,
                y: 49.7
            },
            {
                x: -8.2939453125,
                y: 49.7
            },
        ];
        this.UKArea = Analytics.getAreaOfRect(this.UKCorners);

        // Flight time stats
        this.shortestFlightTime = 0;
        this.longestFlightTime = 0;
        this.averageFlightTime = 0;
        this.totalFlightTime = 0;
        this.percentageTimeFlying = 0;

        // Area covered stats
        this.coveragePercent = 0;
        this.smallestFlightArea = 0;
        this.largestFlightArea = 0;
        this.averageFlightArea = 0;
        this.totalFlightArea = 0;

        this.calculateCoverageData(data);
        this.calculateFlightTimeData(data);
        this.generateNumFlightsData(data);

        this.display();
    }

    calculateCoverageData(data) {
        let smallest = 0;
        let largest = 0;
        let total = 0;

        for (let p of data) {
            let area = Analytics.getAreaOfRect(p.corners);

            if (total == 0) {
                smallest = area;
                largest = area;
            }
            else {
                if (area < smallest) smallest = area;
                if (area > largest) largest = area;
            }

            total += area;
        }

        let average = total / data.length;
        let percent = total / this.UKArea;

        // console.log({ smallest, largest, total, average, percent });

        // Setting object variables.
        this.smallestFlightArea = smallest;
        this.largestFlightArea = largest;
        this.totalFlightArea = total;
        this.averageFlightArea = average;
        this.coveragePercent = percent;
    }

    static getAreaOfRect(corners) {

        const w = Analytics.getDistanceFromLatLonInKm(corners[0].y, corners[0].x, corners[1].y, corners[1].x);
        const h = Analytics.getDistanceFromLatLonInKm(corners[1].y, corners[1].x, corners[2].y, corners[2].x);

        return w * h;
    }

    static getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = Analytics.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = Analytics.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Analytics.deg2rad(lat1)) * Math.cos(Analytics.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    static deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    calculateFlightTimeData(data) {
        let shortest = 0;
        let longest = 0;
        let total = 0;

        // console.log(data);

        for (let d of data) {
            let flightTimeMS = d.endDate - d.startDate;

            if (total == 0) {
                shortest = flightTimeMS;
                longest = flightTimeMS;
            }
            else {
                if (flightTimeMS < shortest) shortest = flightTimeMS;
                if (flightTimeMS > longest) longest = flightTimeMS;
            }

            total += flightTimeMS;
        }

        let average = total / data.length;
        let percent = total / this.getTimeFrame();

        // console.log({ shortest, longest, total, average });

        // Setting object variables.
        this.shortestFlightTime = shortest;
        this.longestFlightTime = longest;
        this.totalFlightTime = total;
        this.averageFlightTime = average;
        this.percentageTimeFlying = percent;
    }

    getTimeFrame() {
        setdate(document.getElementById("datePick"));
        setdate(document.getElementById("datePick2"));

        let st; let et;

        // Neither selected
        if (!document.getElementById("timeSel").valueAsNumber && !document.getElementById("datePick").valueAsNumber) {
            st = new Date(document.getElementById("datePick").min).valueOf();
            et = new Date(document.getElementById("datePick2").max).valueOf();
        }
        // Just start date, no start time
        else if (document.getElementById("datePick").valueAsNumber && !document.getElementById("timeSel").valueAsNumber) {
            st = document.getElementById("datePick").valueAsNumber;

            // End date also selected
            if (document.getElementById("datePick2").valueAsNumber) {
                et = document.getElementById("datePick2").valueAsNumber;
            }
            // No end Date selected
            else {
                et = st + 86400000; // End of the day selected
            }
        }
        // Start date and time selected
        else if (document.getElementById("datePick").valueAsNumber && document.getElementById("timeSel").valueAsNumber) {
            st = document.getElementById("datePick").valueAsNumber + document.getElementById("timeSel").valueAsNumber;

            // End date and time also selected
            if (document.getElementById("datePick2").valueAsNumber & document.getElementById("timeSel2").valueAsNumber) {
                et = document.getElementById("datePick2").valueAsNumber + document.getElementById("timeSel2").valueAsNumber;
            }
            // Just End Date picked
            else if (document.getElementById("datePick2").valueAsNumber & !document.getElementById("timeSel2").valueAsNumber) {
                et = document.getElementById("datePick2").valueAsNumber + 86400000; // End of selected end day
            }
            // No end Date or time selected
            else {
                et = st + 86400000; // End of the day selected
            }
        }

        return (et - st);
    }

    generateNumFlightsData(data) {
        let dates = [];

        // Get all the dates in an array
        for (let d of data) {
            let currentDate = formatDate(new Date(d.startDate), true);

            if (this.isntIn(dates, currentDate) == true) {
                dates.push(currentDate);
            }
        }

        dates = this.sortDates(dates);

        // Work out how many flights on each date
        let values = new Array(dates.length).fill(0);

        for (let d of data) {
            for (let i = 0; i < dates.length; i++) {
                if (formatDate(new Date(d.startDate), true) == dates[i]) {
                    values[i]++;
                }
            }
        }

        this.numFlightsData = {
            dates,
            values,
        }
    }

    isntIn(arr, val) {
        for (let a of arr) {
            if (a == val) return false;
        }
        return true;
    }

    sortDates(dates) {
        let newDates = dates;
        let len = newDates.length

        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {

                let date1 = ("" + newDates[j]).split("-");
                let date2 = ("" + newDates[j + 1]).split("-");

                date1 = date1[2] + date1[1] + date1[0];
                date2 = date2[2] + date2[1] + date2[0];

                if (date1 > date2) {
                    let temp = newDates[j];
                    newDates[j] = newDates[j + 1];
                    newDates[j + 1] = temp;
                }
            }
        }

        return newDates;
    }

    display() {
        document.getElementById("avg-time").childNodes[2].innerText = (new Date(this.averageFlightTime)).toUTCString().substring(17, 26);

        document.getElementById("shortest-time").childNodes[2].innerText = (new Date(this.shortestFlightTime)).toUTCString().substring(17, 26);

        document.getElementById("longest-time").childNodes[2].innerText = (new Date(this.longestFlightTime)).toUTCString().substring(17, 26);
        document.getElementById("total-time").childNodes[2].innerText = (new Date(this.totalFlightTime)).toUTCString().substring(17, 26);
        document.getElementById("percentage-time").childNodes[2].innerText = ((this.percentageTimeFlying * 100).toFixed(2)).toString() + "%";

        const km = " <span style='font-size:9pt'>KM<sup>2</sup></span>";

        document.getElementById("avg-area").childNodes[2].innerHTML = this.averageFlightArea.toFixed(2) + km;
        document.getElementById("smallest-area").childNodes[2].innerHTML = this.smallestFlightArea.toFixed(2) + km;
        document.getElementById("largest-area").childNodes[2].innerHTML = this.largestFlightArea.toFixed(2) + km;
        document.getElementById("total-area").childNodes[2].innerHTML = this.totalFlightArea.toFixed(2) + km;
        document.getElementById("percentage-area").childNodes[2].innerText = ((this.coveragePercent * 100).toFixed(2)).toString() + "%";

        createChart("num-flights-chart", this.numFlightsData, "# Flights per day.");
    }

    static closeTimeAnal() {
        document.getElementById("stats-display-time").style.height = "75px";
        document.getElementById("buttonCloseTimeAnaly").setAttribute("onclick", "Analytics.openTimeAnal()");
        document.getElementById("buttonCloseTimeAnaly").innerText = "Open Menu";
    }
    static openTimeAnal() {
        document.getElementById("stats-display-time").style.height = "auto";
        document.getElementById("buttonCloseTimeAnaly").setAttribute("onclick", "Analytics.closeTimeAnal()");
        document.getElementById("buttonCloseTimeAnaly").innerText = "Close Menu";
    }


    static closeAreaAnal() {
        document.getElementById("stats-display").style.height = "75px";
        document.getElementById("buttonCloseAreaAnaly").setAttribute("onclick", "Analytics.openAreaAnal()");
        document.getElementById("buttonCloseAreaAnaly").innerText = "Open Menu";
    }
    static openAreaAnal() {
        document.getElementById("stats-display").style.height = "auto";
        document.getElementById("buttonCloseAreaAnaly").setAttribute("onclick", "Analytics.closeAreaAnal()");
        document.getElementById("buttonCloseAreaAnaly").innerText = "Close Menu";
    }


}