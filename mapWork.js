let searchData = [];

//---Making a map and tiles---
const UKView = [53.304621, -1.804311];
const mapZoomLevel = 5.5;
const mymap = L.map("mapid", { drawControl: true }).setView(UKView, mapZoomLevel);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });

L.mapbox.accessToken = 'pk.eyJ1IjoibWFjaWVqem9sIiwiYSI6ImNrbDZwOXgzYzBsNm8yd251aXlhZDF5dWcifQ.Ffdl2Qhe01tn5WEZWNeV6w';

const styleLayer = L.mapbox.styleLayer("mapbox://styles/maciejzol/ckl6rsy0t0y4e17o6uwsmeepl")
  .addTo(mymap);

const styleLayer2 = L.mapbox.styleLayer("mapbox://styles/maciejzol/ckl6rrofq13ld17pcck10uumd")

const styleYellow = L.mapbox.styleLayer("mapbox://styles/maciejzol/ckl84lij669oa17mp3z3n4wnn")
const stylePink = L.mapbox.styleLayer("mapbox://styles/maciejzol/ckl7us0o26k8z17mvro15e0m0")
const styleRed = L.mapbox.styleLayer("mapbox://styles/maciejzol/ckl7upp9w4edf17pqu7fcw49n")
const styleGreen = L.mapbox.styleLayer("mapbox://styles/maciejzol/ckl84mlg60ln817qiciowqnbv")
const styleBlue = L.mapbox.styleLayer("mapbox://styles/maciejzol/ckl7uofq025h817s18tedcqnj")
const styleBrown = L.mapbox.styleLayer("mapbox://styles/maciejzol/ckl84regy3gys18muh5afhnmu")
const stylePurple = L.mapbox.styleLayer("mapbox://styles/maciejzol/ckl85n1f65fco17mrkcwruhdd")

//---Adding a metric scale to the map for scale reference---
L.control.scale({ position: 'topright' }).addTo(mymap);

var themeC = '#ffffff';
//---Base map overlay section---
var baseMaps = {
  "<span style='color: black'>Street</span>": tiles,
  "<span style='color: black'>Hybrid</span>": styleLayer,
  "<span style='color: black'>Minimal</span>": styleLayer2,
  "<span style='color: #B89F00'>Yellow</span>": styleYellow,
  "<span style='color: #F3A5B7'>Pink</span>": stylePink,
  "<span style='color: #D2324A'>Red</span>": styleRed,
  "<span style='color: #1E6C1E'>Green</span>": styleGreen,
  "<span style='color: #188ac7'>Blue</span>": styleBlue,
  "<span style='color: #543219'>Brown</span>": styleBrown,
  "<span style='color: #711e87'>Purple</span>": stylePurple
}

//---Null overlay variable for parameter placeholder---
var overlayMaps = {

};

//---Implements map overlays as options on the leaflet map---
let overlayControl = L.control.layers(baseMaps, overlayMaps).addTo(mymap);

let pathLayer = [];
let iconsLayer = [];

var popup = L.popup();

var customPopup =
{
  'maxWidth': '400',
  'width': '200',
  'className': 'popupCustom'
}

//--Adds live mouse position for use in lnglat---
L.control.mousePosition().addTo(mymap);

mymap.on('baselayerchange', function (e) {
  let html = e.name;
  let div = document.createElement("div");
  div.innerHTML = html;

  if (div.textContent == 'Brown' || div.textContent == 'Red') {
    themeC = '#ff4500';
  }
  else {
    themeC = '#ffffff';
  }
  changeColour(div.textContent);
});

