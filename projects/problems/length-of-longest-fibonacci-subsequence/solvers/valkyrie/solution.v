namespace leetcode.length_of_longest_fibonacci_subsequence;

using std.collection;

# 以 (前一项下标, 当前项下标) 为状态做 DP，值到下标的哈希让每次转移 O(1)，
# 总复杂度 O(n^2)。
[export(case: "camelCase")]
micro lenLongestFibSubseq(arr: ArrayList<i64>) -> i64 {
    let n: i64 = arr.length() as i64
    let mut position: HashMap<i64, i64> = HashMap::new(n as usize)
    let mut i: i64 = 0
    while i < n {
        position.insert(arr⁅i as usize⁆, i)
        i = i + 1
    }

    let mut lengths: HashMap<i64, i64> = HashMap::new((n * n) as usize)
    let mut best: i64 = 0
    let mut current: i64 = 1
    while current < n {
        let b: i64 = arr⁅current as usize⁆
        let mut previous: i64 = 0
        while previous < current {
            let a: i64 = arr⁅previous as usize⁆
            let target: i64 = b - a
            if position.contains_key(target) {
                let base: i64 = position.get(target).unwrap()
                if base < previous {
                    let key: i64 = base * n + previous
                    let mut length: i64 = 2
                    if lengths.contains_key(key) {
                        length = lengths.get(key).unwrap()
                    }
                    let next_length: i64 = length + 1
                    lengths.insert(previous * n + current, next_length)
                    if next_length > best {
                        best = next_length
                    }
                }
            }
            previous = previous + 1
        }
        current = current + 1
    }
    return best
}

class Solution {
    micro lenLongestFibSubseq(self, arr: ArrayList<i64>): i64 {
        return lenLongestFibSubseq(arr)
    }
}
