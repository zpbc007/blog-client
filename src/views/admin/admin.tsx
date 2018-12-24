import { Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import { AdminData } from 'common/admin';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

const AdminWrapper = styled.div``;

const CardWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: flex-start;
    align-content: flex-start;
`;

export class Admin extends React.PureComponent<RouteComponentProps> {
    handleCardClick = ({ currentTarget }: React.MouseEvent) => {
        const path = currentTarget.getAttribute('data-path') as string;

        this.props.history.push(path);
    }

    render() {
        return (
            <AdminWrapper>
                后台管理
                <CardWrapper>
                    {this.renderCardList()}
                </CardWrapper>
            </AdminWrapper>
        );
    }

    renderCardList = () => {
        return AdminData.map(({title, desc, path}) => {
            return (
                <Card
                    key={path}
                    raised={true}
                    onClick={this.handleCardClick}
                    data-path={path}
                >
                    <CardActionArea>
                        <CardContent>
                            <Typography
                                gutterBottom={true}
                                component='h2'
                                variant='h5'
                            >
                                {title}
                            </Typography>
                            <Typography component='p'>
                                {desc}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            );
        });
    }
}

export default withRouter(Admin);