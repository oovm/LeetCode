export class Solution {
    numUniqueEmails(emails: string[]): number {
        const seen = new Set<string>();
        for (const email of emails) {
            const [local, domain] = email.split("@");
            const normalized = local.split("+")[0].replace(/\./g, "");
            seen.add(`${normalized}@${domain}`);
        }
        return seen.size;
    }
}
