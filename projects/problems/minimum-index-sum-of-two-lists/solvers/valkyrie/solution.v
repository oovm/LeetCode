namespace leetcode.minimum_index_sum_of_two_lists;

using std.collection;

# 理想写法是两阶段：先建 list1 的「词 → 下标」表，再扫 list2 求最小下标和，
# 最后按 list1 顺序收集并列餐馆，返回值天然满足「并列时按 list1 顺序」的题面要求。
[export(case: "camelCase")]
micro findRestaurant(list1: ArrayList<utf8>, list2: ArrayList<utf8>) -> ArrayList<utf8> {
    let mut index_of: HashMap<utf8, i64> = HashMap::new(list1.length())
    let mut i: usize = 0
    while i < list1.length() {
        index_of.insert(list1⁅i⁆, i as i64)
        i = i + 1
    }

    let mut best: i64 = 0 - 1
    let mut j: usize = 0
    while j < list2.length() {
        let word: utf8 = list2⁅j⁆
        if index_of.contains_key(word) {
            let total: i64 = index_of.get(word).unwrap() + j as i64
            if best < 0 || total < best {
                best = total
            }
        }
        j = j + 1
    }

    let mut result: ArrayList<utf8> = ArrayList::new(list1.length())
    let mut k: usize = 0
    while k < list1.length() {
        let word: utf8 = list1⁅k⁆
        if index_of.contains_key(word) {
            if index_of.get(word).unwrap() + k as i64 == best {
                result.push(word)
            }
        }
        k = k + 1
    }
    return result
}

class Solution {
    micro findRestaurant(self, list1: ArrayList<utf8>, list2: ArrayList<utf8>): ArrayList<utf8> {
        return findRestaurant(list1, list2)
    }
}
