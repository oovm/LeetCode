export class Solution {
    medianSlidingWindow(nums: number[], k: number): number[] {
        const ordered = [...nums].sort((a, b) => a - b);
        const unique: number[] = [];
        for (let index = 0; index < ordered.length; index += 1) {
            if (index === 0 || ordered[index] !== ordered[index - 1]) {
                unique.push(ordered[index]);
            }
        }

        const ranks = new Map<number, number>();
        unique.forEach((value, index) => ranks.set(value, index + 1));

        const size = unique.length;
        const tree = new Array<number>(size + 1).fill(0);
        const add = (position: number, delta: number): void => {
            let index = position;
            while (index <= size) {
                tree[index] += delta;
                index += index & -index;
            }
        };
        const kth = (target: number): number => {
            let step = 1;
            while (step * 2 <= size) {
                step *= 2;
            }
            let position = 0;
            let remaining = target;
            while (step > 0) {
                const next = position + step;
                if (next <= size && tree[next] < remaining) {
                    position = next;
                    remaining -= tree[next];
                }
                step = Math.floor(step / 2);
            }
            return unique[position];
        };
        const median = (): number => {
            if (k % 2 === 1) {
                return kth(Math.floor(k / 2) + 1);
            }
            const left = kth(k / 2);
            const right = kth(k / 2 + 1);
            return (left + right) / 2;
        };

        const answer: number[] = [];
        for (let index = 0; index < k; index += 1) {
            add(ranks.get(nums[index])!, 1);
        }
        answer.push(median());
        for (let index = k; index < nums.length; index += 1) {
            add(ranks.get(nums[index])!, 1);
            add(ranks.get(nums[index - k])!, -1);
            answer.push(median());
        }
        return answer;
    }
}
