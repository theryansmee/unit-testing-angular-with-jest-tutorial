import { Injectable } from '@angular/core';


@Injectable({
	providedIn: 'root'
})
export class BrowserNotificationsService {


	constructor () { }


	public static async requestPermission (): Promise<boolean> {
		return await Notification.requestPermission()
			.then(
				( permission: string ) => {
					return permission === 'granted';
				}
			);
	}
	
}
