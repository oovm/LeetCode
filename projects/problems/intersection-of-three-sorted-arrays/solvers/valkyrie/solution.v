namespace leetcode.intersection_of_three_sorted_arrays;

using std.collection;

# 三个有序数组的公共元素；以第一个数组为扫描源，命中且未收录才追加。
[export(case: "camelCase")]
micro arraysIntersection(arr1: ArrayList<i64>, arr2: ArrayList<i64>, arr3: ArrayList<i64>) -> ArrayList<i64> {
    let mut answer: ArrayList<i64> = ArrayList::new(arr1.length())
    loop value in arr1 {
        if arr2.contains(value) && arr3.contains(value) && !answer.contains(value) {
            answer.push(value)
        }
    }
    return answer
}

class Solution {
    micro arraysIntersection(self, arr1: ArrayList<i64>, arr2: ArrayList<i64>, arr3: ArrayList<i64>): ArrayList<i64> {
        return arraysIntersection(arr1, arr2, arr3)
    }
}
