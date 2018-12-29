import axios from 'axios';

/**
 * 获取文章列表
 */
async function getArticleList(pageNo: number, pageSize: number) {
    const res = await axios.get('/api/articles', {
        params: {
            pageNo,
            pageSize,
        },
    });

    return res.data;
}

export {
    getArticleList,
};
