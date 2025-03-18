import './scss/styles.scss';
import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/webLarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { Page } from './components/page';
import { AppData, ProductItem } from './components/appState';
import { IProduct, IOrder, IOrderForm } from './types';
import { Card } from './components/card';
import { Modal } from './components/common/modal';
import { Basket } from './components/common/basket';
import { Order } from './components/order';
import { Contacts } from './components/contacts';
import { Success } from './components/common/success';

const successTemplate = ensureElement<HTMLTemplateElement>('#success'); // Шаблон сообщения об успешном заказе.
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); // Шаблон карточки товара в каталоге.
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); // Шаблон карточки товара в предпросмотре.
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); // Шаблон карточки товара в корзине.
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket'); // Шаблон корзины.
const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); // Шаблон формы заказа.
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // Шаблон формы контактов.

const events = new EventEmitter(); // Создаем экземпляр класса EventEmitter для управления событиями.
const api = new WebLarekApi(CDN_URL, API_URL); // Создаем экземпляр класса WebLarekApi для взаимодействия с API.

const page = new Page(document.body, events); // Создаем экземпляр класса Page для представления страницы.
const appData = new AppData(events); // Создаем экземпляр класса AppData для управления состоянием приложения.

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); // Создаем экземпляр класса Modal для представления модального окна.
const basket = new Basket(cloneTemplate(basketTemplate), events); // Создаем экземпляр класса Basket для представления корзины.
const order = new Order(cloneTemplate(orderTemplate), events); // Создаем экземпляр класса Order для представления формы заказа.
const contacts = new Contacts(cloneTemplate(contactsTemplate), events); // Создаем экземпляр класса Contacts для представления формы контактов.

events.on<IProduct>('items:show', () => { // Подписываемся на событие 'items:show' (показ товаров).
	page.catalog = appData.catalog.map((item) => { // Преобразуем массив товаров в массив карточек товаров.
		const card = new Card(cloneTemplate(cardCatalogTemplate), { // Создаем экземпляр класса Card для представления карточки товара.
			onClick: () => events.emit('card:select', item), // При клике на карточку генерируем событие 'card:select'.
		});
		return card.render({ // Отрисовываем карточку товара.
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			id: item.id,
		});
	});
});

events.on('card:select', (item: ProductItem) => { // Подписываемся на событие 'card:select' (выбор карточки товара).
	appData.setPreview(item); // Устанавливаем товар для предпросмотра.
});

events.on('preview:show', (item: ProductItem) => { // Подписываемся на событие 'preview:show' (показ предпросмотра товара).
	const isInBasket:boolean = !!appData.basket.find(i => i.id === appData.preview); // Проверяем, находится ли товар в корзине.
	const showItem = (item: ProductItem) => { // Функция для отображения товара.
		const card = new Card(cloneTemplate(cardPreviewTemplate), { // Создаем экземпляр класса Card для представления карточки товара в предпросмотре.
			onClick: () => { // При клике на карточку.
				if (!isInBasket) { // Если товара нет в корзине.
					events.emit('product:order', item); // Генерируем событие 'product:order' (добавление товара в корзину).
					modal.close(); // Закрываем модальное окно.
				}
				else { // Если товар есть в корзине.
					events.emit('card:delete', item); // Генерируем событие 'card:delete' (удаление товара из корзины).
				}
			},
		});
		modal.render({ // Отрисовываем модальное окно с карточкой товара.
			content: card.render({ // Отрисовываем карточку товара.
				title: item.title,
				image: item.image,
				description: item.description,
				price: item.price,
				category: item.category,
				id: item.id,
			}, isInBasket), // Передаем флаг isInBasket для отображения кнопки "Удалить из корзины".
		});
	};

	if (item) { // Если товар существует.
		showItem(appData.catalog.find(i => i.id === appData.preview)); // Отображаем товар.
	} else { 
		modal.close(); // Закрываем модальное окно.
	}
});

events.on('product:order', (item: ProductItem) => { // Подписываемся на событие 'product:order' (добавление товара в корзину).
	appData.addToBasket(item); // Добавляем товар в корзину.
	page.counter = appData.basket.length; // Обновляем счетчик товаров в корзине.
});

events.on('basket:open', () => { // Подписываемся на событие 'basket:open' (открытие корзины).
	let index: number = 0; // Инициализируем переменную index для нумерации товаров в корзине.
	basket.items = appData.basket.map((item) => { // Преобразуем массив товаров в корзине в массив карточек товаров для корзины.
		const card = new Card(cloneTemplate(cardBasketTemplate), { // Создаем экземпляр класса Card для представления карточки товара в корзине.
			onClick: () => events.emit('card:delete', item), // При клике на карточку генерируем событие 'card:delete'.
		});
		return card.render({ // Отрисовываем карточку товара.
			index: ++index, // Устанавливаем индекс товара.
			title: item.title,
			price: item.price,
			id: item.id,
		}, false); // Передаем false, так как карточка в корзине не должна отображать кнопку "Удалить из корзины".
	});
	basket.total = appData.getTotal(); // Обновляем общую стоимость товаров в корзине.
	modal.render({ // Отрисовываем модальное окно с корзиной.
		content: basket.render(), // Отрисовываем корзину.
	});
});

