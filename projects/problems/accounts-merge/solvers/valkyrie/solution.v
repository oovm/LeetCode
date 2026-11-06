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

# 同一邮箱把账户并成一组；组内邮箱去重排序，名字取并查集根账户。
# 这里按规模合并、同规模取右侧为根，与语料参照解的根选择一致；std DisjointSet
# 按秩合并且同秩取左侧，根账户会不同（语料 expected 以参照解根名为准）。
[export(case: "camelCase")]
micro accounts_merge(accounts: ArrayList<ArrayList<utf8>>) -> ArrayList<ArrayList<utf8>> {
    let count: usize = accounts.length()
    let total: i64 = count as i64

    let mut parent: ArrayList<i64> = ArrayList::new(count)
    let mut scale: ArrayList<i64> = ArrayList::new(count)
    let mut index: i64 = 0
    while index < total {
        parent.push(index)
        scale.push(1)
        index = index + 1
    }

    let mut owner: HashMap<utf8, i64> = HashMap::new(count)
    index = 0
    while index < total {
        let row: ArrayList<utf8> = accounts⁅index as usize⁆
        let mut k: usize = 1
        while k < row.length() {
            let email: utf8 = row⁅k⁆
            if owner.contains_key(email) {
                let mut left_root: i64 = index
                while parent⁅left_root as usize⁆ != left_root {
                    left_root = parent⁅left_root as usize⁆
                }
                let mut right_root: i64 = owner.get(email).unwrap()
                while parent⁅right_root as usize⁆ != right_root {
                    right_root = parent⁅right_root as usize⁆
                }
                if left_root != right_root {
                    if scale⁅left_root as usize⁆ > scale⁅right_root as usize⁆ {
                        parent⁅right_root as usize⁆ = left_root
                        scale⁅left_root as usize⁆ = scale⁅left_root as usize⁆ + scale⁅right_root as usize⁆
                    } else {
                        parent⁅left_root as usize⁆ = right_root
                        scale⁅right_root as usize⁆ = scale⁅right_root as usize⁆ + scale⁅left_root as usize⁆
                    }
                }
            } else {
                owner.insert(email, index)
            }
            k = k + 1
        }
        index = index + 1
    }

    # 先按账户扫描顺序给根分配组槽位，再按槽位聚合邮箱，避免原地改写内层数组。
    let mut group_slot: HashMap<i64, i64> = HashMap::new(count)
    let mut root_of_slot: ArrayList<i64> = ArrayList::new(count)
    let mut slot_of_account: ArrayList<i64> = ArrayList::new(count)
    let mut group_count: i64 = 0
    index = 0
    while index < total {
        let mut root: i64 = index
        while parent⁅root as usize⁆ != root {
            root = parent⁅root as usize⁆
        }
        if group_slot.contains_key(root) {
            slot_of_account.push(group_slot.get(root).unwrap())
        } else {
            group_slot.insert(root, group_count)
            root_of_slot.push(root)
            slot_of_account.push(group_count)
            group_count = group_count + 1
        }
        index = index + 1
    }

    let mut merged: ArrayList<ArrayList<utf8>> = ArrayList::new(count)
    let mut slot: i64 = 0
    while slot < group_count {
        let representative: i64 = root_of_slot⁅slot as usize⁆
        let mut emails: ArrayList<utf8> = ArrayList::new(count)
        # HashSet 无容量构造（G12）。
        let mut seen: HashSet<utf8> = HashSet::new()
        index = 0
        while index < total {
            if slot_of_account⁅index as usize⁆ == slot {
                let row: ArrayList<utf8> = accounts⁅index as usize⁆
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
            index = index + 1
        }
        # 没有返回新序列的 `sorted_by`（G11），组内邮箱副本就地 `merge_sort`。
        merge_sort(emails, compare_text)
        let first: ArrayList<utf8> = accounts⁅representative as usize⁆
        let mut entry: ArrayList<utf8> = ArrayList::new(emails.length() + 1)
        entry.push(first⁅0⁆)
        loop email in emails {
            entry.push(email)
        }
        merged.push(entry)
        slot = slot + 1
    }
    return merged
}

class Solution {
    micro accountsMerge(self, accounts: ArrayList<ArrayList<utf8>>): ArrayList<ArrayList<utf8>> {
        return accounts_merge(accounts)
    }
}
