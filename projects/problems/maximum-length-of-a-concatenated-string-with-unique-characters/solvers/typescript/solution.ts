export class Solution {
    maxLength(arr: string[]): number {
        const masks: number[] = [];
        const sizes: number[] = [];

        for (const word of arr) {
            let mask = 0;
            let duplicate = false;
            for (const character of word) {
                const bit = 1 << (character.charCodeAt(0) - 97);
                if ((mask & bit) !== 0) duplicate = true;
                mask |= bit;
            }
            masks.push(duplicate ? 0 : mask);
            sizes.push(duplicate ? -1 : word.length);
        }

        let best = 0;
        const search = (start: number, used: number, length: number): void => {
            if (length > best) best = length;
            for (let index = start; index < arr.length; index++) {
                if (sizes[index] < 0) continue;
                if ((used & masks[index]) !== 0) continue;
                search(index + 1, used | masks[index], length + sizes[index]);
            }
        };
        search(0, 0, 0);
        return best;
    }
}