events.on('card:delete', (item: ProductItem) => { // Подписываемся на событие 'card:delete' (удаление товара из корзины).
	appData.deleteFromBasket(item); // Удаляем товар из корзины.
	page.counter = appData.basket.length; // Обновляем счетчик товаров в корзине.
	events.emit('basket:open'); // Открываем корзину заново, чтобы обновить ее содержимое.
});

events.on( // Подписываемся на событие 'formErrors:change' (изменение ошибок в форме).
	'formErrors:change',
	({ payment, address, email, phone }: Partial<IOrder>) => { // Получаем объект с ошибками.
		order.valid = !payment && !address; // Устанавливаем флаг валидности формы заказа.
		contacts.valid = !email && !phone; // Устанавливаем флаг валидности формы контактов.
		order.errors = Object.values({ payment, address }) // Формируем массив сообщений об ошибках для формы заказа.
			.filter((i) => !!i) // Фильтруем пустые сообщения.
			.join('; '); // Объединяем сообщения в строку, разделяя их точкой с запятой.
		contacts.errors = Object.values({ email, phone }) // Формируем массив сообщений об ошибках для формы контактов.
			.filter((i) => !!i) // Фильтруем пустые сообщения.
			.join('; '); // Объединяем сообщения в строку, разделяя их точкой с запятой.
	}
);

events.on( // Подписываемся на событие 'input:change' (изменение значения поля ввода).
	'input:change',
	(data: { field: keyof IOrderForm; value: string }) => { // Получаем объект с информацией о поле и его значении.
		appData.setOrderField(data.field, data.value); // Устанавливаем значение поля в данных приложения.
	}
);

events.on('order:open', () => { // Подписываемся на событие 'order:open' (открытие формы заказа).
	appData.order.total = appData.getTotal(); // Вычисляем общую стоимость заказа.
	appData.order.items = appData.basket.map((item) => { // Формируем массив идентификаторов товаров в заказе.
		return item.id;
	});
	modal.render({ // Отрисовываем модальное окно с формой заказа.
		content: order.render({ // Отрисовываем форму заказа.
			payment: '', // Устанавливаем начальное значение способа оплаты.
			address: '', // Устанавливаем начальное значение адреса.
			valid: false, // Устанавливаем флаг валидности формы.
			errors: [], // Устанавливаем массив ошибок.
		}),
	});
});

events.on('order:submit', () => { // Подписываемся на событие 'order:submit' (отправка формы заказа).
	modal.render({ // Отрисовываем модальное окно с формой контактов.
		content: contacts.render({ // Отрисовываем форму контактов.
			email: '', // Устанавливаем начальное значение email.
			phone: '', // Устанавливаем начальное значение телефона.
			valid: false, // Устанавливаем флаг валидности формы.
			errors: [], // Устанавливаем массив ошибок.
		}),
	});
});

events.on('contacts:submit', () => { // Подписываемся на событие 'contacts:submit' (отправка формы контактов).
	api // Отправляем запрос на оформление заказа.
		.orderProducts(appData.order) // Вызываем метод orderProducts из класса WebLarekApi, передавая данные заказа.
		.then((result) => { // Обрабатываем успешный ответ от API.
			const success = new Success(cloneTemplate(successTemplate), { // Создаем экземпляр класса Success для отображения сообщения об успешном завершении заказа.
				onClick: () => { // При клике на кнопку закрытия.
					modal.close(); // Закрываем модальное окно.
					appData.clearBasket(); // Очищаем корзину.
					appData.clearOrder(); // Очищаем данные заказа.
					page.counter = 0; // Обновляем счетчик товаров в корзине.
				},
			});

			modal.render({ // Отрисовываем модальное окно с сообщением об успешном завершении заказа.
				content: success.render({ // Отрисовываем сообщение об успешном завершении заказа.
					total: result.total, // Передаем общую стоимость заказа.
				}),
			});
		})
		.catch((err) => { // Обрабатываем ошибку при оформлении заказа.
			console.error(err); // Выводим ошибку в консоль.
		});
});

events.on('modal:open', () => { // Подписываемся на событие 'modal:open' (открытие модального окна).
	page.locked = true; // Блокируем прокрутку страницы.
});

events.on('modal:close', () => { // Подписываемся на событие 'modal:close' (закрытие модального окна).
	page.locked = false; // Разблокируем прокрутку страницы.
});

// Получаем список товаров с API.
api // Вызываем метод getProductList из класса WebLarekApi.
	.getProductList() // Получаем список товаров.
	.then((data) => { // Обрабатываем успешный ответ от API.
		appData.setCatalog(data); // Устанавливаем каталог товаров.
	})
	.catch((err) => { // Обрабатываем ошибку при получении списка товаров.
		console.error(err); // Выводим ошибку в консоль.
	});