namespace leetcode.video_stitching;

using std.collection;

# 按每个起点记录最远终点，再从左到右区间覆盖计数，遇到断点即无解。
[export(case: "camelCase")]
micro video_stitching(clips: ArrayList<ArrayList<i64>>, time: i64) -> i64 {
    let mut last: ArrayList<i64> = ArrayList::new(time as usize)
    let mut fill: usize = 0
    while fill < time as usize {
        last.push(0)
        fill = fill + 1
    }
    let mut index: usize = 0
    while index < clips.length() {
        let start: i64 = clips⁅index⁆⁅0⁆
        let end: i64 = clips⁅index⁆⁅1⁆
        if start < time {
            let at: usize = start as usize
            if last⁅at⁆ < end {
                last⁅at⁆ = end
            }
        }
        index = index + 1
    }
    let mut pieces: i64 = 0
    let mut farthest: i64 = 0
    let mut covered_until: i64 = 0
    let mut cursor: i64 = 0
    while cursor < time {
        let reach: i64 = last⁅cursor as usize⁆
        if reach > farthest {
            farthest = reach
        }
        if farthest <= cursor {
            return -1
        }
        if covered_until == cursor {
            pieces = pieces + 1
            covered_until = farthest
        }
        cursor = cursor + 1
    }
    return pieces
}

class Solution {
    micro videoStitching(self, clips: ArrayList<ArrayList<i64>>, time: i64): i64 {
        return video_stitching(clips, time)
    }
}
