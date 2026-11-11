namespace leetcode.find_all_k_distant_indices_in_an_array;

using std.collection;

# 每个等于 key 的下标把半径 k 的范围标记出来，最后按下标升序收集被标记位置。
[export(case: "camelCase")]
micro findKDistantIndices(nums: [i64], key: i64, k: i64) -> [i64] {
    let count: usize = nums.length()
    let mut marked: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        marked.push(0)
        index = index + 1
    }

    index = 0
    while index < count {
        if nums⁅index⁆ == key {
            let from: i64 = index as i64 - k
            let to: i64 = index as i64 + k
            let mut position: i64 = from
            while position <= to {
                if position >= 0 && position < count as i64 {
                    marked⁅position as usize⁆ = 1
                }
                position = position + 1
            }
        }
        index = index + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(count)
    index = 0
    while index < count {
        if marked⁅index⁆ == 1 {
            answer.push(index as i64)
        }
        index = index + 1
    }
    return answer.to_array()
}

class Solution {
    micro findKDistantIndices(self, nums: [i64], key: i64, k: i64): [i64] {
        return findKDistantIndices(nums, key, k)
    }
}
