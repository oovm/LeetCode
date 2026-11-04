namespace leetcode.minimize_hamming_distance_after_swap_operations;

using std.collection;

# 下标并查集把可交换位置并成组，再逐组比较 source 与 target 的多重集合差异。
[export(case: "camelCase")]
micro minimumHammingDistance(source: ArrayList<i64>, target: ArrayList<i64>, allowedSwaps: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = source.length()

    let mut sets: DisjointSet<i64> = DisjointSet::new()
    let mut i: usize = 0
    while i < count {
        sets.add(i as i64)
        i = i + 1
    }

    i = 0
    while i < allowedSwaps.length() {
        let swap: ArrayList<i64> = allowedSwaps⁅i⁆
        sets.union(swap⁅0⁆, swap⁅1⁆)
        i = i + 1
    }

    # 按代表元把同组下标聚合到一起。
    let mut slot: HashMap<i64, i64> = HashMap::new(count)
    let mut groups: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    i = 0
    while i < count {
        let root: i64 = sets.find_root(i as i64)
        if slot.contains_key(root) {
            let at: usize = slot.get(root).unwrap() as usize
            let mut bucket: ArrayList<i64> = groups⁅at⁆
            bucket.push(i as i64)
            groups.set((at + 1) as isize, bucket)
        } else {
            slot.insert(root, groups.length() as i64)
            let mut bucket: ArrayList<i64> = ArrayList::new(0)
            bucket.push(i as i64)
            groups.push(bucket)
        }
        i = i + 1
    }

    # 组内先统计 source 值频次，再用 target 逐个消耗，负余量就是无法匹配的位置。
    let mut answer: i64 = 0
    let mut g: usize = 0
    while g < groups.length() {
        let members: ArrayList<i64> = groups⁅g⁆
        let mut counts: HashMap<i64, i64> = HashMap::new(members.length())

        let mut m: usize = 0
        while m < members.length() {
            let at: usize = members⁅m⁆ as usize
            let value: i64 = source⁅at⁆
            let mut seen: i64 = 0
            if counts.contains_key(value) {
                seen = counts.get(value).unwrap()
            }
            counts.insert(value, seen + 1)
            m = m + 1
        }

        m = 0
        while m < members.length() {
            let at: usize = members⁅m⁆ as usize
            let value: i64 = target⁅at⁆
            let mut seen: i64 = 0
            if counts.contains_key(value) {
                seen = counts.get(value).unwrap()
            }
            counts.insert(value, seen - 1)
            if seen - 1 < 0 {
                answer = answer + 1
            }
            m = m + 1
        }
        g = g + 1
    }
    return answer
}

class Solution {
    micro minimumHammingDistance(self, source: ArrayList<i64>, target: ArrayList<i64>, allowedSwaps: ArrayList<ArrayList<i64>>): i64 {
        return minimumHammingDistance(source, target, allowedSwaps)
    }
}
