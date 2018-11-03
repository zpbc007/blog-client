import { Icon, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { RouteItem } from 'common/router';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface PropsInterface {
    routes: RouteItem[];
}

export class Links extends React.Component<PropsInterface> {
    render() {
        const { routes } = this.props;
        return (
            <List>
                {routes.map(({
                    redirect,
                    path,
                    notShowInMenu,
                    icon: PropsIcon,
                    menuText,
                }) => {
                    if (redirect || !notShowInMenu) {
                        return null;
                    }

                    return (
                        <NavLink
                            to={path}
                            activeClassName='active'
                            key={path}
                        >
                            <ListItem
                                button={true}
                            >
                                {PropsIcon ? (
                                    <ListItemIcon>
                                        {typeof PropsIcon === 'string' ? (
                                            <Icon>{PropsIcon}</Icon>
                                        ) : (
                                            <PropsIcon />
                                        )}
                                    </ListItemIcon>
                                ) : null}
                            </ListItem>
                            <ListItemText
                                primary={menuText}
                                disableTypography={true}
                            />
                        </NavLink>
                    );
                })}
            </List>
        );
    }
}