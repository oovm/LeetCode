namespace leetcode.accounts_merge;

using std.collection;

# 字典序比较：std 的 utf8 没有 compare，Comparable 也尚未落地（G13/G15），
# 按 UTF-8 字节逐字节比较（等长前缀后短者小）。
micro compare_text(left: utf8, right: utf8) -> i32 {
    let left_length: usize = left.byte_length()
    let right_length: usize = right.byte_length()
    let mut offset: usize = 0
    while offset < left_length && offset < right_length {
        let left_byte: u32 = left.byte_at(offset) as u32
        let right_byte: u32 = right.byte_at(offset) as u32
        if left_byte < right_byte {
            return -1
        }
        if left_byte > right_byte {
            return 1
        }
        offset = offset + 1
    }
    if left_length < right_length {
        return -1
    }
    if left_length > right_length {
        return 1
    }
    return 0
}

# 同一邮箱把账户并成一组；组内邮箱去重排序，名字取组内首个账户。
[export(case: "camelCase")]
micro accounts_merge(accounts: ArrayList<ArrayList<utf8>>) -> ArrayList<ArrayList<utf8>> {
    let count: usize = accounts.length()
    let total: i64 = count as i64
    let mut sets: DisjointSet<i64> = DisjointSet::new()
    let mut index: i64 = 0
    while index < total {
        sets.add(index)
        index = index + 1
    }

    let mut owner: HashMap<utf8, i64> = HashMap::new(count)
    let mut i: usize = 0
    while i < count {
        let row: ArrayList<utf8> = accounts⁅i⁆
        let mut k: usize = 1
        while k < row.length() {
            let email: utf8 = row⁅k⁆
            if owner.contains_key(email) {
                sets.union(i as i64, owner.get(email).unwrap())
            } else {
                owner.insert(email, i as i64)
            }
            k = k + 1
        }
        i = i + 1
    }

    let mut merged: ArrayList<ArrayList<utf8>> = ArrayList::new(count)
    # HashSet 无容量构造（G12）。
    let mut grouped: HashSet<i64> = HashSet::new()
    i = 0
    while i < count {
        let root: i64 = sets.find_root(i as i64)
        if !grouped.contains(root) {
            grouped.insert(root)
            # 成员聚合（G10）与返回新序列的排序（G11）都应由 std 提供。
            let members: ArrayList<i64> = sets.group_members(root)
            let mut emails: ArrayList<utf8> = ArrayList::new(members.length())
            # HashSet 无容量构造（G12）。
            let mut seen: HashSet<utf8> = HashSet::new()
            loop member in members {
                let at: usize = member as usize
                let row: ArrayList<utf8> = accounts⁅at⁆
                let mut k: usize = 1
                while k < row.length() {
                    let email: utf8 = row⁅k⁆
                    if !seen.contains(email) {
                        seen.insert(email)
                        emails.push(email)
                    }
                    k = k + 1
                }
            }
            # 没有返回新序列的 `sorted_by`（G11），组内邮箱副本就地 `merge_sort`。
            merge_sort(emails, compare_text)
            let ordered: ArrayList<utf8> = emails
            # 代表名取并查集根账户，扫描下标 i 可能落在组内其它账户上。
            let first: ArrayList<utf8> = accounts⁅root as usize⁆
            let mut entry: ArrayList<utf8> = ArrayList::new(ordered.length() + 1)
            entry.push(first⁅0⁆)
            loop email in ordered {
                entry.push(email)
            }
            merged.push(entry)
        }
        i = i + 1
    }
    return merged
}

class Solution {
    micro accountsMerge(self, accounts: ArrayList<ArrayList<utf8>>): ArrayList<ArrayList<utf8>> {
        return accounts_merge(accounts)
    }
}
