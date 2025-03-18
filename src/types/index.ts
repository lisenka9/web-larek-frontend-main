export type ProductCategory = // Определения категорий товаров.
	| 'софт-скил' 
	| 'хард-скил' 
	| 'кнопка' 
	| 'дополнительное' 
	| 'другое'; 

export type CategoryClasses = Record<ProductCategory, string>; // Тип для хранения CSS-классов, соответствующих каждой категории товара.

export interface IProduct { // Интерфейс для представления товара.
	id: string; // Уникальный идентификатор товара.
	title: string; // Название товара.
	description: string; // Описание товара.
	image: string; // URL изображения товара.
	price: number | null; // Цена товара (может быть null, если товар бесплатный).
	category: ProductCategory; // Категория товара.
	index: number; // Индекс товара.
}

export interface ICardActions { // Интерфейс для определения действий, которые можно выполнить с карточкой товара.
	onClick: (event: MouseEvent) => void; // Функция, вызываемая при клике на карточку товара.
}

export interface IWebLarekApi { // Интерфейс для определения API WebLarek.
	getProductList: () => Promise<IProduct[]>; // Функция для получения списка товаров.
	getProductInfo: (id: string) => Promise<IProduct>; // Функция для получения информации о товаре по его ID.
	orderProducts: (order: IOrder) => Promise<IOrderResult>; // Функция для оформления заказа.
}

export interface IPage { // Интерфейс для представления страницы.
	catalog: HTMLElement[]; // Массив элементов HTML, представляющих товары в каталоге.
	locked: boolean; // Флаг, указывающий, заблокирована ли прокрутка страницы.
}

export interface IModalView { // Интерфейс для представления модального окна.
	content: HTMLElement; // Элемент HTML, представляющий контент модального окна.
}

export interface IBasketView { // Интерфейс для представления корзины.
	items: HTMLElement[]; // Массив элементов HTML, представляющих товары в корзине.
	total: number; // Общая стоимость товаров в корзине.
}

export interface IFormState { // Интерфейс для представления состояния формы.
	valid: boolean; // Флаг, указывающий, является ли форма валидной.
	errors: string[]; // Массив строк, содержащих сообщения об ошибках валидации формы. 
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>; // Тип для представления ошибок валидации формы.

export interface IOrderForm { // Интерфейс для представления данных формы заказа.
	payment: string; // Способ оплаты.
	address: string; // Адрес доставки.
	email: string; // Email клиента.
	phone: string; // Телефон клиента.
}

export interface IOrder extends IOrderForm { // Интерфейс для представления заказа.
	total: number; // Общая стоимость заказа.
	items: string[]; // Массив идентификаторов товаров в заказе.
}

export interface IOrderResult { // Интерфейс для представления результата оформления заказа.
	id: string; // Уникальный идентификатор заказа.
	total: number; // Общая стоимость заказа.
}

export interface ISuccess { // Интерфейс для представления сообщения об успешном завершении заказа.
	total: number; // Общая стоимость заказа.
}