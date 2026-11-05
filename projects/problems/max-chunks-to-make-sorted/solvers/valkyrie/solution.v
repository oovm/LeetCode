namespace leetcode.max_chunks_to_make_sorted;

using std.collection;

# 前缀最大值等于当前下标时，此前缀正好可以独立成一块，O(n)。
[export(case: "camelCase")]
micro max_chunks_to_sorted(arr: ArrayList<i64>) -> i64 {
    let neg: i64 = -1
    let mut running: i64 = neg
    let mut chunks: i64 = 0
    let mut index: i64 = 0
    while index < arr.length() as i64 {
        let value: i64 = arr⁅index as usize⁆
        if value > running {
            running = value
        }
        if running == index {
            chunks = chunks + 1
        }
        index = index + 1
    }
    return chunks
}

class Solution {
    micro maxChunksToSorted(self, arr: ArrayList<i64>): i64 {
        return max_chunks_to_sorted(arr)
    }
}
