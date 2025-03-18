import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderResult, IProduct, IWebLarekApi } from '../types';

export class WebLarekApi extends Api implements IWebLarekApi { // Класс для взаимодействия с API WebLarek.
	readonly cdn: string; // Путь к CDN, где хранятся изображения товаров.

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) { 
		super(baseUrl, options); 
		this.cdn = cdn; // Сохраняем путь к CDN.
	}

	getProductList(): Promise<IProduct[]> { // Метод для получения списка товаров.
		return this.get('/product/').then((data:ApiListResponse<IProduct>) => // Выполняем GET-запрос к API по адресу '/product/' и обрабатываем ответ.
			data.items.map((item) => ({ // Преобразуем массив товаров из ответа API.
				...item, // Копируем все свойства товара.
				image: this.cdn + item.image, // Формируем полный URL изображения товара, добавляя путь к CDN.
			}))
		);
	}

	getProductInfo(id: string): Promise<IProduct> { // Метод для получения информации о товаре по его ID.
		return this.get(`/product/${id}`).then((item: IProduct) => ({ // Выполняем GET-запрос к API по адресу `/product/${id}` и обрабатываем ответ.
			...item, // Копируем все свойства товара.
			image: this.cdn + item.image, // Формируем полный URL изображения товара, добавляя путь к CDN.
		}));
	}

	orderProducts(order: IOrder): Promise<IOrderResult> { // Метод для оформления заказа.
		return this.post('/order', order).then((data:IOrderResult) => data); // Выполняем POST-запрос к API по адресу '/order', передавая данные заказа и обрабатываем ответ.
	}
}