import { Card, Icon } from 'antd';
import styled from 'styled-components';

const StyledCard = styled(Card)`
    .ant-card-actions {
        li {
            margin: 0;
            text-align: left;
        }
    }
`;

const TagWrapper =  styled.div`
    padding: 10px 5px;
`;

const StyledIcon = styled(Icon)`
    margin-right: 8px;
`;

export {
    TagWrapper,
    StyledIcon,
    StyledCard,
};