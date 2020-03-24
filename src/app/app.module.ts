import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkersComponent } from './workers/workers.component';
import { WorkerFormComponent } from './workers/new-worker/worker-form.component';

@NgModule({
	declarations: [
		AppComponent,
		WorkersComponent,
		WorkerFormComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
