import { List } from 'antd';
import { BlogCard, ContentItem } from 'components/blog_card';
import { CommonConfig } from 'config';
import { withStoreIns } from 'hoc/withStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { BlogListStore, blogListStoreIns } from './blog_list.store';
const { Item } = List;

interface PropsInterface extends RouteComponentProps {
    store: BlogListStore;
}

@observer
export class BlogList extends React.Component<PropsInterface> {
    handleCardClick = (id: number) => {
        const { history } = this.props;

        history.push(`/blog/${id}`);
    }

    handleTagClick = (id: number) => {
        console.log(`tag id: ${id}`);
    }

    render() {
        const { changePageNo, blogList } = this.props.store;
        return (
            <List
                itemLayout='vertical'
                size='large'
                pagination={{
                    onChange: changePageNo,
                    pageSize: CommonConfig.blogListSize,
                }}
                dataSource={blogList}
                renderItem={this.renderCardItem}
            />
        );
    }

    renderCardItem = ( contentItem: ContentItem) => {
        const { id } = contentItem;
        return (
            <Item
                key={id}
            >
                <BlogCard
                    onClick={this.handleCardClick}
                    onTagClick={this.handleTagClick}
                    content={contentItem}
                />
            </Item>
        );
    }

    componentWillMount() {
        this.props.store.fetchBlogList();
    }
}

export default compose<PropsInterface, any>(
    withRouter,
    withStoreIns(blogListStoreIns),
)(BlogList);