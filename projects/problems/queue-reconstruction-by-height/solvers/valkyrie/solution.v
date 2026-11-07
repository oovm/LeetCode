namespace leetcode.queue_reconstruction_by_height;

using std.collection;

# 身高降序、同身高 k 升序，再逐个按 k 插入：高个子先就位，矮个子插到第 k 个高个子前面即定局。
# 题内触发点: G11 —— 排序入口只收 `ArrayList<T>`，`Array<[i64]>`（二维定长）没有 `sorted_by`；
# 这里对 `ArrayList<ArrayList<i64>>` 排序，比较器逐字段比较，不依赖 `Array` 的排序面。
# 顺带确认 `ArrayList.insert(ordinal, value)` 是 1 基序数：`ordinal == 0` 直接返回，
# 题面 k（0 基）必须映射为 `k + 1` 才能插到第 k 个高个子前面。
micro compare_people(a: ArrayList<i64>, b: ArrayList<i64>) -> i32 {
    let height_a: i64 = a⁅0⁆
    let height_b: i64 = b⁅0⁆
    if height_a > height_b {
        return -1
    }
    if height_a < height_b {
        return 1
    }
    let ahead_a: i64 = a⁅1⁆
    let ahead_b: i64 = b⁅1⁆
    if ahead_a < ahead_b {
        return -1
    }
    if ahead_a > ahead_b {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro reconstruct_queue(people: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    # 没有返回新序列的 `sorted_by`（G11）：先建副本，再就地 `merge_sort`，不改动入参。
    let count: usize = people.length()
    let mut ordered: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut i: usize = 0
    while i < count {
        ordered.push(people⁅i⁆)
        i = i + 1
    }
    merge_sort(ordered, compare_people)

    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    i = 0
    while i < ordered.length() {
        let person: ArrayList<i64> = ordered⁅i⁆
        let at: usize = person⁅1⁆ as usize
        if at >= result.length() {
            result.push(person)
        }
        else {
            result.insert(at + 1, person)
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro reconstructQueue(self, people: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return reconstruct_queue(people)
    }
}
