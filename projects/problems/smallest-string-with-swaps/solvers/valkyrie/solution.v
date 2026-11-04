namespace leetcode.smallest_string_with_swaps;

using std.collection;

# 字符全序：std 的 char 既没有 `<` / `>`，也没有 `Comparable` 合同（G15/G13），
# 排序键只能退到 `as u32` 的码位比较。
micro compare_char(left: char, right: char) -> i32 {
    let left_code: u32 = left as u32
    let right_code: u32 = right as u32
    if left_code < right_code {
        return -1
    }
    if left_code > right_code {
        return 1
    }
    return 0
}

# 可交换的下标归同一分量；分量内字符排序后按原下标顺序回填。
[export(case: "camelCase")]
micro smallest_string_with_swaps(s: utf8, pairs: ArrayList<ArrayList<i64>>) -> utf8 {
    let mut chars: ArrayList<char> = ArrayList::new(s.length())
    loop character in s {
        chars.push(character)
    }

    let count: usize = chars.length()
    let total: i64 = count as i64
    let mut sets: DisjointSet<i64> = DisjointSet::new()
    let mut index: i64 = 0
    while index < total {
        sets.add(index)
        index = index + 1
    }

    loop pair in pairs {
        sets.union(pair⁅0⁆, pair⁅1⁆)
    }

    # 已产出的分量根。HashSet 无容量参数（G12）。
    let mut grouped: HashSet<i64> = HashSet::new()
    # ArrayList 没有定长占位写入，散写用映射承载。
    let mut slot: HashMap<i64, char> = HashMap::new(count)

    let mut cursor: usize = 0
    while cursor < count {
        let root: i64 = sets.find_root(cursor as i64)
        if !grouped.contains(root) {
            grouped.insert(root)
            # 分量成员聚合（G10）与返回新序列的排序（G11）都应由 std 提供。
            let members: ArrayList<i64> = sets.group_members(root)
            let mut letters: ArrayList<char> = ArrayList::new(members.length())
            loop member in members {
                let at: usize = member as usize
                letters.push(chars⁅at⁆)
            }
            # 没有返回新序列的 `sorted_by`（G11），分量内字符副本就地 `merge_sort`。
            merge_sort(letters, compare_char)
            let ordered: ArrayList<char> = letters
            let mut offset: usize = 0
            loop member in members {
                slot.insert(member, ordered⁅offset⁆)
                offset = offset + 1
            }
        }
        cursor = cursor + 1
    }

    let mut text: Utf8Builder = Utf8Builder::new(s.length())
    let mut write: usize = 0
    while write < count {
        text.append(slot.get(write as i64).unwrap())
        write = write + 1
    }
    return text.build()
}

class Solution {
    micro smallestStringWithSwaps(self, s: utf8, pairs: ArrayList<ArrayList<i64>>): utf8 {
        return smallest_string_with_swaps(s, pairs)
    }
}