//---Plots icon points at the centre of each flight path searched for---
function iconPlot(dataPoints) {
  var i;
  const flightIcon = L.icon({
    iconUrl: 'Assets/flightIconGlow.png',
    iconSize: [25, 20],
  });
  for (i = 0; i < dataPoints.length; i++) {
    var values = dataPoints[i].centre.split(",");
    var yPlot = parseFloat(values[0]);
    var xPlot = parseFloat(values[1]);

    let st = new Date(dataPoints[i].startDate).toTimeString();
    let et = new Date(dataPoints[i].endDate).toTimeString();

    let elapsed = dataPoints[i].endDate - dataPoints[i].startDate;

    let coverage = Analytics.getAreaOfRect(dataPoints[i].corners);


    let newMarker = L.marker([yPlot, xPlot], { icon: flightIcon }).addTo(mymap).bindPopup("<strong>Mission: </strong>" + dataPoints[i].title + "<br/><br/>" + "<strong>Date: </strong>" + formatDate(dataPoints[i].startDate, true) + "<br/><br/>" + "<strong>Centre:  </strong>" + dataPoints[i].centre + "<br/><br/>" + "<strong>Start/End Time:  </strong>" + st.split(' ', 1).join(' ') + " - " + et.split(' ', 1).join(' ') + "<br/><br/>" + "<strong>Time Elapsed:  </strong>" + formatTime(elapsed) + "<br/><br/>" + "<strong>Coverage:  </strong>" + coverage.toFixed(2) + " <span style='font-size:9pt'>KM<sup>2</sup></span>", customPopup);
    iconsLayer.push(newMarker);//.popup("yes"));

    newMarker.on("click", (e) => {
      // This fires when you click on a plane icon
      const id = e.target._leaflet_id;

      for (let h = 0; h < iconsLayer.length; h++) {
        if (id == iconsLayer[h]._leaflet_id) {
          var y = iconsLayer[h]._latlng.lat;
          var x = iconsLayer[h]._latlng.lng;
          mymap.flyTo([y, x], 10.3, { duration: 4 });
        }
      }
    })
  }
}

function genShape(firstLatTop, firstLongTop, firstLatBottom, firstLongBottom, lastLatTop, lastLongTop, lastLatBottom, lastLongBottom, title, centre, startDate, endDate, corners, selected) {
  // const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);

  let st = new Date(startDate).toTimeString();
  let et = new Date(endDate).toTimeString();

  let elapsed = endDate - startDate;

  let coverage = Analytics.getAreaOfRect(corners);

  let newShape = L.polygon([
    [firstLatTop, firstLongTop],
    [lastLatTop, lastLongTop],
    [lastLatBottom, lastLongBottom],
    [firstLatBottom, firstLongBottom]
  ], {
    color: selected == false ? themeColour : "#ffffff",

  }).addTo(mymap)

  if (selected == false) {
    newShape.bindPopup("<strong>Mission: </strong>" + title + "<br/><br/>" + "<strong>Date: </strong>" + formatDate(startDate, true) + "<br/><br/>" + "<strong>Centre:  </strong>" + centre + "<br/><br/>" + "<strong>Start/End Time:  </strong>" + st.split(' ', 1).join(' ') + " - " + et.split(' ', 1).join(' ') + "<br/><br/>" + "<strong>Time Elapsed:  </strong>" + formatTime(elapsed) + "<br/><br/>" + "<strong>Coverage:  </strong>" + coverage.toFixed(2) + " <span style='font-size:9pt'>KM<sup>2</sup></span>", customPopup);
  }

  newShape.on("click", (e) => {
    const id = e.target._leaflet_id;
    selectedPath = getInfo(id);
    // console.log(selectedPath);

    if (selectingMissions == true) {
      if (selectedPath.selected == false) {
        selectedPath.selected = true;
        selectMissionForTag(selectedPath);
      }
      else {
        selectedPath.selected = false;
        removeMissionFromTag(selectedPath);
      }

      if(searchData.length > 0) clearAndRedraw(searchData);
      else clearAndRedraw();
    }
  })

  pathLayer.push(newShape);
}

function selectMissionForTag(mission) {
  if (selectingMissions === true && currentTag) {
    currentTag.AddMission(mission);
  }
}

function removeMissionFromTag(mission) {
  if (selectingMissions === true && currentTag) {
    for (let i = 0; i < currentTag.missions.length; i++) {
      if (currentTag.missions[i].productID == mission.productID) {
        currentTag.missions.splice(i, 1);
        break;
      }
    }
  }
}

function clearAndRedraw(dataToDraw = data) {
  clearFlightpaths();
  pathLayer = [];
  iconsLayer = [];
  loopShape(dataToDraw);
}

function deleteTag() {
  if (currentTag) {
    searchData = [];

    document.getElementById("EditTags").style.display = "none";
    document.getElementById("DeleteButton").style.display = "none";

    resetSelected();

    clearAndRedraw();
    Tags.deleteTag(currentTag);

    if (tags.length == 0) {
      document.getElementById("SelectTag").style.display = "none";
    }

    setHintText("Deleted Tag: " + currentTag.name);
    currentTag = null;

  }
}

function setHintText(text) {
  document.getElementById("hint-text").style.display = "block";
  document.getElementById("hint-text").innerText = text;
}

function hideHint() {
  document.getElementById("hint-text").style.display = "none";
  document.getElementById("hint-text").innerText = "";
}

