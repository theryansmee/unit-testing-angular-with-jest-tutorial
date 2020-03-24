import { Component, OnInit } from '@angular/core';
import { WorkerService } from './service/worker.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkerModel } from './worker.model';
import { LoaderService } from '../loader/service/loader.service';
import { DialogConfigModel, DialogTypeEnum } from '../dialog/service/dialog-config.model';
import { DialogService } from '../dialog/service/dialog.service';
import { ErrorTypeEnum } from '../error-handler/error-type.enum';
import { BrowserNotificationsService } from '../browser-notifications/service/browser-notifications.service';


@Component({
	selector: 'app-new-worker',
	templateUrl: './workers.component.html',
	styleUrls: ['./workers.component.scss']
})
export class WorkersComponent implements OnInit {
	
	
	public workers: WorkerModel[];
	
	public canSendNotifications: boolean;

	
	constructor (
		private workerService: WorkerService,
		private dialogService: DialogService,
		private loaderService: LoaderService,
	) { }
	
	
	ngOnInit (): void {
		this.requestBrowserPermissions();
	}

	
	public requestBrowserPermissions (): void {
		BrowserNotificationsService.requestPermission()
			.then(
				( canSendNotifications: boolean ) => this.canSendNotifications = canSendNotifications
			)
			.catch(
				() => this.requestBrowserPermissions()
			);
	}

	public getWorkers (): void {
		this.loaderService.setLoaderState( true );
		
		this.workerService.getWorker()
			.subscribe(
				( workers: WorkerModel[] ) => {
					this.workers = workers;
					this.loaderService.setLoaderState( false );
				},
				( error: HttpErrorResponse ) => this.handleGetWorkersError( error )
			);
	}
	
	public handleGetWorkersError ( error: HttpErrorResponse ): void {
		let dialogConfig: DialogConfigModel = {
			subject: 'Ooops 💀',
			message: 'It looks like something went wrong. Please try again..',
			type: DialogTypeEnum.negative,
		};
		
		if ( error.status === 401 ) {
			if ( error.message === ErrorTypeEnum.notAdmin ) {
				dialogConfig.message = 'Only team members can view these users.';
			}
			else if ( error.message === ErrorTypeEnum.notAdmin ) {
				dialogConfig.message = 'Only admins members can view these users.';
			}
		}
		
		this.dialogService.showDialog( dialogConfig );
		this.loaderService.setLoaderState( false );
	}

}
