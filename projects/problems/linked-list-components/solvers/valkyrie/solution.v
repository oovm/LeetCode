namespace leetcode.linked_list_components;

using std.collection;

# 并集成员集合 O(m)，再顺序扫描链表统计连续段数 O(n)。
[export(case: "camelCase")]
micro num_components(head: [i64], nums: [i64]) -> i64 {
    let mut present: HashMap<i64, i64> = HashMap::new(nums.length())
    let mut i: usize = 0
    while i < nums.length() {
        present.insert(nums⁅i⁆, 1)
        i = i + 1
    }

    let mut components: i64 = 0
    let mut inside: bool = false
    let mut j: usize = 0
    while j < head.length() {
        if present.contains_key(head⁅j⁆) {
            if !inside {
                components = components + 1
            }
            inside = true
        } else {
            inside = false
        }
        j = j + 1
    }
    return components
}

class Solution {
    micro numComponents(self, head: [i64], nums: [i64]): i64 {
        return num_components(head, nums)
    }
}
