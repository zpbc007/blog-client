/**
 * 等待
 * @param seconds 秒数
 */
export function waitForSeconds(seconds: number = 1) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
}