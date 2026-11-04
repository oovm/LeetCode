namespace leetcode.daily_temperatures;

using std.collection;

# 单调递减下标栈（`ArrayList` 当栈）：遇到更高温度就结算栈顶。
[export(case: "camelCase")]
micro dailyTemperatures(temperatures: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = temperatures.length()
    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        result.push(0)
        fill = fill + 1
    }

    let mut stack: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        while stack.is_empty() == false {
            let top: usize = stack.last().unwrap() as usize
            if temperatures⁅top⁆ >= temperatures⁅index⁆ {
                break
            }
            stack.pop()
            result.set((top + 1) as isize, index as i64 - top as i64)
        }
        stack.push(index as i64)
        index = index + 1
    }
    return result
}

class Solution {
    micro dailyTemperatures(self, temperatures: ArrayList<i64>): ArrayList<i64> {
        return dailyTemperatures(temperatures)
    }
}
