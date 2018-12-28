import { ContentItem } from 'components/card';
import { action, observable, runInAction } from 'mobx';
import { getArticleList } from 'service/article';

export class BlogListPageStore {
    @observable
    blogList: ContentItem[] = [];
    // 标签列表
    @observable
    tagList = [];

    @action
    getBlogList = async () => {
        const res = await getArticleList();

        runInAction(() => {
            this.blogList = res as any;
        });
    }
}

const ins = new BlogListPageStore();

export default ins;