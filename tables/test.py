# coding: utf-8
import json
import datetime

holidays = None
with open("holidays.json") as data:
    tmp = json.load(data)
    holidays = tmp['holidays'].keys()

def is_holiday(now=datetime.datetime.now()):
    u"""
    Weekdayであれば True, そうでなければFalseを返す
    """
    today_str = now.strftime("%Y-%m-%d")
    if today_str in holidays:
        return True
    else:
        return False


def is_departed(now=datetime.datetime.now(), case=None):
    u"""
    発車済みかどうか？
    """
    delta = (case - now).total_seconds()
    if delta > 0:
        return True
    else:
        return False


def get_recent_departure_times(now=datetime.datetime.now(), times=None):
    answers = []
    for departure_times in times.values():
        for departure_time in departure_times:
            dt, dm = departure_time.split(':')
            case = datetime.datetime(now.year, now.month, now.day, int(dt), int(dm))
            if is_departed(now, case):
                answers.append(departure_time)
    return answers


timetable = None
with open("2.json") as data:
    timetable = json.load(data)

pattern = "holiday" if is_holiday else "weekday"
departure_times = get_recent_departure_times(times=timetable[pattern])

print(departure_times)
