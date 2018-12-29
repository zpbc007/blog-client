import { Card, Tag } from 'antd';
import { TagColor } from 'common';
import * as React from 'react';
import { StyledCard, StyledIcon, TagWrapper } from './styled';
const { Meta } = Card;

export interface TagItem {
    id: number;
    name: string;
    color: TagColor;
}

export interface ContentItem {
    id: string;
    title: string;
    desc: string;
    createAt: string;
    tagList: TagItem[];
    imgUrl: string;
    imgAlt: string;
}

interface PropsInterface {
    // 点击事件
    onClick?: (id: number) => void;
    // 标签点击
    onTagClick?: (tagId: number) => void;
    // 内容
    content: ContentItem;
}

export class BlogCard extends React.PureComponent<PropsInterface> {
    handleCardClick = ({ currentTarget }: React.MouseEvent) => {
        const { onClick } = this.props;
        const id = currentTarget.getAttribute('data-id') as string;

        onClick && onClick(Number(id));
    }

    handleTagClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        const { currentTarget } = event;
        const { onTagClick } = this.props;
        const id = currentTarget.getAttribute('data-id') as string;

        onTagClick && onTagClick(Number(id));
    }

    render() {
        const { content: { title, desc, id } } = this.props;
        return (
            <StyledCard
                data-id={id}
                onClick={this.handleCardClick}
                cover={this.renderImg()}
                hoverable={true}
                extra={this.renderInfo()}
                title={title}
                actions={this.renderTagList() as any}
            >
                <Meta
                    description={desc}
                />
            </StyledCard>
        );
    }

    // 渲染card上img
    renderImg = () => {
        const { content: { imgUrl, imgAlt } } = this.props;

        if (!imgUrl) {
            return null;
        }

        return (
            <img
                alt={imgAlt}
                src={imgUrl}
            />
        );
    }

    // 渲染标签
    renderTagList = () => {
        const { content: { tagList } } = this.props;

        if (!tagList || tagList.length === 0) {
            return null;
        }
        return [(
            <TagWrapper>
                <StyledIcon type='tags' />
                {tagList.map(({ id, name, color }) => {
                    return (
                        <Tag
                            key={id}
                            color={color}
                            data-id={id}
                            onClick={this.handleTagClick}
                        >
                            {name}
                        </Tag>
                    );
                })}
            </TagWrapper>
        )];
    }

    renderInfo = () => {
        const { content: { createAt } } = this.props;
        const date = new Date(createAt);

        return (
            <React.Fragment>
                <StyledIcon type='clock-circle' />
                {`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
            </React.Fragment>
        );
    }
}