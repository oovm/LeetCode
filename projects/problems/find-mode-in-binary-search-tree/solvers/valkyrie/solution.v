namespace leetcode.find_mode_in_binary_search_tree;

# BST 的中序序列非降：先中序收集，再对连续相同值做游程统计，最大游程的值即众数。
micro collect(root: ArrayList<i64>, index: usize, out: ArrayList<i64>) -> unit {
    if index < root.length() {
        collect(root, 2 * index + 1, out)
        out.push(root⁅index⁆)
        collect(root, 2 * index + 2, out)
    }
}

[export(case: "camelCase")]
micro findMode(root: ArrayList<i64>) -> ArrayList<i64> {
    let mut values: ArrayList<i64> = ArrayList::new(root.length())
    collect(root, 0, values)

    let mut result: ArrayList<i64> = ArrayList::new(values.length())
    let mut best: i64 = 0
    let mut i: usize = 0
    while i < values.length() {
        let mut j: usize = i + 1
        let mut running: bool = true
        while running {
            if j >= values.length() {
                running = false
            }
            else {
                if values⁅j⁆ == values⁅i⁆ {
                    j = j + 1
                }
                else {
                    running = false
                }
            }
        }
        let count: i64 = (j - i) as i64
        if count > best {
            best = count
            result.clear()
            result.push(values⁅i⁆)
        }
        else {
            if count == best {
                result.push(values⁅i⁆)
            }
        }
        i = j
    }
    return result
}

class Solution {
    micro findMode(self, root: ArrayList<i64>): ArrayList<i64> {
        return findMode(root)
    }
}
