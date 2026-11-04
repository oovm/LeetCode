namespace leetcode.groups_of_special_equivalent_strings;

using std.collection;

micro cmp_char(a: char, b: char) -> i32 {
    let left: u32 = a as u32
    let right: u32 = b as u32
    if left < right {
        return -1
    }
    if left > right {
        return 1
    }
    return 0
}

# 键 = 偶数位字符排序后 + 奇数位字符排序后；两项可交换，同键即特殊等价。
micro special_key(word: utf8) -> utf8 {
    let mut even: ArrayList<char> = ArrayList::new(word.length())
    let mut odd: ArrayList<char> = ArrayList::new(word.length())
    let mut i: usize = 0
    while i < word.length() {
        let c: char = word⁅i⁆
        if i % 2 == 0 {
            even.push(c)
        } else {
            odd.push(c)
        }
        i = i + 1
    }

    merge_sort(even, cmp_char)
    merge_sort(odd, cmp_char)

    let mut builder: Utf8Builder = Utf8Builder::new(word.length())
    loop c in even {
        builder.append(c)
    }
    loop c in odd {
        builder.append(c)
    }
    return builder.build()
}

[export(case: "camelCase")]
micro num_special_equiv_groups(words: ArrayList<utf8>) -> i64 {
    let mut groups: HashSet<utf8> = HashSet::new()
    loop word in words {
        groups.insert(special_key(word))
    }
    return groups.length() as i64
}

class Solution {
    micro numSpecialEquivGroups(self, words: ArrayList<utf8>): i64 {
        return num_special_equiv_groups(words)
    }
}
