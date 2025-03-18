import { View } from '../base/view';
import { IFormState } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

export class Form<T> extends View<IFormState> { // Предоставляет общую логику для работы с формами.
	protected _submit: HTMLButtonElement; // Поле для хранения кнопки отправки формы.
	protected _errors: HTMLElement; // Поле для хранения элемента, отображающего ошибки валидации.

	constructor(protected container: HTMLFormElement, protected events: IEvents) { 
		super(container); 

		this._submit = ensureElement<HTMLButtonElement>( // Находим кнопку отправки формы внутри контейнера.
			'button[type=submit]', 
			this.container // Контейнер, в котором ищем кнопку.
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container); // Находим элемент для отображения ошибок валидации внутри контейнера.

		this.container.addEventListener('input', (e: Event) => { // Добавляем обработчик события ввода на форму.
			const target = e.target as HTMLInputElement; // Получаем целевой элемент события (поле ввода).
			const field = target.name as keyof T; // Получаем имя поля ввода и приводим его к типу ключа T.
			const value = target.value; // Получаем значение поля ввода.
			this.onInputChange(field, value); 
		});

		this.container.addEventListener('submit', (e: Event) => { // Добавляем обработчик события отправки на форму.
			e.preventDefault(); // Предотвращаем отправку формы по умолчанию.
			this.events.emit(`${this.container.name}:submit`); // Генерируем событие с именем, составленным из имени формы и ':submit'.
		});
	}

	protected onInputChange(field: keyof T, value: string) { // Метод, вызываемый при изменении значения поля ввода.
		this.events.emit('input:change', { // Генерируем событие 'input:change'.
			field, // Передаем имя поля.
			value, // Передаем значение поля.
		});
	}

	set valid(value: boolean) { 
		this._submit.disabled = !value; 
	}

	set errors(value: string) { 
		this.setText(this._errors, value); 
	}

	render(state: T & IFormState) { // Метод для отрисовки формы.
		const { valid, errors, ...inputs } = state; // Делим состояние формы на valid, errors и inputs.
		super.render({ valid, errors }); // Вызываем метод render базового класса, передавая valid и errors.
		Object.assign(this, inputs); // Копируем свойства из inputs в текущий экземпляр класса.
		return this.container; 
	}
}