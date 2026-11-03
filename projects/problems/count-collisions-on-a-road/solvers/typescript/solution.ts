export class Solution {
    countCollisions(directions: string): number {
        const trimmed = directions.replace(/^L+/, '').replace(/R+$/, '');
        return [...trimmed].filter((c) => c !== 'S').length;
    }
}
