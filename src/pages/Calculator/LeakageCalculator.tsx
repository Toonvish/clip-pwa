import { type FC, useMemo, useState } from 'react';
import Input from '../../controls/Inputs/Input';
import ListSelect, { type ListOption } from '../../controls/Inputs/ListSelect';
import NumberInput from '../../controls/Inputs/NumberInput';
import LabelWrapper from '../../controls/LabelWrapper';
import Footer from '../../controls/Layout/Footer';
import HelperText from '../../controls/Layout/HelperText';
import RadioButton from '../../controls/RadioGroup/RadioButton';
import RadioGroup from '../../controls/RadioGroup/RadioGroup';
import { useUpdateValue } from '../../hooks/useUpdateValue';
import { leakageCalculator, type SelectedLeakageValue } from '../../utils/clipCalc';
import { hasRequiredValues } from '../../utils/helper';
import type { CalcProps } from '../../utils/types';

const mediumOptions: ListOption<MediumType>[] = [
	{ key: 'air', label: 'Luft', value: 'air' },
	{ key: 'oxygen', label: 'Sauerstoff', value: 'oxygen' },
	{ key: 'carbonDioxide', label: 'Kohlenstoffdioxid', value: 'carbonDioxide' },
];

type MediumType = 'air' | 'oxygen' | 'carbonDioxide';

type MediumValues<Type extends MediumType> = {
	[T in Type]: { gas: number; kappa: number };
};

const mediumValues: MediumValues<MediumType> = {
	air: { gas: 287.1, kappa: 1.4 },
	oxygen: { gas: 188.9, kappa: 1.29 },
	carbonDioxide: { gas: 259.8, kappa: 1.4 },
};

type LeakageValues = {
	pressureP1: number | undefined;
	pressureP2: number | undefined;
	temperature: number | undefined;
	kappa: number;
	gas: number;
	leakageCurrent: number | undefined;
	hole: number | undefined;
};

const defaultLeakageValues: LeakageValues = {
	pressureP1: undefined,
	pressureP2: undefined,
	temperature: undefined,
	leakageCurrent: undefined,
	hole: undefined,
	...mediumValues.air,
};

const getEmail = (
	leakageValues: LeakageValues,
	medium: ListOption<MediumType>,
	selected: SelectedLeakageValue,
	result: [number, number] | undefined,
) => {
	const base = `
		Medium: ${medium.label}%0D%0A
		Druck p1 [bar]: ${leakageValues.pressureP1}%0D%0A
		Druck p2 [bar]: ${leakageValues.pressureP2}%0D%0A
		Temperatur [Grad C]: ${leakageValues.temperature}%0D%0A
	`;
	switch (selected) {
		case 'hole':
			return `${base}
Leckagestrom [l/min]: ${leakageValues.leakageCurrent}%0D%0A
Bohrungsdurchmesser maximal [mm]: ${result?.[0]}%0D%0A
Bohrungsdurchmesser minimal [mm]: ${result?.[1]}
		`;
		case 'leakageCurrent':
			return `${base}
Leckagestrom maximal [l/min]: ${result?.[0]}%0D%0A
Leckagestrom minimal [l/min]: ${result?.[1]}%0D%0A
Bohrungsdurchmesser [mm]: ${leakageValues.hole}
		`;
	}
};

const LeakageCalculator: FC<CalcProps> = ({ hasFooter = true }) => {
	const [leakageValues, setLeakageValues] = useState<LeakageValues>(defaultLeakageValues);
	const [selected, setSelected] = useState<SelectedLeakageValue>('hole');
	const [medium, setMedium] = useState<ListOption<MediumType>>(mediumOptions[0]);
	const [getLeakageValues, updateLeakageValues] = useUpdateValue(leakageValues, setLeakageValues);
	const resetValues = () => setLeakageValues(defaultLeakageValues);

	const result = useMemo(() => {
		const {
			pressureP1 = 0,
			pressureP2 = 0,
			temperature = 0,
			leakageCurrent = 0,
			hole = 0,
			kappa,
			gas,
		} = leakageValues;
		if (!hasRequiredValues(leakageValues, selected)) return;
		return leakageCalculator(pressureP1, pressureP2, temperature, kappa, gas, hole, leakageCurrent, selected);
	}, [leakageValues, selected]);

	const selectMediumChange = (option: ListOption<MediumType>) => {
		const medium = option.value;
		if (!medium) return;
		setLeakageValues({ ...leakageValues, ...mediumValues[medium] });
		setMedium(option);
	};

	const isP2Lower = (leakageValues.pressureP1 ?? 0) > (leakageValues.pressureP2 ?? 0);

	return (
		<>
			<LabelWrapper label="Medium">
				<ListSelect
					options={mediumOptions}
					selected={medium}
					onOptionChange={(option) => selectMediumChange(option)}
				/>
			</LabelWrapper>
			<LabelWrapper label="Druck p1 [bar abs]:">
				<NumberInput
					number={getLeakageValues('pressureP1')}
					onNumberChange={updateLeakageValues('pressureP1')}
				/>
			</LabelWrapper>
			<LabelWrapper label="Druck p2 [bar abs]:">
				<NumberInput
					number={getLeakageValues('pressureP2')}
					onNumberChange={updateLeakageValues('pressureP2')}
				/>
			</LabelWrapper>
			{!isP2Lower && leakageValues.pressureP2 !== undefined && (
				<HelperText type="error"> P2 muss kleiner als P1 sein</HelperText>
			)}
			<LabelWrapper label="Temperatur [Grad C]:">
				<NumberInput
					number={getLeakageValues('temperature')}
					onNumberChange={updateLeakageValues('temperature')}
				/>
			</LabelWrapper>
			<RadioGroup
				selected={selected}
				onSelectChange={(selected) => setSelected(selected as SelectedLeakageValue)}
			>
				<LabelWrapper header={<RadioButton value={'leakageCurrent'} label={'Leckagestrom [l/min]:'} />}>
					{selected === 'leakageCurrent' ? (
						<div className="flex flex-wrap gap-2">
							<LabelWrapper label="Min:" className="result-display">
								<Input disabled={true} value={result?.[0]} />
							</LabelWrapper>
							<LabelWrapper label="Max:" className="result-display">
								<Input disabled={true} value={result?.[1]} />
							</LabelWrapper>
						</div>
					) : (
						<NumberInput
							number={getLeakageValues('leakageCurrent')}
							onNumberChange={updateLeakageValues('leakageCurrent')}
						/>
					)}
				</LabelWrapper>
				<LabelWrapper header={<RadioButton label={'Bohrungsdurchmesser [mm]:'} value={'hole'} />}>
					{selected === 'hole' ? (
						<div className="flex flex-wrap gap-2">
							<LabelWrapper label="Min:" className="result-display">
								<Input disabled={true} value={result?.[0]} />
							</LabelWrapper>
							<LabelWrapper label="Max:" className="result-display">
								<Input disabled={true} value={result?.[1]} />
							</LabelWrapper>
						</div>
					) : (
						<NumberInput number={getLeakageValues('hole')} onNumberChange={updateLeakageValues('hole')} />
					)}
				</LabelWrapper>
			</RadioGroup>
			{hasFooter && (
				<Footer
					resetValues={resetValues}
					subject="Leckage"
					getEmail={() => getEmail(leakageValues, medium, selected, result)}
				/>
			)}
		</>
	);
};

export default LeakageCalculator;
