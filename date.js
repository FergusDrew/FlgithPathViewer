function dateDisplay ()
{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var todayDate = dd + '/' + mm + '/' + yyyy;

    document.getElementById("MyDateDisplay").innerText = todayDate;
    document.getElementById("MyDateDisplay").textContent = todayDate;

}    

dateDisplay();