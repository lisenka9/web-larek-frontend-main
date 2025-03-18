import { Form } from './common/form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';

export class Contacts extends Form<Pick<IOrderForm, 'email' | 'phone'>> {  // Класс для представления формы контактных данных.
	constructor(container: HTMLFormElement, events: IEvents) { 
		super(container, events); 
	}

	set email(value: string) { 
		(this.container.elements.namedItem('email') as HTMLInputElement).value = // Получаем элемент формы с именем 'email' (приводим его к типу HTMLInputElement) и устанавливаем его значение.
			value; // Устанавливаем значение поля email.
	}

	set phone(value: string) { 
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = // Получаем элемент формы с именем 'phone' (приводим его к типу HTMLInputElement) и устанавливаем его значение.
			value; // Устанавливаем значение поля phone.
	}
}