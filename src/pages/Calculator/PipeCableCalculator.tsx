import { type FC, useMemo, useState } from 'react';
import ListSelect from '../../controls/Inputs/ListSelect';
import LabelRadioInput from '../../controls/LabelRadioInput';
import LabelText from '../../controls/LabelText';
import Footer from '../../controls/Layout/Footer';
import RadioGroup from '../../controls/RadioGroup/RadioGroup';
import { type GetDocValue, useUpdateValue } from '../../hooks/useUpdateValue';
import { type PipeResult, pipeCalculator, type SelectedPipeValue } from '../../utils/clipCalc';
import { checkNaN, hasRequiredValues } from '../../utils/helper';
import type { CalcProps } from '../../utils/types';

export type PipeValues = {
	volume: number | undefined;
	length: number | undefined;
	pressureLoss: number | undefined;
	netPressure: number | undefined;
	diameter: number | undefined;
};

export type VolumeUnit = 'm³/m' | 'm³/h';

const defaultPipeValues: PipeValues = {
	volume: undefined,
	length: undefined,
	netPressure: undefined,
	pressureLoss: undefined,
	diameter: undefined,
};

const getEmail = (getValues: GetDocValue<PipeValues>, result: PipeResult | undefined) => `
	Gesamtvolumenstrom V[m³/m]:  ${getValues('volume')}%0D%0A
	Stömungstechnische Rohrlänge L[m]: ${getValues('length')}%0D%0A
	Druckverlust [bar]: ${getValues('pressureLoss')}%0D%0A
	Netzdruck bar[ü]: ${getValues('netPressure')}%0D%0A
	Rohrinnendurchmesser di [mm]: ${getValues('diameter')}%0D%0A
	Rohr Volumen [l]: ${result?.pipeVolume ?? 0}%0D%0A
	Geschwindigkeit [m/s]: ${result?.airSpeed ?? 0}
`;

const PipeCableCalculator: FC<CalcProps> = ({ hasFooter = true }) => {
	const [pipeValues, setPipeValues] = useState<PipeValues>(defaultPipeValues);
	const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>('m³/m');
	const [selected, setSelected] = useState<SelectedPipeValue>('diameter');
	const [getPipeValues, updatePipeValues] = useUpdateValue(pipeValues, setPipeValues);

	const resetValues = () => setPipeValues(defaultPipeValues);

	const isPressureError =
		pipeValues.pressureLoss !== undefined &&
		pipeValues.netPressure !== undefined &&
		pipeValues.pressureLoss > pipeValues.netPressure &&
		selected !== 'pressureLoss';

	const result = useMemo(() => {
		const { volume = 0, length = 0, pressureLoss = 0, netPressure = 0, diameter = 0 } = pipeValues;
		if (!hasRequiredValues(pipeValues, selected)) return;
		return pipeCalculator(volume, volumeUnit, length, pressureLoss, netPressure, diameter, selected);
	}, [pipeValues, selected, volumeUnit]);

	const getCalcValue = <Key extends keyof PipeValues>(key: Key) => {
		if (key === selected) return checkNaN(result?.result);
		return getPipeValues(key);
	};

	return (
		<>
			<RadioGroup
				selected={selected}
				onSelectChange={(selected) => setSelected(selected as SelectedPipeValue)}
			>
				<ListSelect
					selected={volumeUnit}
					options={['m³/m', 'm³/h']}
					onStringChange={(unit) => setVolumeUnit(unit as VolumeUnit)}
				/>
				<LabelRadioInput
					number={getCalcValue('volume')}
					selected={selected}
					radioValue={'volume'}
					label={'Volumen:'}
					onNumberChange={updatePipeValues('volume')}
				/>
				<LabelRadioInput
					number={getCalcValue('length')}
					selected={selected}
					radioValue={'length'}
					label={'Länge [m]:'}
					onNumberChange={updatePipeValues('length')}
				/>
				<LabelRadioInput
					number={getCalcValue('pressureLoss')}
					selected={selected}
					radioValue={'pressureLoss'}
					label={'Druckverluste [bar]:'}
					onNumberChange={updatePipeValues('pressureLoss')}
				/>
				<LabelRadioInput
					number={getCalcValue('netPressure')}
					selected={selected}
					radioValue={'netPressure'}
					label={'Netzdruck [barÜ]:'}
					onNumberChange={updatePipeValues('netPressure')}
					errorText={isPressureError ? 'Der Druckverlust kann nicht höher als der Netzdruck sein' : undefined}
				/>
				<LabelRadioInput
					number={getCalcValue('diameter')}
					selected={selected}
					radioValue={'diameter'}
					label={'Rohrinnendurchmesser di[mm]:'}
					onNumberChange={updatePipeValues('diameter')}
				/>
				{!Number.isNaN(result?.pipeVolume ?? Number.NaN) && (
					<LabelText>Das Rohr hat ein Volumen von: {result?.pipeVolume} Liter</LabelText>
				)}
				{!Number.isNaN(result?.airSpeed ?? Number.NaN) && (
					<LabelText>Die Luft Geschwindigkeit beträgt: {result?.airSpeed} [m/s]</LabelText>
				)}
			</RadioGroup>
			{hasFooter && (
				<Footer
					resetValues={resetValues}
					subject="Rohrleitung"
					getEmail={() => getEmail(getCalcValue, result)}
				/>
			)}
		</>
	);
};

export default PipeCableCalculator;
