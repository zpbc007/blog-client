import axios from 'axios';
import { createAuthHeader } from 'utils/request';

/**
 * 获取文章列表
 */
async function getArticleList() {
    const res = await axios.get('/api/articles', {
        headers: createAuthHeader(),
    });

    return res.data;
}

export {
    getArticleList,
};
