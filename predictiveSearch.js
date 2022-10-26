function predictiveSearch(){
    
    var suggestionArray = [];
    for(i=0; i < missionData.titles.length; i++){
        suggestionArray[i] = missionData.titles[i];
    }
    
    const input = (document.getElementById("search").value).toUpperCase();
    //const searchWrapper = document.querySelector("search");
    const suggBox = document.querySelector(".autocom-box");
    suggBox.innerHTML = "";
    let prediction = [];

    suggestionArray.forEach((flightName) => {
        let charMatch = false;
        for(i=0; i<input.length; i++){
            var char = input[i];
            // console.log(char);
            if (flightName[i] == input[i]){
                charMatch = true;
            }
            if (flightName[i] != input[i]){
                break;
            }
            if (i == input.length - 1){
                prediction.push(flightName);
            }
        }
    });

    if(prediction.length == 0){
        var r = document.querySelector(':root');
        r.style.setProperty('--bwidth', 0);
    }

    for (let index = 0; index < prediction.length; index++) {
        
        let listData;
        
            listData = `<div  onclick='zoomFlight("${prediction[index]}")'><li class="dropDownPredict"> ${prediction[index]} </li></div>`;
        
        suggBox.innerHTML += listData;
    }
}

function zoomFlight(predTitle){
    missionData.data.forEach(missionOb => {
        let title = missionOb.title;
        if(title == predTitle){
            console.log(missionOb);
            let centre = missionOb.centre;
            var values = missionOb.centre.split(",");
            var y = parseFloat(values[0]);
            var x = parseFloat(values[1]);

            mymap.flyTo([y,x], 10.3, {duration: 4});
        }
    });
}