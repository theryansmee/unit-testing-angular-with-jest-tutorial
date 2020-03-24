import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class LoaderService {
	
	
	private loader: ReplaySubject<boolean> = new ReplaySubject<boolean>( 1 );
	
	
	constructor () { }
	
	
	public setLoaderState ( isLoading = false ): void {
		this.loader.next( isLoading );
	}
	
	public returnLoaderObservable (): Observable<boolean> {
		return this.loader.asObservable();
	}
}
