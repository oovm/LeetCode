namespace leetcode.count_tested_devices_after_test_operations;

using std.collection;

# 按顺序模拟：电量高于已测试数时该设备通过并递增计数。
[export(case: "camelCase")]
micro countTestedDevices(batteryPercentages: ArrayList<i64>) -> i64 {
    let mut tested: i64 = 0
    let mut index: usize = 0
    while index < batteryPercentages.length() {
        let value: i64 = batteryPercentages⁅index⁆
        if value - tested > 0 {
            tested = tested + 1
        }
        index = index + 1
    }
    return tested
}

class Solution {
    micro countTestedDevices(self, batteryPercentages: ArrayList<i64>): i64 {
        return countTestedDevices(batteryPercentages)
    }
}
