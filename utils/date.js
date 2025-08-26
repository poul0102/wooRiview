export function kstTodayBoundsUtc(now = new Date()) {
    const KST_MIN = 9 * 60; // +09:00
    const kstNow = new Date(now.getTime() + KST_MIN * 60000);
    const kstStart = new Date(
        kstNow.getFullYear(),
        kstNow.getMonth(),
        kstNow.getDate(),
        0,
        0,
        0
    );
    const startUtc = new Date(kstStart.getTime() - KST_MIN * 60000);
    const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);
    return { startUtc, endUtc };
}