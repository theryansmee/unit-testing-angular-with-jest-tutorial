import { WorkerFormComponent } from './worker-form.component';
import { WorkerModel } from '../worker.model';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe( 'WorkerFormComponent', () => {
	let fixture: WorkerFormComponent;
	let workerServiceMock;
	let dialogServiceMock;
	let loaderServiceMock;
	
	beforeEach( () => {
		workerServiceMock = {
			submitWorker: jest.fn()
		};
		loaderServiceMock = {
			setLoaderState: jest.fn()
		};
		
		fixture = new WorkerFormComponent(
			workerServiceMock,
			dialogServiceMock,
			loaderServiceMock
		);
	});
	
	describe( 'Setup component', () => {
		describe( 'ngOnInit', () => {
			it( 'should call generateWorkerForm with this.worker', () => {
				const generateWorkerFormSpy = jest.spyOn( fixture, 'generateWorkerForm' );
				const worker: WorkerModel = {
					id: 'worker1',
					name: 'Travis Barker'
				} as WorkerModel;
				fixture.worker = worker;
				
				fixture.ngOnInit();
				
				expect( generateWorkerFormSpy ).toBeCalledWith( worker );
			});
		});
	});
	
	describe( 'generateWorkerForm', () => {
		it( 'should generate form with passed values', () => {
			const worker: WorkerModel = {
				id: 'worker1',
				name: 'Travis Barker',
				role: [ 'great drummer' ],
				active: false
			};
			
			fixture.generateWorkerForm( worker );
			
			expect( fixture.workerForm.value ).toEqual( worker );
		});
		
		it( 'should generate form with default values', () => {
			const expectedResult: WorkerModel = {
				id: expect.any( String ),
				name: null,
				role: [],
				active: true
			};
			
			fixture.generateWorkerForm( undefined );
			
			expect( fixture.workerForm.value ).toEqual( expectedResult );
		});
	});
	
	describe( 'submitWorkerForm', () => {
		describe( 'Form NOT valid', () => {
			it( 'should NOT call submitWorker', () => {
				fixture.generateWorkerForm( undefined );
				
				fixture.submitWorkerForm();
				
				expect( workerServiceMock.submitWorker ).not.toBeCalled();
			});
		});
		
		describe( 'Form valid', () => {
			beforeEach( () => {
				const worker: WorkerModel = {
					id: 'worker1',
					name: 'Travis Barker',
					role: [ 'great drummer' ],
					active: false
				};
				fixture.generateWorkerForm( worker );
			});
			
			it( 'should call submitWorker', () => {
				workerServiceMock.submitWorker
					.mockReturnValue( of( true ) );
				
				fixture.submitWorkerForm();
				
				expect( workerServiceMock.submitWorker ).toBeCalled();
			});
			
			it( 'should call loaderService.setLoaderState with true', () => {
				workerServiceMock.submitWorker
					.mockReturnValue( of( true ) );
				
				fixture.submitWorkerForm();
				
				expect( loaderServiceMock.setLoaderState ).toHaveBeenNthCalledWith( 1, true );
			});
			
			describe( 'submission successful', () => {
				let response;
				
				beforeEach( () => {
					response = {
						id: 'worker1',
						name: 'Travis Barker',
						role: [ 'great drummer' ],
						active: false
					};
					workerServiceMock.submitWorker
						.mockReturnValue( of( response ) );
				});
				
				it( 'should set this.worker to returned value', () => {
					fixture.worker = undefined;
					
					fixture.submitWorkerForm();
					
					expect( fixture.worker ).toEqual( response );
				});
				
				it( 'should set isSubmitting to false', () => {
					fixture.isSubmitting = undefined;
					
					fixture.submitWorkerForm();
					
					expect( fixture.isSubmitting ).toEqual( false );
				});
				
				it( 'should call loaderService.setLoaderState with false', () => {
					
					fixture.submitWorkerForm();
					
					expect( loaderServiceMock.setLoaderState ).toHaveBeenNthCalledWith( 2, false );
				});
			});
			
			describe( 'submission failed', () => {
				it ( 'should call handleSubmitWorkerFormError with thrown error', () => {
					const error: HttpErrorResponse = {
						status: 401,
						message: 'You are not logged in'
					} as HttpErrorResponse;
					const handleSubmitWorkerFormErrorSpy = jest.spyOn( fixture, 'handleSubmitWorkerFormError' );
					workerServiceMock.submitWorker
						.mockReturnValue( throwError( error ) );
					
					fixture.submitWorkerForm();
					
					expect( handleSubmitWorkerFormErrorSpy ).toBeCalledWith( error );
				});
			});
		});
	});
});