function createNewTag() {
  if (selectingMissions === false) {
    if(searchData.length > 0) clearAndRedraw(searchData);
    else clearAndRedraw();

    let name = prompt("Enter a tag name", "Tag Name...");
    while (name == "") {
      name = prompt("Enter a tag name");
    }

    if (name != null) {
      document.getElementById("CreateButton").style.display = "none";
      document.getElementById("ConfirmButton").style.display = "flex";

      setHintText("Click on Flightpaths you want to assign to the tag, then click confirm to save your selection.");
      currentTag = new Tags(name);
      // console.log("new tag created");
      selectingMissions = true;
    }
  }
}

function showAllFlights(data, removeButtons = true) {
  searchData = [];

  if (removeButtons == true) {
    document.getElementById("EditTags").style.display = "none";
    document.getElementById("DeleteButton").style.display = "none";
  }

  clearAndRedraw();
  loopShape(data);
}

function editTag() {
  searchData = [];
  for (let i = 0; i < tags.length; i++) {
    if (currentTag.name == tags[i].name) {
      tags.splice(i, 1);
    }
  }

  document.getElementById("CreateButton").style.display = "none";
  document.getElementById("ConfirmButton").style.display = "flex";
  document.getElementById("DeleteButton").style.display = "none";
  document.getElementById("EditTags").style.display = "none";

  var temptag = currentTag;

  for (let i = 0; i < temptag.missions.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (temptag.missions[i].productID == data[j].productID) {
        data[j].selected = true;
      }
    }
  }

  clearAndRedraw();

  let newName = prompt("Confirm tag name:", currentTag.name);
  currentTag.name = newName;

  selectingMissions = true;
}

function confirmTags() {
  if (selectingMissions === true && currentTag) {
    document.getElementById("CreateButton").style.display = "flex";
    document.getElementById("ConfirmButton").style.display = "none";
    document.getElementById("SelectTag").style.display = "flex";

    hideHint();

    selectingMissions = false;

    if (currentTag.missions.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        if (tags[i].name == currentTag.name) {
          alert("A tag with this name already exists");
          resetSelected();
          clearAndRedraw();
          return;
        }
      }

      tags.push(currentTag);
      resetSelected();
      // SaveTag(tags);
      Tags.SaveTags();
    }

    if (tags.length == 0) {
      document.getElementById("SelectTag").style.display = "none";
    }

    clearAndRedraw();
  }
}

function resetSelected() {
  for (let d of data) {
    d.selected = false;
  }
}

// Get data of the path clicked on. (parameter is _leaflet_id of the target layer)
function getInfo(id) {
  let index;

  // console.log(id);
  // console.log(pathLayer);
  for (let i = 0; i < pathLayer.length; i++) {
    if (pathLayer[i]._leaflet_id == id) index = i;
  }

  if(searchData.length > 0) return (searchData[index]);
  else return (data[index]);
  
}

//

/*function RevealFunction() {
  var x = document.getElementById("datePick2");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}*/

//---Clears both drawn flight paths and icons on the map---
function clearFlightpaths() {
  for (let p of pathLayer) {
    p.remove();
  }
  for (let i of iconsLayer) {
    i.remove();
  }
}



function getFlightsByTagName(tagName) {
  for (let t of tags) {
    if (t.name == tagName) {
      clearFlightpaths();

      for (let m of t.missions) {
        m.remove();
      }
      for (let i of iconsLayer) {
        i.remove();
      }
    }
  }
}

function displayStart() {
  if (selectingMissions == false) {

    const dateSelected = document.getElementById("datePick").valueAsNumber;
    var dateAsDate = document.getElementById("datePick").value;

    if (dateSelected) {
      clearFlightpaths();
      let newDate = formatDate(dateAsDate, false);
      getFlightsOnDay(newDate);
    }

    if (document.getElementById("datePick2").valueAsNumber && dateSelected) {
      const endDateValue = document.getElementById("datePick2").valueAsNumber;

      // console.log(document.getElementById("datePick2").value);

      getFlightsInRange(dateSelected, endDateValue);
      console.log(formatDate(dateSelected), formatDate(endDateValue));
    }
    else if (!dateSelected) {
      alert("You must include a start date!");
      clearAndRedraw();
    }
  }
}

function getFlightsByTagName(tagName) {
  for (let t of tags) {
    if (t.name == tagName) {
      clearFlightpaths();

      for (let m of t.missions) {
        getFlightsByProductId(m.productID);
      }

      break;
    }
  }
}

