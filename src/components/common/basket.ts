import { View } from '../base/view';
import { ensureElement, createElement, formatNumber } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasketView } from '../../types';

export class Basket extends View<IBasketView> { // Класс для отображения корзины товаров.
	protected _list: HTMLElement; // Поле для хранения элемента списка товаров в корзине.
	protected _total: HTMLElement; // Поле для хранения элемента, отображающего общую сумму заказа.
	protected _button: HTMLElement; // Поле для хранения кнопки оформления заказа.

	constructor(container: HTMLElement, protected events: EventEmitter) { 
		super(container); 

		this._list = ensureElement<HTMLElement>('.basket__list', this.container); // Находим элемент списка товаров в корзине внутри контейнера и сохраняем его.
		this._total = this.container.querySelector('.basket__price'); // Находим элемент, отображающий общую сумму заказа, внутри контейнера и сохраняем его.
		this._button = this.container.querySelector('.basket__button'); // Находим кнопку оформления заказа внутри контейнера и сохраняем ее.

		if (this._button) { 
			this._button.addEventListener('click', () => { 
				events.emit('order:open'); // При клике на кнопку, генерируем событие 'order:open' (пользователь нажал на кнопку “Оформить заказ”).
			});
		}

		this.items = []; 
	}

	set items(items: HTMLElement[]) { // Сеттер для  items (список товаров в корзине).
		if (items.length) { 
			this._list.replaceChildren(...items); // Если товары есть, заменяем содержимое списка товаров на переданные элементы.
			this.setDisabled(this._button, false); // Разблокируем кнопку оформления заказа.
		} else { 
			this._list.replaceChildren( // Заменяем содержимое списка товаров на сообщение "Корзина пуста".
				createElement<HTMLParagraphElement>('p', { 
					textContent: 'Корзина пуста', 
				})
			);
			this.setDisabled(this._button, true); // Блокируем кнопку оформления заказа.
		}
	}

	set total(total: number) { // Сеттер для total (общая сумма заказа).
		this.setText(this._total, `${formatNumber(total)} синапсов`); 
	}
}