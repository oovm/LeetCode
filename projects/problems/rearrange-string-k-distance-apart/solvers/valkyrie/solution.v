namespace leetcode.rearrange_string_k_distance_apart;

using std.collection;
using std.text;

# 堆键 = 剩余次数 * 32 + (25 - 字母序号)：取负入 `BinaryHeap<i64>`，
# 弹序即 (次数降序、字母升序)，与 Python 的 `(-v, c)` 最小堆一致。
# 冷却队列按先进先出记录 (次数 - 1, 字母序号)，队列长度达到 k 时把队首放回堆。
[export(case: "camelCase")]
micro rearrangeString(s: utf8, k: i64) -> utf8 {
    let n: usize = s.length()

    let mut counts: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        counts.push(0)
        i = i + 1
    }

    i = 0
    while i < n {
        let ch: char = s⁅i⁆
        let slot: usize = (ch as u32) as usize - 97
        counts.set((slot + 1) as isize, counts⁅slot⁆ + 1)
        i = i + 1
    }

    let mut heap: BinaryHeap<i64> = BinaryHeap::new()
    let mut code: usize = 0
    while code < 26 {
        let total: i64 = counts⁅code⁆
        if total > 0 {
            heap.push(0 - (total * 32 + (25 - code as i64)))
        }
        code = code + 1
    }

    let mut cooling: ArrayList<i64> = ArrayList::new(0)
    let mut head: usize = 0
    let mut answer: ArrayList<char> = ArrayList::new(n)

    while heap.length() > 0 {
        let key: i64 = 0 - heap.pop().unwrap()
        let slot: i64 = 25 - (key % 32)
        let total: i64 = key / 32
        answer.push(char::from((97 + slot) as u32))
        cooling.push((total - 1) * 32 + slot)

        let window: usize = cooling.length() - head
        if window as i64 >= k {
            let held: i64 = cooling⁅head⁆
            head = head + 1
            let remain: i64 = held / 32
            let at: i64 = held % 32
            if remain > 0 {
                heap.push(0 - (remain * 32 + (25 - at)))
            }
        }
    }

    if answer.length() != n {
        return ""
    }

    let mut builder: Utf8Builder = Utf8Builder::new(n)
    i = 0
    while i < n {
        builder.append(answer⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro rearrangeString(self, s: utf8, k: i64): utf8 {
        return rearrangeString(s, k)
    }
}
