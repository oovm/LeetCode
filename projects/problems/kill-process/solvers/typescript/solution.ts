export class Solution {
    killProcess(pid: number[], ppid: number[], kill: number): number[] {
        const children = new Map<number, number[]>();
        pid.forEach((identifier, index) => {
            if (!children.has(identifier)) {
                children.set(identifier, []);
            }
            const parent = ppid[index];
            const bucket = children.get(parent);
            if (bucket) {
                bucket.push(identifier);
            } else {
                children.set(parent, [identifier]);
            }
        });
        const out: number[] = [];
        const stack: number[] = [kill];
        while (stack.length > 0) {
            const node = stack.pop() as number;
            out.push(node);
            const bucket = children.get(node);
            if (bucket) {
                for (let index = bucket.length - 1; index >= 0; index--) {
                    stack.push(bucket[index]);
                }
            }
        }
        return out;
    }
}
