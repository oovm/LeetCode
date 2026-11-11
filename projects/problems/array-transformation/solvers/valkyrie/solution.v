namespace leetcode.array_transformation;

using std.collection;

# 每轮按上一轮快照更新中间元素，直到不再变化。
[export(case: "camelCase")]
micro transformArray(arr: [i64]) -> [i64] {
    let count: usize = arr.length()
    let mut current: ArrayList<i64> = ArrayList::new(count)
    let mut position: usize = 0
    while position < count {
        current.push(arr⁅position⁆)
        position = position + 1
    }

    let mut changed: bool = true
    while changed {
        changed = false
        let mut previous: ArrayList<i64> = ArrayList::new(count)
        position = 0
        while position < count {
            previous.push(current⁅position⁆)
            position = position + 1
        }

        position = 1
        while position + 1 < count {
            let value: i64 = previous⁅position⁆
            if value < previous⁅position - 1⁆ {
                if value < previous⁅position + 1⁆ {
                    current⁅position⁆ = value + 1
                    changed = true
                }
            } else if value > previous⁅position - 1⁆ {
                if value > previous⁅position + 1⁆ {
                    current⁅position⁆ = value - 1
                    changed = true
                }
            }
            position = position + 1
        }
    }
    return current.to_array()
}

class Solution {
    micro transformArray(self, arr: [i64]): [i64] {
        return transformArray(arr)
    }
}
