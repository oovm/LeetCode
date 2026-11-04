namespace leetcode.longest_happy_string;

using std.collection;
using std.text;

# 只有三个候选，直接按 (剩余次数降序、字符升序) 选最优，
# 与 Python 里 `(-count, char)` 最小堆的弹序完全一致。
# 若最优字符已连续出现两次，则改选次优字符，最优字符本次不消耗。
micro pick_best(counts: ArrayList<i64>, banned: i64) -> i64 {
    let mut best: i64 = -1
    let mut code: i64 = 0
    while code < 3 {
        if code != banned && counts⁅code as usize⁆ > 0 {
            if best < 0 || counts⁅code as usize⁆ > counts⁅best as usize⁆ {
                best = code
            }
        }
        code = code + 1
    }
    return best
}

[export(case: "camelCase")]
micro longestDiverseString(a: i64, b: i64, c: i64) -> utf8 {
    let mut counts: ArrayList<i64> = ArrayList::new(3)
    counts.push(a)
    counts.push(b)
    counts.push(c)

    let mut answer: ArrayList<char> = ArrayList::new(0)
    while true {
        let cur: i64 = pick_best(counts, -1)
        if cur < 0 {
            break
        }

        let mut chosen: i64 = cur
        let length: usize = answer.length()
        if length >= 2 {
            let current_code: u32 = (97 + cur) as u32
            let last_code: u32 = answer⁅length - 1⁆ as u32
            let previous_code: u32 = answer⁅length - 2⁆ as u32
            if last_code == current_code && previous_code == current_code {
                let nxt: i64 = pick_best(counts, cur)
                if nxt < 0 {
                    break
                }
                chosen = nxt
            }
        }

        answer.push(char::from((97 + chosen) as u32))
        counts.set((chosen + 1) as isize, counts⁅chosen as usize⁆ - 1)
    }

    let mut builder: Utf8Builder = Utf8Builder::new(answer.length())
    let mut i: usize = 0
    while i < answer.length() {
        builder.append(answer⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro longestDiverseString(self, a: i64, b: i64, c: i64): utf8 {
        return longestDiverseString(a, b, c)
    }
}
