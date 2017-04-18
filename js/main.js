// Holidays
var holidays = {
 "2017-04-29": "昭和の日",
 "2017-05-03": "憲法記念日",
 "2017-05-04": "みどりの日",
 "2017-05-05": "こどもの日",
 "2017-07-17": "海の日",
 "2017-08-11": "山の日",
 "2017-09-18": "敬老の日",
 "2017-09-23": "秋分の日",
 "2017-10-09": "体育の日",
 "2017-11-03": "文化の日",
 "2017-11-23": "勤労感謝の日",
 "2017-12-23": "天皇誕生日",
 "2018-01-01": "元日",
 "2018-01-08": "成人の日",
 "2018-02-11": "建国記念の日",
 "2018-02-12": "建国記念の日 振替休日",
 "2018-03-21": "春分の日",
 "2018-04-29": "昭和の日",
 "2018-04-30": "昭和の日 振替休日",
 "2018-05-03": "憲法記念日",
 "2018-05-04": "みどりの日",
 "2018-05-05": "こどもの日",
 "2018-07-16": "海の日",
 "2018-08-11": "山の日",
 "2018-09-17": "敬老の日",
 "2018-09-23": "秋分の日",
 "2018-09-24": "秋分の日 振替休日",
 "2018-10-08": "体育の日",
 "2018-11-03": "文化の日",
 "2018-11-23": "勤労感謝の日",
 "2018-12-23": "天皇誕生日",
 "2018-12-24": "天皇誕生日 振替休日"
}


// Set page display
function setDisplay(from, to, from_ja, to_ja) {
  $("#fromDisp_en").text(from);
  $("#toDisp_en").text(to);
  $("#fromDisp_ja").text(from_ja);
  $("#toDisp_ja").text(to_ja);
}

// Fix timezone
function fixTimezone(offset) {

}

// Create TimeTable for get to Ride
function createBusDepartureTimeTable(now, from, to, busIDs, weekdayOrHoliday) {
  var baseUrl = "timetables/" + from + "/" + to + "/";
  for (var i = 0; i < busIDs.length; i++) {
    $.getJSON(baseUrl + busIDs[i] + ".json", function (data) {
      var departure_times = get_recent_departure_time(now, data[weekdayOrHoliday]);
      addScheduleBoard(
        data['busID'], departure_times, data['rideFrom_ja'], data['rideFrom_en'], data['rideFrom_img'],
        data['destination_ja'], data['destination_en'], data['necessaryTime']);
      sortTimeTable("#scheduleBoard");
    });
  }
}

// Sort Timetalbe for Async Version
function sortTimeTable(tableID) {
  var container = document.querySelector(tableID);
  [].slice.call(container.querySelectorAll('li'))
    .map(function(v){
      var value = v.querySelector('.departureTime').innerHTML.replace(/<.+>/,'').replace(/\D/g,'') - 0;
      return { dom: v, value: value };
    })
    .sort(function(a, b){ return a.value - b.value; })
    .forEach(function(v){ container.appendChild(v.dom); });
}

// Add Items to Schedule Board
function addScheduleBoard(busID, departure_times, rideFrom_ja, rideFrom_en, rideFrom_img, destination_ja, destination_en, necessaryTime) {
  for (var i = 0; i < departure_times.length; i++) {
    $("#scheduleBoard").append(
      $("<li></li>")
        .append($("<span class='departureTime'></span>").text(departure_times[i]))
        .append($("<span class='busID'></span>").text("🚌 " + busID))
        .append($("<span class='necessaryTime'></span>").text(" ⏱" + necessaryTime + "min/分" ))
        .append($("<br><span class='rideFrom'></span>").text("🚏" + rideFrom_ja + "/" + rideFrom_en + " ➡️ 🚏" + destination_ja + "/" + destination_en))
    )
  }
}

// Holiday Judgment
function isHoliday(today) {
  var todayNum = today.getDay();
  if (todayNum == 0 || todayNum == 6) return true;
  var todayStr = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0"+ today.getDate()).slice(-2)
  for (var holiday in holidays) {
    if (todayStr == holiday) return true;
  };
  return false;
}

// Determination on Departure
function get_recent_departure_time(now, departure_times) {
  var answers = [];
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();
  for (var i = 0; i < departure_times.length; i++) {
    var tmp = departure_times[i].split(":");
    var dh = Number(tmp[0]);
    var dm = Number(tmp[1]);
    var pattern = new Date(year, month, day, dh, dm);
    if ((pattern - now) > 0) answers.push(departure_times[i]);
  };
  return answers;
}
