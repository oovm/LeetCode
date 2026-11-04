export class Solution {
    findAllRecipes(recipes: string[], ingredients: string[][], supplies: string[]): string[] {
        // 反向图 ingredient -> 可用它做出的食谱，再对食谱记剩余原料数。
        // 从 supplies 出发按队列做 Kahn，剩余原料数归零即入队并计入答案。
        const graph = new Map<string, string[]>();
        const indegree = new Map<string, number>();
        for (let index = 0; index < recipes.length; index += 1) {
            const recipe = recipes[index];
            const needs = ingredients[index];
            indegree.set(recipe, needs.length);
            for (const ingredient of needs) {
                let targets = graph.get(ingredient);
                if (targets === undefined) {
                    targets = [];
                    graph.set(ingredient, targets);
                }
                targets.push(recipe);
            }
        }
        const queue: string[] = [...supplies];
        const answer: string[] = [];
        let head = 0;
        while (head < queue.length) {
            const item = queue[head];
            head += 1;
            const targets = graph.get(item);
            if (targets === undefined) {
                continue;
            }
            for (const recipe of targets) {
                const remaining = (indegree.get(recipe) ?? 0) - 1;
                indegree.set(recipe, remaining);
                if (remaining === 0) {
                    answer.push(recipe);
                    queue.push(recipe);
                }
            }
        }
        return answer;
    }
}
