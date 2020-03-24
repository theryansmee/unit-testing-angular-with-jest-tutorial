import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkerModel } from '../worker.model';
import { tap } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class WorkerService {
	
	
	constructor ( private http: HttpClient ) { }
	
	
	public getWorker (): Observable<WorkerModel[]> {
		return this.http.get<WorkerModel[]>( 'test.com/workers/' )
			.pipe(
				tap(
					( workers: WorkerModel[] ) => this.addWorkersToStore( workers )
				)
			);
	}
	
	public getWorkerById ( id: string ): Observable<WorkerModel> {
		return this.http.get<WorkerModel>( `test.com/workers/${ id }` );
	}
	
	public submitWorker ( worker: WorkerModel ): Observable<WorkerModel> {
		return this.http.post<WorkerModel>( `test.com/workers`, worker )
			.pipe(
				tap(
					( workers: WorkerModel ) => this.addWorkerToStore( worker )
				)
			);
	}
	
	public addWorkerToStore ( worker: WorkerModel ) {
		// Call to this.store.dispatch( new workerServiceActions.AddWorker( worker ) );
	}
	
	public addWorkersToStore ( workers: WorkerModel[] ) {
		// Call to this.store.dispatch( new workerServiceActions.AddWorkers( workers ) );
	}
}
