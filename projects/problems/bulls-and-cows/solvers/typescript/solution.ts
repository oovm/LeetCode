export class Solution {
    getHint(secret: string, guess: string): string {
        let bulls = 0;
        const sCounts = new Array<number>(10).fill(0);
        const gCounts = new Array<number>(10).fill(0);
        for (let i = 0; i < secret.length; i++) {
            if (secret[i] === guess[i]) {
                bulls += 1;
            } else {
                sCounts[secret.charCodeAt(i) - 48] += 1;
                gCounts[guess.charCodeAt(i) - 48] += 1;
            }
        }
        let cows = 0;
        for (let d = 0; d < 10; d++) {
            cows += Math.min(sCounts[d], gCounts[d]);
        }
        return `${bulls}A${cows}B`;
    }
}
