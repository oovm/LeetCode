namespace leetcode.maximum_points_you_can_obtain_from_cards;

using std.collection;

# 取两端共 k 张等价于留下中间连续 n-k 张。总和减去最小窗口和，一趟 O(n)。
[export(case: "camelCase")]
micro maxScore(cardPoints: ArrayList<i64>, k: i64) -> i64 {
    let count: i64 = cardPoints.length() as i64
    let mut total: i64 = 0
    let mut i: i64 = 0
    while i < count {
        total = total + cardPoints⁅i as usize⁆
        i = i + 1
    }
    if k >= count {
        return total
    }

    let window_size: i64 = count - k
    let mut window: i64 = 0
    i = 0
    while i < window_size {
        window = window + cardPoints⁅i as usize⁆
        i = i + 1
    }
    let mut smallest: i64 = window
    while i < count {
        window = window + cardPoints⁅i as usize⁆ - cardPoints⁅(i - window_size) as usize⁆
        if window < smallest {
            smallest = window
        }
        i = i + 1
    }
    return total - smallest
}

class Solution {
    micro maxScore(self, cardPoints: ArrayList<i64>, k: i64): i64 {
        return maxScore(cardPoints, k)
    }
}
