namespace leetcode.number_of_boomerangs;

using std.collection;

# 逐点建距离桶：同距离的 m 个前驱点贡献 2m 个有序三元组（新点在尾或尾二）。
[export(case: "camelCase")]
micro numberOfBoomerangs(points: ArrayList<ArrayList<i64>>) -> i64 {
    let mut total: i64 = 0
    let n: usize = points.length()
    let mut i: usize = 0
    while i < n {
        let mut dist_count: HashMap<i64, i64> = HashMap::new(0)
        let mut j: usize = 0
        while j < n {
            if j != i {
                let dx: i64 = points⁅i⁆⁅0⁆ - points⁅j⁆⁅0⁆
                let dy: i64 = points⁅i⁆⁅1⁆ - points⁅j⁆⁅1⁆
                let d: i64 = dx * dx + dy * dy
                let mut prior: i64 = 0
                if dist_count.contains_key(d) {
                    prior = dist_count.get(d).unwrap()
                }
                total = total + 2 * prior
                dist_count.insert(d, prior + 1)
            }
            j = j + 1
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro numberOfBoomerangs(self, points: ArrayList<ArrayList<i64>>): i64 {
        return numberOfBoomerangs(points)
    }
}
