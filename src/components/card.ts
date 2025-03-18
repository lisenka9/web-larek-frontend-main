import { View } from './base/view';
import { ensureElement, formatNumber } from '../utils/utils';
import { ProductCategory } from '../types';
import { cardCategories } from '../utils/constants';
import { IProduct, ICardActions } from '../types';

export class Card extends View<IProduct> { // Класс для отображения информации о товаре.
	protected _title: HTMLElement; // Поле для хранения элемента заголовка карточки.
	protected _price: HTMLElement; // Поле для хранения элемента цены карточки.
	protected _category?: HTMLElement; // Поле для хранения элемента категории карточки (может отсутствовать).
	protected _image?: HTMLImageElement; // Поле для хранения элемента изображения карточки (может отсутствовать).
	protected _description?: HTMLElement; // Поле для хранения элемента описания карточки (может отсутствовать).
	protected _button?: HTMLButtonElement; // Поле для хранения элемента кнопки карточки (может отсутствовать).
	protected _index?: HTMLElement; // Поле для хранения элемента индекса товара в корзине (может отсутствовать).

	constructor(container: HTMLElement, actions?: ICardActions) { 
		super(container); 

		this._title = ensureElement<HTMLElement>(`.card__title`, container); // Находим элемент заголовка карточки внутри контейнера.
		this._price = ensureElement<HTMLElement>(`.card__price`, container); // Находим элемент цены карточки внутри контейнера.
		this._image = container.querySelector(`.card__image`); // Находим элемент изображения карточки внутри контейнера.
		this._category = container.querySelector(`.card__category`); // Находим элемент категории карточки внутри контейнера.
		this._description = container.querySelector(`.card__text`); // Находим элемент описания карточки внутри контейнера.
		this._button = container.querySelector(`.card__button`); // Находим элемент кнопки карточки внутри контейнера.
		this._index = container.querySelector('.basket__item-index'); // Находим элемент индекса товара в корзине.

		if (actions?.onClick) { // Проверяем, передана ли функция onClick в параметре actions.
			if (this._button) { 
				this._button.addEventListener('click', actions.onClick); // Добавляем обработчик события нажатия на кнопку.
			} else { 
				container.addEventListener('click', actions.onClick); // Добавляем обработчик события нажатия на весь контейнер карточки.
			}
		}
	}

	set title(value: string) { // Сеттер для title (заголовок карточки).
		this.setText(this._title, value); 
	}

	set image(src: string) { // Сеттер для image (URL изображения).
		this.setImage(this._image, src, this.title); 
	}

	set description(value: string) { // Сеттер для description (описание карточки).
		this.setText(this._description, value); 
	}

	set category(value: ProductCategory) { // Сеттер для category (категория карточки).
		this.setText(this._category, value); 
		this._category?.classList.add(cardCategories[value]); // Добавляем CSS-класс категории к элементу категории.
	}

	set price(value: number) { // Сеттер для price (цена карточки).
		this.setText( 
			this._price, 
			value ? `${formatNumber(value)} синапсов` : 'Бесценно' // Форматируем цену и добавляем текст "синапсов" или "Бесценно", если цена равна 0.
		);
	}

	set index(value: number) { // Сеттер для index (индекс товара в корзине).
		this.setText(this._index, value); 
	}

	setDeleteButton() { // Метод для установки текста кнопки "Удалить из корзины".
		this.setText(this._button, 'Удалить из корзины'); 
	}

	render(data?: Partial<IProduct>, isInBasket?: boolean): HTMLElement { // Метод для отрисовки карточки.
		Object.assign(this as object, data ?? {}); // Копируем свойства из объекта data в текущий экземпляр класса.
		if (!data.price) { // Если цена не указана (равна 0).
			this.setDisabled(this._button, true); // Блокируем кнопку.
		}
		if (isInBasket) { // Если карточка находится в корзине.
			this.setDeleteButton(); // Устанавливаем текст кнопки "Удалить из корзины".
		}
		return this.container; // Возвращаем контейнер.
	}
}