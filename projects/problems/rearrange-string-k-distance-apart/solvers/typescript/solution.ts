export class Solution {
    rearrangeString(s: string, k: number): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;

        // 候选按 (剩余次数降序, 字母升序) 取队首，等价于 Python 的 (-count, char) 最小堆。
        const pool: [number, number][] = [];
        for (let c = 0; c < 26; c++) {
            if (counts[c] > 0) pool.push([counts[c], c]);
        }
        const queue: [number, number][] = [];
        let head = 0;
        const out: string[] = [];
        while (pool.length > 0) {
            pool.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
            const [v, c] = pool.shift() as [number, number];
            out.push(String.fromCharCode(97 + c));
            queue.push([v - 1, c]);
            if (queue.length - head >= k) {
                const [w, qc] = queue[head];
                head += 1;
                if (w > 0) pool.push([w, qc]);
            }
        }
        return out.length !== s.length ? '' : out.join('');
    }
}
