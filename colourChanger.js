let themeColour = '#ff4500'; // orangered;

function changeColour(colour) {


    console.log(colour);

    switch (colour) {
        case "Yellow":
            themeColour = '#2233AA'
            break;
        case "Pink":
            themeColour = '#29A131'

            break;
        case "Red":
            themeColour = '#ffffff'

            break;
        case "Green":
            themeColour = '#ffd700'

            break;
        case "Blue":
            themeColour = '#ffa500'

            break;
        case "Brown":
            themeColour = '#ffffff'

            break;
        case "Purple":
            themeColour = '#20DF45'

            break;

        default:
            themeColour = '#ff4500';
            break;
    }

    clearAndRedraw();
    
    var r = document.querySelector(':root');
    r.style.setProperty('--ncolour', themeColour);

    if (themeColour == '#2233AA'){
        r.style.setProperty('--tcolour', '#ffffff');
    }
    else{
        r.style.setProperty('--tcolour', '#000000');
    }


}

