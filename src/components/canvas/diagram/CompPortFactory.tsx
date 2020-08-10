import { AbstractFactory} from '@projectstorm/react-canvas-core';
import { CompPortModel } from './CompPortModel';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core'
import { DiagramEngine } from '@projectstorm/react-diagrams';

export class CompPortFactory extends AbstractModelFactory<CompPortModel, DiagramEngine> {
	constructor() {
		super('comp');
	}

	generateModel(event): CompPortModel {
        return new CompPortModel({
            name: 'unknown',
        });
	}
}