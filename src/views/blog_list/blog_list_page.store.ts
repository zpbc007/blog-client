import { ContentItem } from 'components/card';
import { action, observable, runInAction } from 'mobx';
import { getBlogList as serviceGetBlogList } from 'service/blog_list';

export class BlogListPageStore {
    @observable
    blogList: ContentItem[] = [];
    // 标签列表
    @observable
    tagList = [];

    @action
    getBlogList = async () => {
        const res = await serviceGetBlogList();

        runInAction(() => {
            this.blogList = res as any;
        });
    }
}

const ins = new BlogListPageStore();

export default ins;