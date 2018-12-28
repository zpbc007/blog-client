import { colors } from '@material-ui/core';

export interface TagItem {
    id: string;
    name: string;
    desc: string;
    color: keyof typeof colors;
}

export interface ContentItem {
    id: string;
    title: string;
    desc: string;
    version: number;
    create_at: string;
    update_at: string;
    tag_list: TagItem[];
    img: string;
}