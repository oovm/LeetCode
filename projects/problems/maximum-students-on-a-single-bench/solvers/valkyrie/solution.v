namespace leetcode.maximum_students_on_a_single_bench;

using std.collection;

# 先按（学生, 长椅）去重，再统计每张长椅上的不同学生数并取最大值。
[export(case: "camelCase")]
micro maxStudentsOnBench(students: ArrayList<ArrayList<i64>>) -> i64 {
    let mut pairs: HashMap<i64, i64> = HashMap::new(0)
    let mut benches: HashMap<i64, i64> = HashMap::new(0)
    let mut best: i64 = 0
    let mut position: usize = 0
    while position < students.length() {
        let student: i64 = students⁅position⁆⁅0⁆
        let bench: i64 = students⁅position⁆⁅1⁆
        let key: i64 = student * 1000000001 + bench
        if !pairs.contains_key(key) {
            pairs.insert(key, 1)
            let mut count: i64 = 1
            if benches.contains_key(bench) {
                count = benches.get(bench).unwrap() + 1
            }
            benches.insert(bench, count)
            if count > best {
                best = count
            }
        }
        position = position + 1
    }
    return best
}

class Solution {
    micro maxStudentsOnBench(self, students: ArrayList<ArrayList<i64>>): i64 {
        return maxStudentsOnBench(students)
    }
}
