namespace leetcode.custom_sort_string;

using std.collection;

# 基准期望的排法：order 内字符取 order 中的位置为键，order 外字符键为 0，
# 稳定排序后同键字符保持 s 中的相对次序。
micro rank_of(priority: HashMap<char, i64>, character: char) -> i64 {
    if priority.contains_key(character) {
        return priority.get(character).unwrap()
    }
    return 0
}

[export(case: "camelCase")]
micro custom_sort_string(order: utf8, s: utf8) -> utf8 {
    # char 作映射键需要 Hash，std 尚未实现（G17）。
    let mut priority: HashMap<char, i64> = HashMap::new(order.length())
    let mut position: i64 = 0
    loop character in order {
        priority.insert(character, position)
        position = position + 1
    }

    let mut letters: ArrayList<char> = ArrayList::new(s.length())
    loop character in s {
        letters.push(character)
    }

    # 返回新序列的稳定排序（G11）。
    let ordered: ArrayList<char> = sorted_by(letters, micro(left: char, right: char) -> i32 {
        let left_rank: i64 = rank_of(priority, left)
        let right_rank: i64 = rank_of(priority, right)
        if left_rank < right_rank {
            return -1
        }
        if left_rank > right_rank {
            return 1
        }
        return 0
    })

    let mut text: Utf8Builder = Utf8Builder::new(s.length())
    loop character in ordered {
        text.append(character)
    }
    return text.build()
}

class Solution {
    micro customSortString(self, order: utf8, s: utf8): utf8 {
        return custom_sort_string(order, s)
    }
}
