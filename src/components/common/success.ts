import { View } from '../base/view';
import { ensureElement } from '../../utils/utils';
import { ISuccess } from '../../types';
import { formatNumber } from '../../utils/utils';

interface ISuccessActions { // Интерфейс, описывающий действия, которые можно выполнить в компоненте Success.
	onClick: () => void; // Функция, вызываемая при клике на кнопку закрытия.
}

export class Success extends View<ISuccess> { // Отображает сообщение об успешном завершении заказа.
	protected _close: HTMLElement; // Поле для хранения кнопки закрытия.
	protected _total: HTMLElement; // Поле для хранения элемента, отображающего общую сумму заказа.

	constructor(container: HTMLElement, actions: ISuccessActions) { 
		super(container); 

		this._close = ensureElement<HTMLElement>( // Находим кнопку закрытия внутри контейнера.
			'.order-success__close', 
			this.container // Контейнер, в котором ищем кнопку.
		);
		this._total = ensureElement<HTMLElement>( // Находим элемент, отображающий общую сумму заказа внутри контейнера.
			'.order-success__description', 
			this.container // Контейнер, в котором ищем элемент.
		);

		if (actions?.onClick) { // Проверяем, передана ли функция onClick в параметре actions.
			this._close.addEventListener('click', actions.onClick); // Добавляем обработчик события click на кнопку закрытия.
		}
	}

	set total(value: number) { 
		this._total.textContent = `Списано ${formatNumber(value)} синапсов`; 
	}
}