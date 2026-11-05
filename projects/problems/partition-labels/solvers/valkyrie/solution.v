namespace leetcode.partition_labels;

using std.collection;

# 先记每个字符最后出现的位置，再扫描一遍：区间右端随字符最后一次出现扩张，
# 走到右端时切出一段。O(|s|)。
[export(case: "camelCase")]
micro partition_labels(s: utf8) -> ArrayList<i64> {
    let mut last: ArrayList<i64> = ArrayList::new(26)
    let mut slot: i64 = 0
    while slot < 26 {
        last.push(0)
        slot = slot + 1
    }
    let size: usize = s.byte_length()
    let mut index: usize = 0
    while index < size {
        let code: usize = (s.byte_at(index) as i64 - 97) as usize
        last⁅code⁆ = index as i64
        index = index + 1
    }

    let mut out: ArrayList<i64> = ArrayList::new(26)
    let mut start: usize = 0
    let mut end: i64 = 0
    index = 0
    while index < size {
        let code: usize = (s.byte_at(index) as i64 - 97) as usize
        if last⁅code⁆ > end {
            end = last⁅code⁆
        }
        if (index as i64) == end {
            out.push(end - start as i64 + 1)
            start = index + 1
        }
        index = index + 1
    }
    return out
}

class Solution {
    micro partitionLabels(self, s: utf8): ArrayList<i64> {
        return partition_labels(s)
    }
}
