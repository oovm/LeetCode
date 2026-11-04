namespace leetcode.permutation_in_string;

using std.collection;

# char 计数窗口的键需要 Hash（G17）；下标按字符取用 character_at，避免 utf8 的字节下标。
micro matches(need: HashMap<char, i64>, window: HashMap<char, i64>) -> bool {
    let keys: ArrayList<char> = need.keys()
    let mut i: usize = 0
    while i < keys.length() {
        let character: char = keys⁅i⁆
        let wanted: i64 = need.get(character).unwrap()
        let mut actual: i64 = 0
        if window.contains_key(character) {
            actual = window.get(character).unwrap()
        }
        if actual != wanted {
            return false
        }
        i = i + 1
    }
    return true
}

micro add_one(counts: HashMap<char, i64>, character: char) -> unit {
    if counts.contains_key(character) {
        let current: i64 = counts.get(character).unwrap()
        counts.insert(character, current + 1)
    } else {
        counts.insert(character, 1)
    }
}

micro remove_one(counts: HashMap<char, i64>, character: char) -> unit {
    let current: i64 = counts.get(character).unwrap()
    if current <= 1 {
        counts.remove(character)
    } else {
        counts.insert(character, current - 1)
    }
}

[export(case: "camelCase")]
micro check_inclusion(s1: utf8, s2: utf8) -> bool {
    let width: usize = s1.length()
    let total: usize = s2.length()
    if width > total {
        return false
    }

    let mut need: HashMap<char, i64> = HashMap::new(width)
    loop character in s1 {
        add_one(need, character)
    }

    let mut window: HashMap<char, i64> = HashMap::new(width)
    let mut i: usize = 0
    while i < width {
        add_one(window, s2.character_at(i))
        i = i + 1
    }

    if matches(need, window) {
        return true
    }

    i = width
    while i < total {
        add_one(window, s2.character_at(i))
        remove_one(window, s2.character_at(i - width))
        if matches(need, window) {
            return true
        }
        i = i + 1
    }
    return false
}

class Solution {
    micro checkInclusion(self, s1: utf8, s2: utf8): bool {
        return check_inclusion(s1, s2)
    }
}
