export class Solution {
    canTransform(start: string, result: string): boolean {
        const a = start.replaceAll('X', '');
        const b = result.replaceAll('X', '');
        if (a !== b) {
            return false;
        }
        let j = 0;
        for (let i = 0; i < start.length; i++) {
            if (start[i] === 'X') continue;
            while (result[j] === 'X') j += 1;
            if (start[i] === 'L' && i < j) return false;
            if (start[i] === 'R' && i > j) return false;
            j += 1;
        }
        return true;
    }
}
