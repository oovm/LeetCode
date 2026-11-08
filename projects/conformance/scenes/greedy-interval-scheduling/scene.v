namespace probe.greedy_interval_scheduling;

using std.collection

structure Meeting {
    start: i64
    end: i64
}

# 贪心：按结束时间升序，依次选择与上一个不重叠的会议。
micro cmp_end(left: Meeting, right: Meeting) -> i32 {
    if left.end < right.end {
        return -1
    }
    if right.end < left.end {
        return 1
    }
    return 0
}

micro max_non_overlapping(meetings: ArrayList<Meeting>) -> ArrayList<Meeting> {
    let mut ordered: ArrayList<Meeting> = ArrayList::new(meetings.length())
    loop meeting in meetings {
        ordered.push(meeting)
    }
    quick_sort(ordered, cmp_end)
    let mut chosen: ArrayList<Meeting> = ArrayList::new(ordered.length())
    let mut last_end: i64 = -1
    loop meeting in ordered {
        if meeting.start >= last_end {
            chosen.push(meeting)
            last_end = meeting.end
        }
    }
    return chosen
}

micro sample_meetings() -> ArrayList<Meeting> {
    let mut meetings: ArrayList<Meeting> = ArrayList::new(5)
    meetings.push(Meeting { start: 1, end: 4 })
    meetings.push(Meeting { start: 2, end: 5 })
    meetings.push(Meeting { start: 3, end: 6 })
    meetings.push(Meeting { start: 5, end: 7 })
    meetings.push(Meeting { start: 8, end: 9 })
    return meetings
}

[export(name: "maxMeetingCount")]
micro max_meeting_count() -> i64 {
    return max_non_overlapping(sample_meetings()).length() as i64
}

# 选中区间总跨度：(4-1) + (7-5) + (9-8) = 6。
[export(name: "scheduledSpan")]
micro scheduled_span() -> i64 {
    let mut total: i64 = 0
    loop meeting in max_non_overlapping(sample_meetings()) {
        total = total + meeting.end - meeting.start
    }
    return total
}

# 选中结束时间的十进编码：4、7、9。
[export(name: "chosenEndsCode")]
micro chosen_ends_code() -> i64 {
    let mut code: i64 = 0
    loop meeting in max_non_overlapping(sample_meetings()) {
        code = code * 10 + meeting.end
    }
    return code
}
