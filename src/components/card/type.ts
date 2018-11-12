import { colors } from '@material-ui/core';

export interface TagItem {
    id: string;
    title: string;
    color: keyof typeof colors;
}

export interface ContentItem {
    id: string;
    title: string;
    tagList: TagItem[];
    createTime: string;
    updateTime: string;
    imgUrl: string;
    content: string;
}