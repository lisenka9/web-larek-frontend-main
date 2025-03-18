import { View } from '../base/view';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IModalView } from '../../types';

export class Modal extends View<IModalView> {
	protected _closeButton: HTMLButtonElement; // Поле для хранения кнопки закрытия модального окна.
	protected _content: HTMLElement; // Поле для хранения элемента, отображающего контент модального окна.

	constructor(container: HTMLElement, protected events: IEvents) { 
		super(container); 

		this._closeButton = ensureElement<HTMLButtonElement>( // Находим кнопку закрытия модального окна внутри контейнера.
			'.modal__close', 
			container // Контейнер, в котором ищем кнопку.
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container); // Находим элемент, отображающий контент модального окна.

		this._closeButton.addEventListener('click', this.close.bind(this)); // Добавляем обработчик события нажатия на кнопку закрытия.
		this.container.addEventListener('click', this.close.bind(this)); // Добавляем обработчик события нажатия на контейнер модального окна (для закрытия при клике вне контента).
		this._content.addEventListener('click', (event) => event.stopPropagation()); // Добавляем обработчик события нажатия на контент модального окна (чтобы клики внутри контента не закрывали модальное окно).
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value); // Заменяем содержимое элемента _content на переданный HTML-элемент.
	}

	open() { // Метод для открытия модального окна.
		this.container.classList.add('modal_active'); // Добавляем класс 'modal_active' к контейнеру, чтобы отобразить модальное окно.
		this.events.emit('modal:open'); // Генерируем событие 'modal:open'
	}

	close() { // Метод для закрытия модального окна.
		this.container.classList.remove('modal_active'); // Удаляем класс 'modal_active' из контейнера, чтобы скрыть модальное окно.
		this.content = null; // Очищаем контент модального окна.
		this.events.emit('modal:close'); // Генерируем событие 'modal:close'.
	}

	render(data: IModalView): HTMLElement { // Метод для отрисовки модального окна.
		super.render(data);
		this.open();
		return this.container;
	}
}