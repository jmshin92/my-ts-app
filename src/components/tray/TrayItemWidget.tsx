import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { ConfigType } from '../../confs/configs';

export interface Model {
    type: string;
    confType: ConfigType;
}

export interface TrayItemWidgetProps {
	model: Model;
    name: string;
    description?: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        trayItem : {
            border: 0,
            borderRadius: 3,
            boxShadow: '0 2px 5px 2px rgba(0, 0, 0, .3)',
            color: 'white',
            height: 'auto',
            padding: '3px 20px',
            fontFamily: 'Helvetica, Arial',
            margin: '20px 10px',
            cursor: 'pointer',
        },
        consumer : {
            background: 'rgb(253, 121, 168)',
        },
        processor: {
            background: 'rgb(85, 239, 196)',
        },
        producer: {
            background: 'rgb(162, 155, 254)',
        },
    },
    
    )
)

export function TrayItemWidget(itemProps: TrayItemWidgetProps) {
    const classes = useStyles();
    return (
        <div 
            className={`${classes.trayItem} ${itemProps.model.type == 'consumer' ? classes.consumer : itemProps.model.type == 'producer' ? classes.producer : classes.processor }` }
            draggable={true}
            onDragStart={(event) => {
                event.dataTransfer.setData('storm-diagram-node', JSON.stringify(itemProps.model));
            }}
        >
            <h4>{itemProps.name}</h4>

            <p>{itemProps.description}</p>
        </div>
    )
    
}