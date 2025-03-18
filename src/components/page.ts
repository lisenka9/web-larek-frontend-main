import { View } from './base/view';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IPage } from '../types';

export class Page extends View<IPage> { // Класс для представления страницы.
	protected _catalog: HTMLElement; // Поле для хранения элемента каталога товаров.
	protected _wrapper: HTMLElement; // Поле для хранения элемента обертки страницы.
	protected _basket: HTMLElement; // Поле для хранения элемента корзины.
	protected _counter: HTMLElement; // Поле для хранения элемента счетчика товаров в корзине.

	constructor(container: HTMLElement, protected events: IEvents) { 
		super(container); 

		this._catalog = ensureElement<HTMLElement>('.gallery', container); // Находим элемент каталога товаров внутри контейнера.
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container); // Находим элемент обертки страницы внутри контейнера.
		this._basket = ensureElement<HTMLElement>('.header__basket', container); // Находим элемент корзины внутри контейнера.
		this._counter = ensureElement<HTMLElement>('.header__basket-counter', container); // Находим элемент счетчика товаров в корзине внутри контейнера.

		this._basket.addEventListener('click', () => { // Добавляем обработчик события click на элемент корзины.
			this.events.emit('basket:open'); // Генерируем событие 'basket:open' при клике на корзину.
		});
	}

	set catalog(items: HTMLElement[]) { // Сеттер для catalog (массив элементов товаров в каталоге).
		this._catalog.replaceChildren(...items); // Заменяем содержимое элемента каталога на переданные элементы товаров.
	}

	set locked(flag: boolean) { // Сеттер для locked (флаг блокировки прокрутки страницы).
		if (flag) { 
			this._wrapper.classList.add('page__wrapper_locked'); // Добавляем класс 'page__wrapper_locked' к элементу обертки страницы, чтобы заблокировать прокрутку.
		} else { 
			this._wrapper.classList.remove('page__wrapper_locked'); // Удаляем класс 'page__wrapper_locked' из элемента обертки страницы, чтобы разблокировать прокрутку.
		}
	}

	set counter(value: number) { // Сеттер для  counter (количество товаров в корзине).
		this.setText(this._counter, String(value)); 
	}
}