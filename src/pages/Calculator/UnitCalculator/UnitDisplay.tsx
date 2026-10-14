import NumberInput from '../../../controls/Inputs/NumberInput';
import LabelWrapper from '../../../controls/LabelWrapper';

// keeps 6 significant digits so small values (e.g. 1 l/min in m³/s) are not rounded to 0
const roundPrecise = (value: number) => Number(value.toPrecision(6));

export type UnitType<Type, Key extends keyof Type = keyof Type> = {
	[Property in Key]: {
		label: string;
		modificator: number | ((value: number, srcKey: Key) => number);
		value: number | undefined;
	};
};

function getOptions<Type>(type: UnitType<Type>) {
	return Object.keys(type).map((key) => ({
		key: key as keyof UnitType<Type>,
		...type[key as keyof UnitType<Type>],
	}));
}

function getTypeKeys<Type, Key extends keyof Type = keyof Type>(type: UnitType<Type>): Key[] {
	return Object.keys(type).map((key) => key as Key);
}

interface UnitDisplayProps<Type> {
	unitValues: UnitType<Type>;
	setUnitValues: (unitValues: UnitType<Type>) => void;
}

const UnitDisplay = <Type,>({ unitValues, setUnitValues }: UnitDisplayProps<Type>) => {
	const updateValue = (key: keyof Type) => (value: number | undefined) => {
		if (value === undefined || Number.isNaN(value)) {
			setUnitValues({ ...unitValues, [key]: { ...unitValues[key], value } });
			return;
		}

		const getValue = (fieldKey: keyof Type) => {
			const modificator = unitValues[key].modificator;
			if (typeof modificator === 'function') return roundPrecise(modificator(value, fieldKey));
			const fieldModificator = unitValues[fieldKey].modificator;
			if (typeof fieldModificator === 'function') return value;
			return roundPrecise((value / modificator) * fieldModificator);
		};

		const updatedValue: UnitType<Type> = { ...unitValues };
		for (const currentKey of getTypeKeys(unitValues)) {
			const currentValue = unitValues[currentKey];
			updatedValue[currentKey] = {
				...currentValue,
				value: key !== currentKey ? getValue(currentKey) : value,
			};
		}
		setUnitValues(updatedValue);
	};

	const options = getOptions(unitValues);

	return (
		<>
			{options.map(({ key, label }) => (
				<LabelWrapper label={label} key={key.toString()}>
					<NumberInput number={unitValues[key].value} onNumberChange={updateValue(key)} />
				</LabelWrapper>
			))}
		</>
	);
};

export default UnitDisplay;
