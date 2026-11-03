namespace leetcode.subsets;

micro dfs(nums: ArrayList<i64>, i: usize, picked: ArrayList<i64>, out: ArrayList<ArrayList<i64>>) {
    if i == nums.length() {
        let mut copy: ArrayList<i64> = ArrayList::new(picked.length())
        let mut j: usize = 0
        while j < picked.length() {
            copy.push(picked⁅j⁆)
            j = j + 1
        }
        out.push(copy)
        return
    }
    dfs(nums, i + 1, picked, out)
    picked.push(nums⁅i⁆)
    dfs(nums, i + 1, picked, out)
    picked.pop()
}

[export(case: "camelCase")]
micro subsets(nums: ArrayList<i64>) -> ArrayList<ArrayList<i64>> {
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    let mut picked: ArrayList<i64> = ArrayList::new(nums.length())
    dfs(nums, 0, picked, out)
    return out
}

class Solution {
    micro subsets(self, nums: ArrayList<i64>): ArrayList<ArrayList<i64>> {
        return subsets(nums)
    }
}
