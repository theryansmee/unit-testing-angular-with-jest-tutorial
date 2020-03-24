import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkerModel } from '../worker.model';
import { DialogConfigModel, DialogTypeEnum } from '../../dialog/service/dialog-config.model';
import { ErrorTypeEnum } from '../../error-handler/error-type.enum';
import { WorkerService } from '../service/worker.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../dialog/service/dialog.service';
import { LoaderService } from '../../loader/service/loader.service';


@Component({
	selector: 'app-new-worker',
	templateUrl: './worker-form.component.html',
	styleUrls: ['./worker-form.component.scss']
})
export class WorkerFormComponent implements OnInit {
	
	
	@Input()
	public worker: WorkerModel;
	
	public workerForm: FormGroup;
	
	public isSubmitting: boolean = false;
	
	
	constructor (
		private workerService: WorkerService,
		private dialogService: DialogService,
		private loaderService: LoaderService
	) { }
	
	
	ngOnInit (): void {
		this.generateWorkerForm( this.worker );
	}
	
	public generateWorkerForm ( worker: WorkerModel ): void {
		this.workerForm = new FormGroup( {
			id: new FormControl (
				worker
					&& worker.id
						? worker.id
						: ( `${ Math.random() }` ),
				{
					validators: [
						Validators.required
					]
				}
			),
			name: new FormControl (
				worker
					&& worker.name
						? worker.name
						: null,
				{
					validators: [
						Validators.required,
						Validators.maxLength( 100 )
					]
				}
			),
			role: new FormControl (
				worker
				&& worker.role
					? worker.role
					: [],
				Validators.maxLength( 5 )
			),
			active: new FormControl (
				worker
				&& worker.active !== null
					? worker.active
					: true,
			)
		});
	}
	
	public submitWorkerForm (): void {
		if ( this.workerForm.valid ) {
			const worker: WorkerModel = this.workerForm.value;
			
			this.isSubmitting = true;
			this.loaderService.setLoaderState( true );
			
			this.workerService.submitWorker( worker )
				.subscribe(
					( returnedWorker: WorkerModel ) => {
						this.worker = returnedWorker;
						
						this.isSubmitting = false;
						this.loaderService.setLoaderState( false );
					},
					( error: HttpErrorResponse ) => this.handleSubmitWorkerFormError( error )
				);
		}
	}
	
	public handleSubmitWorkerFormError ( error: HttpErrorResponse ): void {
		let dialogConfig: DialogConfigModel = {
			subject: 'Ooops 💀',
			message: 'It looks like something went wrong. Please try again..',
			type: DialogTypeEnum.negative,
		};
		
		if ( error.status === 401 ) {
			if ( error.message === ErrorTypeEnum.notAdmin ) {
				dialogConfig.message = 'Only admins members can view these users.';
			}
		}
		
		this.dialogService.showDialog( dialogConfig );
		this.loaderService.setLoaderState( false );
	}

}
