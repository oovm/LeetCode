namespace leetcode.remove_duplicates_from_sorted_array_ii;

using std.collection;

# 有序序列的原地压缩：读写指针 + 零拷贝窗口写穿，允许每个值最多出现两次。
# 题内触发点: `ArrayList.view()` 是本批首次压到的零拷贝写侧入口（区别于 `array_view` 全窗构造）。
[export(case: "camelCase")]
micro remove_duplicates(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    if count == 0 {
        return 0
    }

    let mut window: ArrayView<i64> = nums.view()
    let mut write: usize = 0
    let mut read: usize = 0
    while read < count {
        let value: i64 = window⁅read⁆
        if write < 2 || window⁅write - 2⁆ != value {
            window⁅write⁆ = value
            write = write + 1
        }
        read = read + 1
    }
    return write as i64
}

class Solution {
    micro removeDuplicates(self, nums: ArrayList<i64>): i64 {
        return remove_duplicates(nums)
    }
}
