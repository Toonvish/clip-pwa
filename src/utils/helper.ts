/**
 * If the given value is a valid number execute the setValue and setUnit function
 * @param value
 * @param setValue
 * @param type
 * @param setUnit
 * @returns
 */
export const handleUnit = (
	value: string,
	setValue: (value: string) => void,
	type: number,
	setUnit: (number: number, type: number) => void,
) => {
	const number = Number.parseFloat(value);
	if (value === '') setValue('');
	if (Number.isNaN(number)) return;
	setValue(value);
	setUnit(number, type);
};

/**
 * Generates a random id with the given length. Default is 24
 * @param length
 */
export const generateId = (length = 24) => {
	return new Array(length)
		.fill(0)
		.map(() => (Math.random() * 16).toString(16)[0])
		.reduce((a, b) => a + b);
};

/**
 * If the value is NaN, infinite or undefined return undefined
 * @param value
 * @returns
 */
export function checkNaN(value: number | undefined): number | undefined {
	if (value === undefined) return undefined;
	return Number.isFinite(value) ? value : undefined;
}

/**
 * checks if all values in the given object except for the given key are not undefined
 * @param value
 * @param resultKey
 */
export function hasRequiredValues<Type extends object, Key extends keyof Type = keyof Type>(
	value: Type,
	resultKey?: Key,
) {
	return !Object.entries(value).some(([k, v]) => k !== resultKey && v === undefined);
}

/**
 * Rounds the given value to the given length
 * @param result
 * @param length
 * @returns
 */
export function round(value: number, length = 2) {
	const moveLength = 10 ** length;
	return Math.round(value * moveLength) / moveLength;
}
