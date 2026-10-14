import { type FC, useState } from 'react';
import ListSelect, { type ListOption } from '../../../controls/Inputs/ListSelect';
import LabelWrapper from '../../../controls/LabelWrapper';
import UnitDisplay, { type UnitType } from './UnitDisplay';

type UnitTypes = 'pressure' | 'volume' | 'power' | 'temperature' | 'volumeCurrent';

const options: ListOption<UnitTypes>[] = [
	{ label: 'Druck', key: 'pressure', value: 'pressure' },
	{ label: 'Volumen', key: 'volume', value: 'volume' },
	{ label: 'Leistung', key: 'power', value: 'power' },
	{ label: 'Temperatur', key: 'temperature', value: 'temperature' },
	{ label: 'Volumenstrom', key: 'volumeCurrent', value: 'volumeCurrent' },
];

type PressureValues = {
	kpa: number | undefined;
	bar: number | undefined;
	psi: number | undefined;
};

const pressureType: UnitType<PressureValues> = {
	kpa: { label: 'Kpa', modificator: 1, value: undefined },
	bar: { label: 'Bar', modificator: 0.01, value: undefined },
	psi: { label: 'Psi', modificator: 0.145038, value: undefined },
};

type PowerValues = {
	kw: number | undefined;
	ps: number | undefined;
};

const powerType: UnitType<PowerValues> = {
	kw: { label: 'KW', modificator: 1, value: undefined },
	ps: { label: 'PS', modificator: 1.35962, value: undefined },
};

type VolumeValues = {
	meter: number | undefined;
	liter: number | undefined;
};

const volumeType: UnitType<VolumeValues> = {
	meter: { label: 'm³', modificator: 1, value: undefined },
	liter: { label: 'l', modificator: 1000, value: undefined },
};

type TemperaturValues = {
	celsius: number | undefined;
	kelvin: number | undefined;
	fahrenheit: number | undefined;
};

const temperatureType: UnitType<TemperaturValues> = {
	celsius: {
		label: 'Celsius',
		modificator: (value, srcKey) => {
			if (srcKey === 'fahrenheit') return value * (9 / 5) + 32;
			if (srcKey === 'kelvin') return value - 273.15;
			return value;
		},
		value: undefined,
	},
	kelvin: {
		label: 'Kelvin',
		modificator: (value, srcKey) => {
			if (srcKey === 'fahrenheit') return (value - 273.15) * (9 / 5) + 32;
			if (srcKey === 'celsius') return value - 273.15;
			return value;
		},
		value: undefined,
	},
	fahrenheit: {
		label: 'Fahrenheit',
		modificator: (value, srcKey) => {
			if (srcKey === 'celsius') return (value - 32) * (5 / 9);
			if (srcKey === 'kelvin') return (value - 32) * (5 / 9) + 273.15;
			return value;
		},
		value: undefined,
	},
};

type VolumeCurrentValues = {
	meterSecond: number | undefined;
	meterMinute: number | undefined;
	meterHour: number | undefined;
	literSecond: number | undefined;
	literMinute: number | undefined;
};

const volumeCurrentType: UnitType<VolumeCurrentValues> = {
	meterSecond: { label: 'm³/s', modificator: 1, value: undefined },
	meterMinute: { label: 'm³/min', modificator: 60, value: undefined },
	meterHour: { label: 'm³/h', modificator: 3600, value: undefined },
	literSecond: { label: 'l/s', modificator: 1000, value: undefined },
	literMinute: { label: 'l/min', modificator: 60000, value: undefined },
};

const UnitCalculator: FC = () => {
	const [selected, setSelected] = useState<ListOption<UnitTypes>>(options[0]);

	const [pressureValues, setPressureValues] = useState(pressureType);
	const [powerValues, setPowerValues] = useState(powerType);
	const [volumeValues, setVolumeValues] = useState(volumeType);
	const [temperatureValues, setTemperatureValues] = useState(temperatureType);
	const [volumeCurrentValues, setVolumeCurrentValues] = useState(volumeCurrentType);

	const getUnitDisplay = () => {
		switch (selected.value) {
			case 'pressure':
				return <UnitDisplay unitValues={pressureValues} setUnitValues={setPressureValues} />;
			case 'volume':
				return <UnitDisplay unitValues={volumeValues} setUnitValues={setVolumeValues} />;
			case 'power':
				return <UnitDisplay unitValues={powerValues} setUnitValues={setPowerValues} />;
			case 'temperature':
				return <UnitDisplay unitValues={temperatureValues} setUnitValues={setTemperatureValues} />;
			case 'volumeCurrent':
				return <UnitDisplay unitValues={volumeCurrentValues} setUnitValues={setVolumeCurrentValues} />;
			default:
				return;
		}
	};

	return (
		<>
			<LabelWrapper label="Einheit">
				<ListSelect options={options} selected={selected} onOptionChange={setSelected} />
			</LabelWrapper>
			{getUnitDisplay()}
		</>
	);
};

export default UnitCalculator;
