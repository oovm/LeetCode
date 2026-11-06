namespace leetcode.minimum_absolute_difference;

using std.collection;

micro compare_ascending(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 排序后最小差必在相邻元素间，再收集所有达到该差值的相邻对。
[export(case: "camelCase")]
micro minimumAbsDifference(arr: ArrayList<i64>) -> ArrayList<ArrayList<i64>> {
    let ordered: ArrayList<i64> = sorted_by(arr, compare_ascending)
    let mut best: i64 = 0
    let mut position: usize = 1
    while position < ordered.length() {
        let gap: i64 = ordered⁅position⁆ - ordered⁅position - 1⁆
        if position == 1 {
            best = gap
        } else if gap < best {
            best = gap
        }
        position = position + 1
    }

    let mut answer: ArrayList<ArrayList<i64>> = ArrayList::new(arr.length())
    position = 1
    while position < ordered.length() {
        let gap: i64 = ordered⁅position⁆ - ordered⁅position - 1⁆
        if gap == best {
            let mut pair: ArrayList<i64> = ArrayList::new(2)
            pair.push(ordered⁅position - 1⁆)
            pair.push(ordered⁅position⁆)
            answer.push(pair)
        }
        position = position + 1
    }
    return answer
}

class Solution {
    micro minimumAbsDifference(self, arr: ArrayList<i64>): ArrayList<ArrayList<i64>> {
        return minimumAbsDifference(arr)
    }
}
