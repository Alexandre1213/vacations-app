// Tools

function mapToJson(map) {
    return JSON.stringify([...map]);
}
function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}

////////////////////////////////////////

var daysinmonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

if(localStorage.getItem('selected') == null) {
    localStorage.setItem('selected', '1/1/2019');
}

if(localStorage.getItem('infos') == null) {
    localStorage.setItem('infos', mapToJson(new Map()));
}

var selected = localStorage.getItem('selected');
var selectedY = parseInt(localStorage.getItem('selected').split('/')[2]);
var selectedM = parseInt(localStorage.getItem('selected').split('/')[1]);
var selectedD = parseInt(localStorage.getItem('selected').split('/')[0]);
var infos = jsonToMap(localStorage.getItem('infos'));

function generateDatePicker() {
    let maindiv = document.getElementById('datepicker');
    let htmldatepicker = "";

    htmldatepicker += `<button class="btn btn-primary" onclick="changeMonth(-1)"><</button>`;
    htmldatepicker += `<div style="grid-column: 2 / 7;"><h1 style="text-align: center; font-size: 250%;">${monthNames[selectedM - 1]} ${selectedY}</h1></div>`;
    htmldatepicker += `<button class="btn btn-primary" onclick="changeMonth(+1)">></button>`;
    htmldatepicker += `<div>Lundi</div><div>Mardi</div><div>Mercredi</div><div>Jeudi</div><div>Vendredi</div><div>Samedi</div><div>Dimanche</div>`;
    let offday = new Date(selectedY, selectedM - 1, 1).getDay();
    if(offday - 1 < 0) { offday = 7 }
    if(offday > 1) {
        htmldatepicker += `<p style="grid-column: 1 / ${offday}"></p>`;
    }

    if(selectedY % 4 == 0) { daysinmonth[1] = 29 } else { daysinmonth[1] = 28 }
    for(let i = 1; i <= daysinmonth[selectedM - 1]; i++) {
        let currentInfo = infos.get(i.toString() + '/' + selectedM.toString() + '/' + selectedY.toString());
        let bccolor = `${i}/${selectedM}/${selectedY}` == selected ? 'border-color: red;' : 'border-color: grey;';

        if(currentInfo == undefined || currentInfo == '/00:00/00:00/false') {
            htmldatepicker += `<button class="btn btn-primary" style="${bccolor};border-radius: 0" onclick="selectDay(${i})">${i}</button>`;
            continue;
        }
        
        let currentInfos = infos.get(i.toString() + '/' + selectedM.toString() + '/' + selectedY.toString()).split('/');

        let bgcolor = 'background-color: ';
        bgcolor += currentInfos[3] == 'true' ? 'green' : 'red';

        htmldatepicker += `<button class="btn btn-primary" style="${bgcolor};${bccolor};border-radius: 0" onclick="selectDay(${i})">${i}</button>`;
    }

    maindiv.innerHTML = htmldatepicker;
}

// Each info is an array : [0] is the place, [1] is the start time and [2] is the end time.
function showInfos() {
    let place = document.getElementById('place');
    let startTime = document.getElementById('startTime');
    let endTime = document.getElementById('endTime');
    let check = document.getElementById('paid');

    if(infos.get(selected) == undefined) {infos.set(selected, '/00:00/00:00/false')};

    place.value = infos.get(selected).split('/')[0];
    startTime.value = infos.get(selected).split('/')[1];
    endTime.value = infos.get(selected).split('/')[2];
    check.checked = infos.get(selected).split('/')[3] == 'true';
}

function saveInfos() {
    let place = document.getElementById('place');
    let startTime = document.getElementById('startTime');
    let endTime = document.getElementById('endTime');
    let check = document.getElementById('paid');

    infos.set(selected, place.value + '/' + startTime.value + '/' + endTime.value + '/' + check.checked.toString());

    generateDatePicker();
    saveState();
}

function selectDay(day) {
    selectedD = day;
    saveState();
    generateDatePicker();
    showInfos();
}

function changeMonth(chg) {
    selectedM += chg;

    if(selectedM < 1) { selectedM = 12; selectedY -= 1 }
    if(selectedM > 12) { selectedM = 1; selectedY += 1 }

    generateDatePicker();
    showInfos();
    saveState();
}

function saveState() {
    localStorage.setItem('selected', selectedD.toString() + '/' + selectedM.toString() + '/' + selectedY.toString());
    localStorage.setItem('infos', mapToJson(infos));

    selected = localStorage.getItem('selected');
    infos = jsonToMap(localStorage.getItem('infos'));
}

function loadContent(u_id) {
    if(!/[0-9]{6}/gm.test(u_id)) { console.log('String don\'t match.'); return; }
    fetch('https://vacations-apps.herokuapp.com/' + u_id)
        .then(res => {
            console.log('res.body =', res.text());
            if(res.status == 404) {
                fetch('https://vacations-apps.herokuapp.com/' + u_id)
                    .then(res => {
                        if(res.text() != 'undefined') {
                            infos = jsonToMap(res.body);
                        }
                    });
            } else {
                if(res.text() != 'undefined') {
                    infos = jsonToMap(res.text());
                }
            }
        });
}

generateDatePicker();