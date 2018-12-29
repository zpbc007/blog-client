import { ContentItem } from 'components/blog_card';
import { CommonConfig } from 'config';
import { action, observable, reaction, runInAction } from 'mobx';
import { getArticleList } from 'service/article.service';

export class BlogListStore {
    // 当前列表数据
    @observable
    blogList: ContentItem[] = [];
    @observable
    pageNo = 1;

    /**
     * 获取文章列表
     */
    @action
    fetchBlogList = async () => {
        const res = await getArticleList(this.pageNo, CommonConfig.blogListSize);

        runInAction(() => {
            this.blogList = res;
        });
    }

    // 切换页数
    @action
    changePageNo = (pageNo: number) => {
        if (pageNo <= 0) {
            return;
        }

        this.pageNo = pageNo;
    }

    // 分页数据改变
    paginationReaction = reaction(() => ({
        pageNo: this.pageNo,
    }), () => {
        this.fetchBlogList();
    });
}

export const blogListStoreIns = new BlogListStore();