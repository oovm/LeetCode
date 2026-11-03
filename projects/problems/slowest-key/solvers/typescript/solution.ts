export class Solution {
    slowestKey(releaseTimes: number[], keysPressed: string): string {
        let best = releaseTimes[0];
        let key = keysPressed[0];
        for (let i = 1; i < releaseTimes.length; i++) {
            const d = releaseTimes[i] - releaseTimes[i - 1];
            if (d > best || (d === best && keysPressed[i] > key)) {
                best = d;
                key = keysPressed[i];
            }
        }
        return key;
    }
}
