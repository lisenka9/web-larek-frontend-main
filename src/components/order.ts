import { Form } from './common/form';
import { IOrderForm, IFormState } from '../types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

export class Order extends Form<Pick<IOrderForm, 'payment' | 'address'>> { // Класс для представления формы заказа.
	protected _methodButtons: HTMLButtonElement[]; // Поле для хранения массива кнопок выбора способа оплаты.

	constructor(container: HTMLFormElement, events: IEvents) { 
		super(container, events); 

		this._methodButtons = ensureAllElements<HTMLButtonElement>( // Находим все кнопки выбора способа оплаты внутри контейнера.
			'.button_alt', 
			container // Контейнер, в котором ищем кнопки.
		);
		this._methodButtons.forEach((btn) => { // Для каждой кнопки.
			btn.addEventListener('click', () => { // Добавляем обработчик события click.
				this.selectPayment(btn); // Выделяем выбранный способ оплаты.
				this.onInputChange('payment', btn.name); // Генерируем событие 'input:change' с информацией о выбранном способе оплаты.
			});
		});
	}

	resetPayment() { // Метод для сброса выделения способа оплаты.
		this._methodButtons.forEach((btn) => { // Для каждой кнопки.
			btn.classList.remove('button_alt-active'); // Удаляем класс 'button_alt-active', чтобы снять выделение.
		});
	}

	selectPayment(button: HTMLButtonElement) { // Метод для выделения выбранного способа оплаты.
		this.resetPayment(); // Сбрасываем выделение всех способов оплаты.
		button.classList.add('button_alt-active'); // Добавляем класс 'button_alt-active' к выбранной кнопке, чтобы выделить ее.
	}

	set address(value: string) { // Сеттер для свойства address (адрес доставки).
		(this.container.elements.namedItem('address') as HTMLInputElement).value = // Получаем элемент формы с именем 'address' (приводим его к типу HTMLInputElement) и устанавливаем его значение.
			value; // Устанавливаем значение поля address.
	}

	render(state: Pick<IOrderForm, 'payment' | 'address'> & IFormState) { // Метод для отрисовки формы.
		this.resetPayment(); // Сбрасываем выделение способа оплаты перед отрисовкой формы.
		return super.render(state); 
	}
}