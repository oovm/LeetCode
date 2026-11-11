namespace leetcode.convert_the_temperature;

# 返回 [开尔文, 华氏度]；G2 浮点返回合同修复前无法构建。
[export(case: "camelCase")]
micro convert_temperature(celsius: f64) -> [f64] {
    let kelvin: f64 = celsius + 273.15
    let fahrenheit: f64 = celsius * 1.8 + 32.0
    let mut result: ArrayList<f64> = ArrayList::new(2)
    result.push(kelvin)
    result.push(fahrenheit)
    return result.to_array()
}

class Solution {
    micro convertTemperature(self, celsius: f64): [f64] {
        return convert_temperature(celsius)
    }
}
