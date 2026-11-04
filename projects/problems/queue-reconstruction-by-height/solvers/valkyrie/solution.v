namespace leetcode.queue_reconstruction_by_height;

using std.collection;

# 身高降序、同身高 k 升序，再逐个按 k 插入：高个子先就位，矮个子插到第 k 个高个子前面即定局。
# 题内触发点: G11 —— 排序入口只收 `ArrayList<T>`，`Array<[i64]>`（二维定长）没有 `sorted_by`；
# 这里对 `ArrayList<ArrayList<i64>>` 排序，比较器逐字段比较，不依赖 `Array` 的排序面。
# 顺带确认 `ArrayList.insert(ordinal, value)` 的语义是「先位置、后元素」，与 TS `splice(k, 0, p)` 同向
# （观察 2 记录的参数语义清单第 2 条）。
[export(case: "camelCase")]
micro reconstruct_queue(people: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let ordered: ArrayList<ArrayList<i64>> = sorted_by(people, micro(a: ArrayList<i64>, b: ArrayList<i64>) -> i32 {
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
    })

    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    let mut i: usize = 0
    while i < ordered.length() {
        let person: ArrayList<i64> = ordered⁅i⁆
        let at: usize = person⁅1⁆ as usize
        result.insert(at, person)
        i = i + 1
    }
    return result
}

class Solution {
    micro reconstructQueue(self, people: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return reconstruct_queue(people)
    }
}
