namespace leetcode.circular_array_loop;

using std.collection;

# 环形同向环：快慢指针找环，排除自环；判过的链置 0 剪枝。
micro next_index(values: ArrayList<i64>, at: i64, length: i64) -> i64 {
    let mut raw: i64 = (at + values⁅at as usize⁆) % length
    if raw < 0 {
        raw = raw + length
    }
    return raw
}

[export(case: "camelCase")]
micro circularArrayLoop(nums: ArrayList<i64>) -> bool {
    let mut values: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        values.push(value)
    }
    let length: i64 = values.length() as i64
    let mut start: i64 = 0
    while start < length {
        if values⁅start as usize⁆ != 0 {
            let forward: bool = values⁅start as usize⁆ > 0
            let mut slow: i64 = start
            let mut fast: i64 = start
            let mut found: bool = false
            let mut running: bool = true
            while running {
                slow = next_index(values, slow, length)
                if values⁅slow as usize⁆ == 0 || (values⁅slow as usize⁆ > 0) != forward {
                    running = false
                } else {
                    fast = next_index(values, next_index(values, fast, length), length)
                    if values⁅fast as usize⁆ == 0 || (values⁅fast as usize⁆ > 0) != forward {
                        running = false
                    } else if fast == next_index(values, fast, length) && fast != slow {
                        running = false
                    } else if slow == fast {
                        if slow == next_index(values, slow, length) {
                            running = false
                        } else {
                            found = true
                            running = false
                        }
                    }
                }
            }
            if found {
                return true
            }
            let mut cursor: i64 = start
            while values⁅cursor as usize⁆ != 0 && (values⁅cursor as usize⁆ > 0) == forward {
                let step: i64 = next_index(values, cursor, length)
                values⁅cursor as usize⁆ = 0
                cursor = step
            }
        }
        start = start + 1
    }
    return false
}

class Solution {
    micro circularArrayLoop(self, nums: ArrayList<i64>): bool {
        return circularArrayLoop(nums)
    }
}
