import { Grid, withWidth } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import { ContentCard } from 'components/card';
import { withStoreIns } from 'hoc/withStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { compose } from 'recompose';
import storeIns, { BlogListPageStore } from './blog_list_page.store';

interface PropsInterface extends RouteComponentProps {
    store: BlogListPageStore;
    width: Breakpoint;
}

@observer
class BlogListPage extends React.Component<PropsInterface> {
    componentDidMount() {
        this.props.store.getBlogList();
    }

    handleTagClick = (id: string) => {
        // tag 列表页
        console.log(`tag id: ${id}`);
    }

    handleCardClick = (id: string) => {
        const { history } = this.props;

        history.push(`/blog/${id}`);
    }

    renderCard = () => {
        const {
            width,
            store: { blogList },
        } = this.props;
        let columnNum: number = 0;
        const isWidthUpLg = isWidthUp('lg', width),
            isWidthUpSm = isWidthUp('sm', width),
            isWidthUpXs = isWidthUp('xs', width);
        const ColumnArr: React.ReactNodeArray[] = [];
        const Content: React.ReactNodeArray = [];

        if (isWidthUpLg) {
            columnNum = 3;
        } else if (isWidthUpSm && !columnNum) {
            columnNum = 2;
        } else if (isWidthUpXs && !columnNum) {
            columnNum = 1;
        }

        for (let index = 0, len = blogList.length; index < len; index++) {
            // 列index
            const columnIndex = index % columnNum;
            // 列对应的数组
            let columnContent = ColumnArr[columnIndex];

            if (!columnContent) {
                columnContent = [];
                ColumnArr[columnIndex] = columnContent;
            }

            columnContent.push((
                <Grid
                    key={`${index}`}
                    item={true}
                >
                    <ContentCard
                        key={`${index}`}
                        onTagClick={this.handleTagClick}
                        onCardClick={this.handleCardClick}
                        {...blogList[index]}
                    />
                </Grid>
            ));
        }

        for (let columnIndex = 0; columnIndex < columnNum; columnIndex++) {
            Content.push((
                <Grid
                    key={`${columnIndex}`}
                    container={true}
                    item={true}
                    spacing={32}
                    direction='column'
                    alignItems='center'
                    justify='flex-start'
                    xs={12}
                    sm={6}
                    lg={4}
                >
                    {ColumnArr[columnIndex]}
                </Grid>
            ));
        }

        return Content;
    }

    render() {
        return (
            <Grid
                container={true}
                justify='space-between'
            >
                {this.renderCard()}
            </Grid>
        );
    }
}

export default compose(
    withStoreIns(storeIns),
    withWidth(),
)(BlogListPage as any);