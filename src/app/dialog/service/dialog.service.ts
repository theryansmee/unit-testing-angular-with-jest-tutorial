import { Injectable } from '@angular/core';
import { DialogConfigModel } from './dialog-config.model';


@Injectable({
	providedIn: 'root'
})
export class DialogService {
	
	
	constructor () { }
	
	
	public showDialog ( dialogConfig: DialogConfigModel ): void {
		// Some dialog code here
	}
}
