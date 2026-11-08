namespace probe.interval_merge;

using std.collection

structure Interval {
    start: i64
    end: i64
}

micro cmp_start(left: Interval, right: Interval) -> i32 {
    if left.start < right.start {
        return -1
    }
    if right.start < left.start {
        return 1
    }
    return 0
}

micro larger(left: i64, right: i64) -> i64 {
    if left < right {
        return right
    }
    return left
}

micro merge_intervals(intervals: ArrayList<Interval>) -> ArrayList<Interval> {
    let mut ordered: ArrayList<Interval> = ArrayList::new(intervals.length())
    loop interval in intervals {
        ordered.push(interval)
    }
    quick_sort(ordered, cmp_start)
    let mut merged: ArrayList<Interval> = ArrayList::new(ordered.length())
    loop interval in ordered {
        if merged.length() == 0 {
            merged.push(interval)
        } else {
            let last_index: usize = merged.length() - 1
            let last: Interval = merged⁅last_index⁆
            if last.end < interval.start {
                merged.push(interval)
            } else {
                merged.set_cardinal(last_index, Interval { start: last.start, end: larger(last.end, interval.end) })
            }
        }
    }
    return merged
}

micro interval_probe() -> ArrayList<Interval> {
    let mut rows: ArrayList<Interval> = ArrayList::new(4)
    rows.push(Interval { start: 1, end: 3 })
    rows.push(Interval { start: 8, end: 10 })
    rows.push(Interval { start: 2, end: 6 })
    rows.push(Interval { start: 15, end: 18 })
    return rows
}

[export(name: "mergedIntervalCount")]
micro merged_interval_count() -> i64 {
    return merge_intervals(interval_probe()).length() as i64
}

[export(name: "mergedTotalLength")]
micro merged_total_length() -> i64 {
    let mut total: i64 = 0
    loop interval in merge_intervals(interval_probe()) {
        total = total + interval.end - interval.start
    }
    return total
}
