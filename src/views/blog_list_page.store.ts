import { ContentItem } from 'components/card';
import { action, observable, runInAction } from 'mobx';
import { getBlogList as serviceGetBlogList } from 'service/blog_list';

export class BlogListPageStore {
    @observable
    blogList: ContentItem[] = [];

    @action
    getBlogList = async () => {
        const res = await serviceGetBlogList();

        runInAction(() => {
            this.blogList = res;
        });
    }
}

const ins = new BlogListPageStore();

export default ins;