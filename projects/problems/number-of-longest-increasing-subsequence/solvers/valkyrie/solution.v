namespace leetcode.number_of_longest_increasing_subsequence;

using std.collection;

# 树状数组按值离散化维护 (最长长度, 方案数)：查询严格小于当前值的最大长度，
# 再把自己的 (长度+1, 计数) 合并进该值。总代价 O(n log n)。

micro cmp_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

micro merge(target_lengths: ArrayList<i64>, target_counts: ArrayList<i64>, slot: i64, length: i64, count: i64) -> unit {
    let at: usize = slot as usize
    if length > target_lengths⁅at⁆ {
        target_lengths⁅at⁆ = length
        target_counts⁅at⁆ = count
    } else if length == target_lengths⁅at⁆ {
        target_counts⁅at⁆ = target_counts⁅at⁆ + count
    }
}

micro query(lengths: ArrayList<i64>, counts: ArrayList<i64>, slot: i64, best_length: ArrayList<i64>, best_count: ArrayList<i64>) -> unit {
    let mut position: i64 = slot
    while position > 0 {
        let at: usize = position as usize
        merge(best_length, best_count, 0, lengths⁅at⁆, counts⁅at⁆)
        position = position - position.bit_and(0 - position)
    }
}

micro update(lengths: ArrayList<i64>, counts: ArrayList<i64>, size: i64, slot: i64, length: i64, count: i64) -> unit {
    let mut position: i64 = slot
    while position <= size {
        let at: usize = position as usize
        merge(lengths, counts, at, length, count)
        position = position + position.bit_and(0 - position)
    }
}

[export(case: "camelCase")]
micro find_number_of_lis(nums: ArrayList<i64>) -> i64 {
    let total: i64 = nums.length() as i64
    if total == 0 {
        return 0
    }
    let mut ordered: ArrayList<i64> = ArrayList::new(nums.length())
    let mut index: usize = 0
    while index < nums.length() {
        ordered.push(nums⁅index⁆)
        index = index + 1
    }
    quick_sort(ordered, cmp_i64)
    let mut distinct: ArrayList<i64> = ArrayList::new(nums.length())
    index = 0
    while index < ordered.length() {
        if distinct.length() == 0 || distinct⁅distinct.length() - 1⁆ != ordered⁅index⁆ {
            distinct.push(ordered⁅index⁆)
        }
        index = index + 1
    }
    let mut rank: HashMap<i64, i64> = HashMap::new(distinct.length())
    index = 0
    while index < distinct.length() {
        rank.insert(distinct⁅index⁆, (index + 1) as i64)
        index = index + 1
    }

    let size: i64 = distinct.length() as i64
    let mut lengths: ArrayList<i64> = ArrayList::new((size + 1) as usize)
    let mut counts: ArrayList<i64> = ArrayList::new((size + 1) as usize)
    let mut slot: i64 = 0
    while slot <= size {
        lengths.push(0)
        counts.push(0)
        slot = slot + 1
    }

    let mut global_length: i64 = 0
    let mut global_count: i64 = 0
    index = 0
    while index < nums.length() {
        let position: i64 = rank.get(nums⁅index⁆).unwrap()
        let mut best_length: ArrayList<i64> = ArrayList::new(1)
        let mut best_count: ArrayList<i64> = ArrayList::new(1)
        best_length.push(0)
        best_count.push(0)
        query(lengths, counts, position - 1, best_length, best_count)
        let mut length: i64 = best_length⁅0⁆ + 1
        let mut count: i64 = best_count⁅0⁆
        if count == 0 {
            count = 1
        }
        update(lengths, counts, size, position, length, count)
        if length > global_length {
            global_length = length
            global_count = count
        } else if length == global_length {
            global_count = global_count + count
        }
        index = index + 1
    }
    return global_count
}

class Solution {
    micro findNumberOfLIS(self, nums: ArrayList<i64>): i64 {
        return find_number_of_lis(nums)
    }
}
