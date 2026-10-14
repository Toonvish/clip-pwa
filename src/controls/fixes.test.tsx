import { describe, expect, it, jest } from 'bun:test';
import { fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import UnitDisplay, { type UnitType } from '../pages/Calculator/UnitCalculator/UnitDisplay';
import NumberInput from './Inputs/NumberInput';
import { encodeMailText } from './Layout/Footer';

describe('NumberInput', () => {
	it('accepts negative and decimal numbers', () => {
		const onChange = jest.fn();
		const { container } = render(<NumberInput number={undefined} onNumberChange={onChange} />);
		const input = container.querySelector('input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: '-5' } });
		expect(onChange).toHaveBeenLastCalledWith(-5);
		fireEvent.change(input, { target: { value: '-0.5' } });
		expect(onChange).toHaveBeenLastCalledWith(-0.5);
	});
});

type Temp = { celsius: number | undefined; kelvin: number | undefined; fahrenheit: number | undefined };
const temperature: UnitType<Temp> = {
	celsius: {
		label: 'C',
		modificator: (v, k) => (k === 'fahrenheit' ? v * (9 / 5) + 32 : k === 'kelvin' ? v + 273.15 : v),
		value: undefined,
	},
	kelvin: { label: 'K', modificator: (v) => v, value: undefined },
	fahrenheit: { label: 'F', modificator: (v) => v, value: undefined },
};

describe('UnitDisplay', () => {
	it('converts 0 and keeps small values', () => {
		const Wrapper = () => {
			const [values, setValues] = useState(temperature);
			return <UnitDisplay unitValues={values} setUnitValues={setValues} />;
		};
		const { container } = render(<Wrapper />);
		const [c, , f] = Array.from(container.querySelectorAll('input'));
		fireEvent.change(c, { target: { value: '0' } });
		expect(f.value).toBe('32');
	});
	it('does not round 1 l/min to 0 m³/s', () => {
		const flow = {
			s: { label: 'm³/s', modificator: 1, value: undefined },
			min: { label: 'l/min', modificator: 60000, value: undefined },
		} satisfies UnitType<{ s: number | undefined; min: number | undefined }>;
		const Wrapper = () => {
			const [values, setValues] =
				useState<UnitType<{ s: number | undefined; min: number | undefined }>>(flow);
			return <UnitDisplay unitValues={values} setUnitValues={setValues} />;
		};
		const { container } = render(<Wrapper />);
		const [s, min] = Array.from(container.querySelectorAll('input'));
		fireEvent.change(min, { target: { value: '1' } });
		expect(Number(s.value)).toBeCloseTo(1 / 60000, 9);
	});
});

describe('mail text', () => {
	it('encodes special characters but keeps line breaks', () => {
		const text = 'Feuchte [%]: 50%0D%0ADruck & Temp #1';
		expect(encodeMailText(text)).toBe('Feuchte%20%5B%25%5D%3A%2050%0D%0ADruck%20%26%20Temp%20%231');
		expect(decodeURIComponent(encodeMailText(text))).toBe('Feuchte [%]: 50\r\nDruck & Temp #1');
	});
});
