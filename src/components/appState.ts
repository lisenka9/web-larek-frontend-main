import { IEvents } from './base/events';
import { IProduct, ProductCategory } from '../types';
import { IOrderForm, IOrder, FormErrors } from '../types';

export class ProductItem implements Omit<IProduct, 'index'> { // Класс для представления товара.
	id: string; // Уникальный идентификатор товара.
	title: string; // Название товара.
	description: string; // Описание товара.
	image: string; // URL изображения товара.
	price: number; // Цена товара.
	category: ProductCategory; // Категория товара.

	constructor(data:IProduct, protected events: IEvents) { 
		Object.assign(this, data); // Копируем свойства из объекта data в текущий экземпляр класса.
	}
}

export class AppData { // Класс для хранения данных приложения.
	catalog: ProductItem[]; // Массив товаров в каталоге.
	preview: string | null; // ID товара, отображаемого в предпросмотре, или null, если предпросмотр не отображается.
	basket: ProductItem[]; // Массив товаров в корзине.
	order: IOrder = { // Объект, представляющий информацию о заказе.
		payment: '', // Способ оплаты.
		address: '', // Адрес доставки.
		email: '', // Email клиента.
		phone: '', // Телефон клиента.
		total: 0, // Общая стоимость заказа.
		items: [], // Массив товаров в заказе.
	};
	formErrors: FormErrors; // Объект, содержащий ошибки валидации формы.

	constructor(protected events: IEvents) { 
		this.basket = []; // Инициализируем корзину пустым массивом.
	}

	setCatalog(items: IProduct[]) { // Метод для установки каталога товаров.
		this.catalog = items.map((item) => new ProductItem(item, this.events)); // Преобразуем массив IProduct в массив ProductItem.
		this.events.emit('items:show', { catalog: this.catalog }); // Генерируем событие 'items:show', передавая каталог товаров.
	}

	setPreview(item: ProductItem) { // Метод для установки товара для предпросмотра.
		this.preview = item.id; // Устанавливаем ID товара в качестве значения preview.
		this.events.emit('preview:show', item); // Генерируем событие 'preview:show', передавая товар.
	}

	addToBasket(item: ProductItem) { // Метод для добавления товара в корзину.
		this.basket.push(item); // Добавляем товар в массив basket.
	}

	deleteFromBasket(item: ProductItem) { // Метод для удаления товара из корзины.
		this.basket.splice( // Удаляем элемент из массива basket.
			this.basket.findIndex((i) => i.id === item.id), // Находим индекс товара в массиве basket по его ID.
			1 // Удаляем один элемент.
		);
	}

	clearBasket() { // Метод для очистки корзины.
		this.basket = []; // Устанавливаем basket в пустой массив.
	}

	clearOrder() { // Метод для очистки информации о заказе.
		this.order.payment = ''; // Сбрасываем способ оплаты.
		this.order.address = ''; // Сбрасываем адрес доставки.
		this.order.email = ''; // Сбрасываем email.
		this.order.phone = ''; // Сбрасываем телефон.
		this.order.total = 0; // Сбрасываем общую стоимость.
		this.order.items = []; // Сбрасываем массив товаров в заказе.
	}

	getTotal(): number { // Метод для получения общей стоимости товаров в корзине.
		return this.basket.reduce((a, item) => a + item.price, 0); // Используем reduce для суммирования цен товаров в корзине.
	}

	setOrderField(field: keyof IOrderForm, value: string) { // Метод для установки значения поля в информации о заказе.
		this.order[field] = value; // Устанавливаем значение поля.

		this.validateOrder(); // Запускаем валидацию заказа.
	}

	validateOrder() { // Метод для валидации информации о заказе.
		const errors: typeof this.formErrors = {}; // Создаем объект для хранения ошибок валидации.
		if (!this.order.payment) { // Проверяем, выбран ли способ оплаты.
			errors.payment = 'Необходимо выбрать метод оплаты'; 
		}
		if (!this.order.address) { // Проверяем, указан ли адрес доставки.
			errors.address = 'Необходимо указать адрес'; 
		}
		if (!this.order.email) { // Проверяем, указан ли email.
			errors.email = 'Необходимо указать email'; 
		}
		if (!this.order.phone) { // Проверяем, указан ли телефон.
			errors.phone = 'Необходимо указать телефон'; 
		}
		this.formErrors = errors; // Устанавливаем объект с ошибками валидации в поле formErrors.
		this.events.emit('formErrors:change', this.formErrors); // Генерируем событие 'formErrors:change', передавая объект с ошибками.
		return Object.keys(errors).length === 0; // Возвращаем true, если ошибок нет, и false, если есть ошибки.
	}
}