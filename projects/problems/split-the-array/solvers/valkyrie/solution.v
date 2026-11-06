namespace leetcode.split_the_array;

using std.collection;

# 能拆成两个各含互不相同元素的数组，等价于每个值出现次数不超过二。
[export(case: "camelCase")]
micro isPossibleToSplit(nums: ArrayList<i64>) -> bool {
    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length())
    loop value in nums {
        if counts.contains_key(value) {
            let next: i64 = counts.get(value).unwrap() + 1
            if next > 2 {
                return false
            }
            counts.insert(value, next)
        } else {
            counts.insert(value, 1)
        }
    }
    return true
}

class Solution {
    micro isPossibleToSplit(self, nums: ArrayList<i64>): bool {
        return isPossibleToSplit(nums)
    }
}
