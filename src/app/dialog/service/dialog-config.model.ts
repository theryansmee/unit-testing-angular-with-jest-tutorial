export enum DialogTypeEnum {
	'positive',
	'negative'
}

export interface DialogConfigModel {
	subject: string;
	message: string;
	type: DialogTypeEnum;
}
