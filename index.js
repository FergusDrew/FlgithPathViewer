// Main JS file
let data;
let myChart; 
let missionData;
let selectedPath;
let analytics;
let tags = Tags.LoadTags();
Tags.populateTagsList();
let selectingMissions = false; // true for testing, should be toggled by a UI button
let currentTag; // The newly created/editing tag object   

// Runs on start
(() => {
  let api = new APIData();

  // Checks for the API loading then creates a MissionData object, data.data is the main data array.
  let checkAPILoaded = setInterval(() => {
    if (api.loaded == true) {

      missionData = new MissionData(api.products);
      data = missionData.data;
      analytics = new Analytics(data);
      // console.log(data);
      loopShape(data);
      document.getElementById("loading-plane").style.display = "none";
      document.getElementById("loading-overlay").style.display = "none";

      clearInterval(checkAPILoaded);
    }
    else{

    }
  }, 10)

})();

function loopShape(dataPoints) {
  iconPlot(dataPoints);
  dataPoints.forEach(d => {
    getCoOrds(d);
  });
  analytics = new Analytics(dataPoints);
}

function getCoOrds(item) {
  genShape(item.corners[0].y, item.corners[0].x, item.corners[1].y, item.corners[1].x, item.corners[3].y, item.corners[3].x, item.corners[2].y, item.corners[2].x, item.title, item.centre, item.startDate, item.endDate, item.corners, item.selected);
}

