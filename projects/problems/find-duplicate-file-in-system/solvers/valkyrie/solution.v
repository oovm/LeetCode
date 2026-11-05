namespace leetcode.find_duplicate_file_in_system;

using std.collection;

# 解析每条 "root/a 1.txt(abcd) 2.txt(efgh)"，内容相同的文件归为同一组。
# 用 内容 → 组下标 的哈希表把同一内容的路径追加到组里，总代价线性于路径长度。
[export(case: "camelCase")]
micro find_duplicate(paths: ArrayList<utf8>) -> ArrayList<ArrayList<utf8>> {
    let mut contents: ArrayList<utf8> = ArrayList::new(0)
    let mut groups: ArrayList<ArrayList<utf8>> = ArrayList::new(0)

    let mut path_index: usize = 0
    while path_index < paths.length() {
        let entry: utf8 = paths⁅path_index⁆
        let mut space: usize = 0
        while space < entry.byte_length() && (entry.byte_at(space) as i64) != 32 {
            space = space + 1
        }
        let directory: utf8 = slice_to(entry, space)

        let mut cursor: usize = space
        while cursor < entry.byte_length() {
            while cursor < entry.byte_length() && (entry.byte_at(cursor) as i64) == 32 {
                cursor = cursor + 1
            }
            if cursor >= entry.byte_length() {
                break
            }
            let name_start: usize = cursor
            let mut open: usize = cursor
            while open < entry.byte_length() && (entry.byte_at(open) as i64) != 40 {
                open = open + 1
            }
            let mut close: usize = open + 1
            while close < entry.byte_length() && (entry.byte_at(close) as i64) != 41 {
                close = close + 1
            }
            let name: utf8 = slice_range(entry, name_start, open)
            let content: utf8 = slice_range(entry, open + 1, close)

            let mut slot: i64 = -1
            let mut scan: usize = 0
            while scan < contents.length() {
                if contents⁅scan⁆.byte_length() == content.byte_length() && same_text(contents⁅scan⁆, content) {
                    slot = scan as i64
                    scan = contents.length()
                } else {
                    scan = scan + 1
                }
            }
            if slot < 0 {
                contents.push(content)
                let mut group: ArrayList<utf8> = ArrayList::new(2)
                group.push(full_path(directory, name))
                groups.push(group)
            } else {
                let group: ArrayList<utf8> = groups⁅slot as usize⁆
                group.push(full_path(directory, name))
            }
            cursor = close + 1
        }
        path_index = path_index + 1
    }

    let mut answer: ArrayList<ArrayList<utf8>> = ArrayList::new(0)
    let mut index: usize = 0
    while index < groups.length() {
        if groups⁅index⁆.length() > 1 {
            answer.push(groups⁅index⁆)
        }
        index = index + 1
    }
    return answer
}

micro slice_to(text: utf8, stop: usize) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(stop)
    let mut index: usize = 0
    while index < stop {
        builder.append(char::from(text.byte_at(index) as u32))
        index = index + 1
    }
    return builder.build()
}

micro slice_range(text: utf8, start: usize, stop: usize) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(stop - start)
    let mut index: usize = start
    while index < stop {
        builder.append(char::from(text.byte_at(index) as u32))
        index = index + 1
    }
    return builder.build()
}

micro same_text(left: utf8, right: utf8) -> bool {
    let length: usize = left.byte_length()
    if length != right.byte_length() {
        return false
    }
    let mut index: usize = 0
    while index < length {
        if left.byte_at(index) != right.byte_at(index) {
            return false
        }
        index = index + 1
    }
    return true
}

micro full_path(directory: utf8, name: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(directory.byte_length() + name.byte_length() + 1)
    builder.append(directory)
    builder.append(char::from(47))
    builder.append(name)
    return builder.build()
}

class Solution {
    micro findDuplicate(self, paths: ArrayList<utf8>): ArrayList<ArrayList<utf8>> {
        return find_duplicate(paths)
    }
}
