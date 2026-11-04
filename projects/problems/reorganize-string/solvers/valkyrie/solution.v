namespace leetcode.reorganize_string;

using std.collection;
using std.text;

# 频次分桶：桶下标是剩余次数，桶内保持字符首次出现的顺序，
# 等价于 Python `Counter.most_common()`（次数降序、同次数按首次出现）。
# 填表与参考解一致：先隔位填 0、2、4……，越过末尾后回到下标 1。
[export(case: "camelCase")]
micro reorganizeString(s: utf8) -> utf8 {
    let n: usize = s.length()
    if n == 0 {
        return ""
    }

    let mut counts: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        counts.push(0)
        i = i + 1
    }

    let mut order: ArrayList<char> = ArrayList::new(n)
    i = 0
    while i < n {
        let ch: char = s⁅i⁆
        let slot: usize = (ch as u32) as usize - 97
        let total: i64 = counts⁅slot⁆ + 1
        counts.set((slot + 1) as isize, total)
        if total == 1 {
            order.push(ch)
        }
        i = i + 1
    }

    let mut peak: i64 = 0
    let mut code: usize = 0
    while code < 26 {
        if counts⁅code⁆ > peak {
            peak = counts⁅code⁆
        }
        code = code + 1
    }
    if peak > ((n + 1) / 2) as i64 {
        return ""
    }

    let mut buckets: ArrayList<ArrayList<char>> = ArrayList::new(peak as usize + 1)
    let mut level: usize = 0
    while level <= peak as usize {
        let fresh: ArrayList<char> = ArrayList::new(0)
        buckets.push(fresh)
        level = level + 1
    }

    let mut o: usize = 0
    while o < order.length() {
        let ch: char = order⁅o⁆
        let slot: usize = (ch as u32) as usize - 97
        let total: usize = counts⁅slot⁆ as usize
        let mut bucket: ArrayList<char> = buckets⁅total⁆
        bucket.push(ch)
        buckets.set((total + 1) as isize, bucket)
        o = o + 1
    }

    let mut answer: ArrayList<char> = ArrayList::new(n)
    let mut z: usize = 0
    while z < n {
        answer.push(char::from(97))
        z = z + 1
    }

    let mut position: usize = 0
    let mut current: usize = peak as usize
    while current > 0 {
        let bucket: ArrayList<char> = buckets⁅current⁆
        let mut b: usize = 0
        while b < bucket.length() {
            let mut repeat: usize = 0
            while repeat < current {
                answer.set((position + 1) as isize, bucket⁅b⁆)
                position = position + 2
                if position >= n {
                    position = 1
                }
                repeat = repeat + 1
            }
            b = b + 1
        }
        current = current - 1
    }

    let mut builder: Utf8Builder = Utf8Builder::new(n)
    z = 0
    while z < n {
        builder.append(answer⁅z⁆)
        z = z + 1
    }
    return builder.build()
}

class Solution {
    micro reorganizeString(self, s: utf8): utf8 {
        return reorganizeString(s)
    }
}
