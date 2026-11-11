namespace leetcode.find_all_possible_recipes_from_given_supplies;

using std.collection;

# 文本相等按码元逐个比较，规避当前工具链缺失的字符串相等宿主合同。
micro same_text(left: utf8, right: utf8) -> bool {
    if left.length() == right.length() {
        let mut index: usize = 0
        while index < left.length() {
            let lhs: usize = left⁅index⁆ as usize
            let rhs: usize = right⁅index⁆ as usize
            if lhs == rhs {
                index = index + 1
            } else {
                return false
            }
        }
        return true
    }
    return false
}

#  Kahn 推进：队列从 supplies 开始，每处理一个材料就扫描所有食谱，
# 把还缺原料的食谱剩余数减一，归零的食谱立即入队并计入答案。
[export(case: "camelCase")]
micro findAllRecipes(recipes: [utf8], ingredients: [[utf8]], supplies: [utf8]) -> [utf8] {
    let count: usize = recipes.length()
    let mut remaining: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        let needs: [utf8] = ingredients⁅fill⁆
        remaining.push(needs.length() as i64)
        fill = fill + 1
    }

    let mut queue: ArrayList<utf8> = ArrayList::new(count + supplies.length())
    let mut supply_index: usize = 0
    while supply_index < supplies.length() {
        queue.push(supplies⁅supply_index⁆)
        supply_index = supply_index + 1
    }

    let mut answer: ArrayList<utf8> = ArrayList::new(count)
    let mut head: usize = 0
    while head < queue.length() {
        let item: utf8 = queue⁅head⁆
        head = head + 1

        let mut recipe_index: usize = 0
        while recipe_index < count {
            let left: i64 = remaining⁅recipe_index⁆
            if left > 0 {
                let needs: [utf8] = ingredients⁅recipe_index⁆
                let mut matched: bool = false
                let mut need_index: usize = 0
                while need_index < needs.length() {
                    let need: utf8 = needs⁅need_index⁆
                    if same_text(need, item) {
                        matched = true
                    }
                    need_index = need_index + 1
                }

                if matched {
                    let next_remaining: i64 = left - 1
                    remaining.set((recipe_index + 1) as isize, next_remaining)
                    if next_remaining == 0 {
                        let recipe: utf8 = recipes⁅recipe_index⁆
                        answer.push(recipe)
                        queue.push(recipe)
                    }
                }
            }
            recipe_index = recipe_index + 1
        }
    }
    return answer.to_array()
}

class Solution {
    micro findAllRecipes(self, recipes: [utf8], ingredients: [[utf8]], supplies: [utf8]): [utf8] {
        return findAllRecipes(recipes, ingredients, supplies)
    }
}
