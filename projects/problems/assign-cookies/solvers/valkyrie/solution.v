namespace leetcode.assign_cookies;

micro cmp_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro find_content_children(mut g: ArrayList<i64>, mut s: ArrayList<i64>) -> i64 {
    quick_sort(g, cmp_i64)
    quick_sort(s, cmp_i64)
    let mut j: usize = 0
    let mut i: usize = 0
    while i < g.length() {
        let need: i64 = g⁅i⁆.unwrap()
        while j < s.length() && s⁅j⁆.unwrap() < need {
            j = j + 1
        }
        if j >= s.length() {
            return i as i64
        }
        j = j + 1
        i = i + 1
    }
    return g.length() as i64
}

class Solution {
    micro findContentChildren(mut self, g: ArrayList<i64>, s: ArrayList<i64>): i64 {
        return find_content_children(g, s)
    }
}
