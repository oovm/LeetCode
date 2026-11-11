namespace leetcode.accounts_merge;

using std.collection;

# `merge_sort` 的比较器入口；`utf8` 的字典序已由 `Utf8Text` 的 `Comparable` 合同提供，
# 这里只把 `Ordering` 交给 `natural_order` 转成 `i32`，不再手写逐字节比较。
micro compare_text(left: utf8, right: utf8) -> i32 {
    return natural_order(left, right)
}

# 同一邮箱把账户并成一组；组内邮箱去重排序，名字取并查集根账户。
# 这里按规模合并、同规模取右侧为根，与语料参照解的根选择一致；std DisjointSet
# 按秩合并且同秩取左侧，根账户会不同（语料 expected 以参照解根名为准）。
[export(case: "camelCase")]
micro accounts_merge(accounts: [[utf8]]) -> [[utf8]] {
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
        let row: [utf8] = accounts⁅index as usize⁆
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

    let mut merged: ArrayList<[utf8]> = ArrayList::new(count)
    let mut slot: i64 = 0
    while slot < group_count {
        let representative: i64 = root_of_slot⁅slot as usize⁆
        let mut emails: ArrayList<utf8> = ArrayList::new(count)
        # HashSet 无容量构造（G12）。
        let mut seen: HashSet<utf8> = HashSet::new()
        index = 0
        while index < total {
            if slot_of_account⁅index as usize⁆ == slot {
                let row: [utf8] = accounts⁅index as usize⁆
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
        # 组内邮箱副本就地 `merge_sort`，比较器走 `Utf8Text` 的 `Comparable` 合同（`natural_order`）。
        merge_sort(emails, compare_text)
        let first: [utf8] = accounts⁅representative as usize⁆
        let mut entry: ArrayList<utf8> = ArrayList::new(emails.length() + 1)
        entry.push(first⁅0⁆)
        loop email in emails {
            entry.push(email)
        }
        merged.push(entry.to_array())
        slot = slot + 1
    }
    return merged.to_array()
}

class Solution {
    micro accountsMerge(self, accounts: [[utf8]]): [[utf8]] {
        return accounts_merge(accounts)
    }
}
