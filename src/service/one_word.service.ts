import axios from 'axios';
import { OneWordConfig } from 'config';
import { stringify } from 'query-string';

// 请求一言
export async function getWord() {
    const { url, query } = OneWordConfig;
    const res = await axios.get(`${url}?${stringify(query)}`);
    const { hitokoto, from } = res.data;
    return {
        text: hitokoto,
        from,
    };
}