import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';

export interface TrayWidgetProps {
    children?: React.ReactNode[] | React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        trayWidget: {
            minWidth: '200px',
            flexGrow: 0,
            flexShrink: 0,
        },
    })
)

export function TrayWidget({children}: TrayWidgetProps){
    const classes = useStyles();

    return (
        <div className={classes.trayWidget}>
            {children}
        </div>
    )
}