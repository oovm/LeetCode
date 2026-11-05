namespace leetcode.pyramid_transition_matrix;

using std.collection;

# 把两字符底边编码成 676 槽的候选表，再逐层生成新行做 BFS，
# 已展开的行记入 visited，总代价与可达行数成线性。
micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

micro next_rows(row: utf8, tops: ArrayList<utf8>) -> ArrayList<utf8> {
    let mut rows: ArrayList<utf8> = ArrayList::new(1)
    rows.push(empty_text())
    let mut position: usize = 0
    while position + 1 < row.byte_length() {
        let key: i64 = ((row.byte_at(position) as i64) - 97) * 26 + ((row.byte_at(position + 1) as i64) - 97)
        let options: utf8 = tops⁅key as usize⁆
        if options.byte_length() == 0 {
            let mut none: ArrayList<utf8> = ArrayList::new(0)
            return none
        }
        let mut expanded: ArrayList<utf8> = ArrayList::new(rows.length() * options.byte_length())
        let mut row_index: usize = 0
        while row_index < rows.length() {
            let mut option: usize = 0
            while option < options.byte_length() {
                let mut builder: Utf8Builder = Utf8Builder::new(rows⁅row_index⁆.byte_length() + 1)
                builder.append(rows⁅row_index⁆)
                builder.append(char::from(options.byte_at(option) as u32))
                expanded.push(builder.build())
                option = option + 1
            }
            row_index = row_index + 1
        }
        rows = expanded
        position = position + 1
    }
    return rows
}

[export(case: "camelCase")]
micro pyramid_transition(bottom: utf8, allowed: ArrayList<utf8>) -> bool {
    let mut tops: ArrayList<utf8> = ArrayList::new(676)
    let mut slot: i64 = 0
    while slot < 676 {
        tops.push(empty_text())
        slot = slot + 1
    }
    let mut index: usize = 0
    while index < allowed.length() {
        let rule: utf8 = allowed⁅index⁆
        let key: i64 = ((rule.byte_at(0) as i64) - 97) * 26 + ((rule.byte_at(1) as i64) - 97)
        let mut builder: Utf8Builder = Utf8Builder::new(tops⁅key as usize⁆.byte_length() + 1)
        builder.append(tops⁅key as usize⁆)
        builder.append(char::from(rule.byte_at(2) as u32))
        tops⁅key as usize⁆ = builder.build()
        index = index + 1
    }

    let mut visited: HashSet<utf8> = HashSet::new()
    let mut queue: ArrayList<utf8> = ArrayList::new(1)
    queue.push(bottom)
    let mut head: usize = 0
    while head < queue.length() {
        let row: utf8 = queue⁅head⁆
        head = head + 1
        if row.byte_length() == 1 {
            return true
        }
        if visited.contains(row) {
            continue
        }
        visited.insert(row)
        let children: ArrayList<utf8> = next_rows(row, tops)
        let mut child: usize = 0
        while child < children.length() {
            queue.push(children⁅child⁆)
            child = child + 1
        }
    }
    return false
}

class Solution {
    micro pyramidTransition(self, bottom: utf8, allowed: ArrayList<utf8>): bool {
        return pyramid_transition(bottom, allowed)
    }
}
