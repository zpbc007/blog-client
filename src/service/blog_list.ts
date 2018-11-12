import { createContent } from 'mock/content.mock';
import { waitForSeconds } from 'utils/test';

/**
 * 获取文章列表
 * TODO: 分页
 */
async function getBlogList() {
    // 等待2秒
    await waitForSeconds(2);

    return createContent();
}

export {
    getBlogList,
};