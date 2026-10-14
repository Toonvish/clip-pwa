import { type AllHTMLAttributes, type FC, useEffect, useState } from 'react';
import Input from './Input';

export interface NumberInputProps
	extends Omit<AllHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
	number: number | undefined;
	onNumberChange?: (number: number | undefined) => void;
	max?: number;
	min?: number;
}

const NumberInput: FC<NumberInputProps> = ({ max, min, number, onNumberChange, ...props }) => {
	const [text, setText] = useState<string>('');

	const handelTextChange = (text: string) => {
		if (text.length === 0) {
			setText('');
			onNumberChange?.(undefined);
			return;
		}
		const regex = new RegExp(/^-?[0-9]*\.?[0-9]*$/);
		const result = text.match(regex);
		if (result === null) return;
		let isChanged = false;
		let number = Number.parseFloat(text);
		if (!Number.isNaN(number)) {
			if (max !== undefined && number > max) {
				number = max;
				isChanged = true;
			}
			if (min !== undefined && number < min) {
				number = min;
				isChanged = true;
			}
			onNumberChange?.(number);
		}
		setText(isChanged ? number.toString() : text);
	};

	useEffect(() => {
		if (
			(text.length === 0 && number !== undefined) ||
			(text.length !== 0 && Number.parseFloat(text) !== number)
		)
			setText(number?.toString() ?? '');
	}, [text, number]);

	if (max !== undefined && min !== undefined && max < min)
		throw new Error("min value can't be higher than max value");

	return (
		<Input
			{...props}
			value={text}
			onChange={(event) => handelTextChange(event.target.value)}
			type={'number'}
		/>
	);
};

export default NumberInput;
