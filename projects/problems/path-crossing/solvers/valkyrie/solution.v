namespace leetcode.path_crossing;

# 坐标范围有限，平移到非负后编码成单键。
micro encode_point(x: i64, y: i64) -> i64 {
    return (x + 100000) * 200001 + (y + 100000)
}

[export(case: "camelCase")]
micro is_path_crossing(path: utf8) -> bool {
    let mut visited: HashMap<i64, i64> = HashMap::new(0)
    let mut x: i64 = 0
    let mut y: i64 = 0
    visited.insert(encode_point(x, y), 1)
    let mut i: usize = 0
    while i < path.length() {
        let code: u32 = path⁅i⁆ as u32
        if code == 78 {
            y = y + 1
        } else if code == 83 {
            y = y - 1
        } else if code == 69 {
            x = x + 1
        } else {
            x = x - 1
        }
        let key: i64 = encode_point(x, y)
        if visited.contains_key(key) {
            return true
        }
        visited.insert(key, 1)
        i = i + 1
    }
    return false
}

class Solution {
    micro isPathCrossing(self, path: utf8): bool {
        return is_path_crossing(path)
    }
}