function displayStart() {
  const dateSelected = document.getElementById("datePick").valueAsNumber;
  var dateAsDate = document.getElementById("datePick").value;

  if (dateSelected) {
    clearFlightpaths();
    let newDate = formatDate(dateAsDate, false);
    getFlightsOnDay(newDate);

  }

  if (document.getElementById("datePick2").valueAsNumber && dateSelected) {
    const endDateValue = document.getElementById("datePick2").valueAsNumber;
    getFlightsInRange(dateSelected, endDateValue);
  }
  else if (!dateSelected) {
    alert("You must include a start date!");
    clearAndRedraw();
  }
}

function getFlightsInRange(startParam, endParam) {
  clearFlightpaths();
  searchData = [];

  data.forEach(d => {
    let start = d.startDate;
    let end = d.endDate;
    let FlightMidtime = ((start + end) / 2);
    let [st, et] = getStartTimes();

    if (((startParam + st) <= FlightMidtime) && ((endParam + et + 86400000) >= FlightMidtime)) {

      // console.log(d);

      getCoOrds(d);
      // iconPlot([d]);
      let filter = [];
      filter.push({ d });
      storeData(filter);
    }
  });

  iconPlot(searchData);
  analytics = new Analytics(searchData);
}

function getStartTimes() {
  var startTime = document.getElementById("timeSel").valueAsNumber;
  var endTime = document.getElementById("timeSel2").valueAsNumber;

  if ((startTime) && (endTime) != null) {
    return [startTime, endTime];
  }
  else if ((startTime) != null && (endTime) == null) {
    console.log("should alert!")
    alert("You must include a end time!");
  }
  return [0, 0];
}

function formatDate(date, isReversed) {
  var d = new Date(date),
    month = '' + (d.getUTCMonth() + 1),
    day = '' + (d.getUTCDate()),
    year = (d.getUTCFullYear());

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  if (isReversed == true) {
    return [day, month, year].join('-');
  }
  return [year, month, day].join('-');
}

function formatTime(date) {
  var t = new Date(date),
    hour = '' + (t.getUTCHours()),
    minute = '' + (t.getUTCMinutes()),
    second = '' + (t.getUTCSeconds());

  if (hour.length < 2)
    hour = '0' + hour;
  if (minute.length < 2)
    minute = '0' + minute;
  if (second.length < 2)
    second = '0' + second;

  return [hour, minute, second].join(':');
}

function getFlightsOnDay(date) {
  searchData = [];
  data.forEach(d => {
    var newDate = formatDate(d.startDate, false);

    if (newDate == date) {
      console.log(date);
      console.log(d);

      getCoOrds(d);
      // iconPlot([d]);
      let filter = [];
      filter.push({ d });
      storeData(filter);
    }
  })

  iconPlot(searchData);
  analytics = new Analytics(searchData);
}

function getFlightsById(id) {
  clearFlightpaths();
  searchData = [];
  isValid = false;

  data.forEach(d => {
    // get the title
    var temp = d.title.split(" ")[0];

    if (temp == id) {
      getCoOrds(d);
      iconPlot([d]);
      let filter = [];
      filter.push({ d });
      storeData(filter);
      isValid = true;
    }
  })
  if (isValid == false) {
    alert("Incorrect ID");
    document.getElementById("search").value = "";
  }

  analytics = new Analytics(searchData);
}

function getFlightsByProductId(id) {
  isValid = false;

  data.forEach(d => {
    // get the title
    var temp = d.productID;

    if (temp == id) {
      getCoOrds(d);
      iconPlot([d]);
      let filter = [];
      filter.push({ d });
      storeData(filter);
      isValid = true;
    }
  })
  if (isValid == false) {
    alert("Incorrect ID");
    document.getElementById("search").value = "";
  }

  analytics = new Analytics(searchData);
}

function search() {
  var id = document.getElementById("search").value;
  getFlightsById(id);
}

function setdate(event) {
  let minDate = data[0].startDate;
  let maxDate = data[0].startDate;

  data.forEach(d => {
    if (minDate > d.startDate) {
      minDate = d.startDate;
    }
    if (maxDate < d.startDate) {
      maxDate = d.startDate;
    }
  });

  document.getElementById(event.id).setAttribute("min", formatDate(minDate, false));
  document.getElementById(event.id).setAttribute("max", formatDate(maxDate, false));
}

function storeData(filter) {
  // searchData = filter;

  // console.log(filter);

  let d = filter[0].d;
  searchData.push({
    productID: d.productID,
    centre: d.centre,
    geoJSONData: d.geoJSONData,
    missionID: d.missionID,
    startDate: d.startDate,
    endDate: d.endDate,
    title: d.title,
    corners: d.corners,
    selected: false,
  })

  // console.log(searchData);
}

// Reading of the enter key for searchID entries // 
function handle(e) {
  if (e.keyCode === 13) {
    search();
  }
  return false;
}