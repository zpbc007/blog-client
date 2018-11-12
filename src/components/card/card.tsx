import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    colors,
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { ContentItem, TagItem } from '.';

interface PropsInterface extends ContentItem {
    onTagClick?: (tagId: string) => void;
    className?: string;
}

const ImgWrapper = styled(CardMedia)`
    height: 320px;
    margin-bottom: 0.35em;
`;

const ColorBtn = styled(({ bgColor, ...props }: any) => <Button {...props} />)<{bgColor: TagItem['color']}>`
    && {
        background-color: ${props => (colors as any)[props.bgColor][500]}
    }
`;

/**
 * 首页内容容器
 */
export class ContentCard extends React.PureComponent<PropsInterface> {
    handleTagClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { onTagClick } = this.props;
        const id = event.currentTarget.getAttribute('data-id') || '';

        onTagClick && onTagClick(id);
    }

    renderTags = () => {
        const { tagList } = this.props;
        const TagList: React.ReactNodeArray = [];

        for (const tag of tagList) {
            const { title, id, color } = tag;
            TagList.push((
                <ColorBtn
                    key={id}
                    size='small'
                    data-id={id}
                    bgColor={color}
                    onClick={this.handleTagClick}
                >
                    {title}
                </ColorBtn>
            ));
        }

        return TagList;

    }
    render() {
        const {
            className,
            imgUrl,
            title,
            content,
        } = this.props;
        return (
            <Card className={className}>
                <CardActionArea>
                    <CardContent>
                        <Typography
                            gutterBottom={true}
                            component={'h2'}
                            variant={'h5'}
                        >
                            {title}
                        </Typography>
                        <ImgWrapper
                            image={imgUrl}
                        />
                        <Typography
                            component={'p'}
                        >
                            {content}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {this.renderTags()}
                </CardActions>
            </Card>
        );
    }
}