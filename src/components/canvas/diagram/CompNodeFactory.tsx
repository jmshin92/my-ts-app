import { CompNodeWidget } from './CompNodeWidget';
import { CompNodeModel } from './CompNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class CompNodeFactory extends AbstractReactFactory<CompNodeModel, DiagramEngine> {
	constructor() {
		super('comp');
	}

	generateReactWidget(event): JSX.Element {
		return <CompNodeWidget engine={this.engine} node={event.model} />;
	}

	generateModel(event) {
		return new CompNodeModel();
	}
}