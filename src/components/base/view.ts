//Предоставляет общую функциональность для работы с DOM-элементами.
export abstract class View<T> {
	protected constructor(protected readonly container: HTMLElement) {} // Конструктор принимает HTML-элемент-контейнер и сохраняет его в защищенном поле.

	protected setText(element: HTMLElement, value: unknown) { // Метод для установки текстового содержимого элемента.
		if (element) { 
			element.textContent = String(value); // Устанавливаем текстовое содержимое, преобразуя значение в строку.
		}
	}

	protected setDisabled(element: HTMLElement, state: boolean) { // Метод для установки или снятия атрибута disabled.
		if (element) { 
			if (state) element.setAttribute('disabled', 'disabled'); 
			else element.removeAttribute('disabled'); 
		}
	}

	protected setImage(element: HTMLImageElement, src: string, alt?: string) { // Метод для установки атрибутов src и alt для изображения.
		if (element) { 
			element.src = src; 
			if (alt) { 
				element.alt = alt; 
			}
		}
	}

	render(data?: Partial<T>): HTMLElement { // Метод для отрисовки представления.
		Object.assign(this as object, data ?? {}); // Копируем свойства из data в текущий экземпляр класса.
		return this.container; // Возвращаем контейнер, в котором должно быть представление.
	}
}