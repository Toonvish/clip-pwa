import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import NumberInput from '../../controls/Inputs/NumberInput';
import LabelWrapper from '../../controls/LabelWrapper';
import Button from '../../controls/Layout/Button';
import Footer from '../../controls/Layout/Footer';
import { useUpdateValue } from '../../hooks/useUpdateValue';
import { containerLeakageCalculator } from '../../utils/clipCalc';
import { hasRequiredValues } from '../../utils/helper';
import type { CalcProps } from '../../utils/types';

type ContainerLeakageValues = {
	volume: number | undefined;
	onPressure: number | undefined;
	offPressure: number | undefined;
	measureTime: number | undefined;
};

const defaultContainerLeakageValues: ContainerLeakageValues = {
	volume: undefined,
	onPressure: undefined,
	offPressure: undefined,
	measureTime: undefined,
};

const getEmail = (containerLeakageValues: ContainerLeakageValues, leakage: number | undefined) => `
    Behältervolumen [l]: ${containerLeakageValues.volume}%0D%0A
	Druckbehälteranfangsdruck [barÜ]:  ${containerLeakageValues.onPressure}%0D%0A
	Druckbehälterenddruck [barÜ]:  ${containerLeakageValues.offPressure}%0D%0A
	Messzeit [s]:  ${containerLeakageValues.measureTime}%0D%0A
	Leckagemenge [m3/min]:  ${leakage}
`;

const ContainerLeakageCalculator: FC<CalcProps> = ({ hasFooter = true }) => {
	const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
	const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
	const [containerLeakageValues, setContainerLeakageValues] = useState<ContainerLeakageValues>(
		defaultContainerLeakageValues,
	);
	const [getContainerLeakageValues, updateContainerLeakageValues] = useUpdateValue(
		containerLeakageValues,
		setContainerLeakageValues,
	);
	const resetValues = () => setContainerLeakageValues(defaultContainerLeakageValues);

	const result = useMemo(() => {
		const { volume = 0, onPressure = 0, offPressure = 0, measureTime = 0 } = containerLeakageValues;
		if (!hasRequiredValues(containerLeakageValues)) return;
		return containerLeakageCalculator(volume, onPressure, offPressure, measureTime);
	}, [containerLeakageValues]);

	const startTimer = () => {
		setIsMeasuring(true);
		const startTime = new Date();
		//starts an interval that refreshes the measureTime every 50 milliseconds
		intervalRef.current = setInterval(() => {
			if (!startTime) return;
			const currentTime = new Date();
			const time = currentTime.getTime() - startTime.getTime();
			updateContainerLeakageValues('measureTime')(Math.round(time / 1000));
		}, 50);
	};

	const stopTimer = () => {
		setIsMeasuring(false);
		clearInterval(intervalRef.current);
	};

	//clear intervalRef when component is unmounted
	useEffect(() => {
		return () => clearInterval(intervalRef.current);
	}, []);

	return (
		<>
			<LabelWrapper label="Behältervolumen [l]:">
				<NumberInput
					number={getContainerLeakageValues('volume')}
					onNumberChange={updateContainerLeakageValues('volume')}
				/>
			</LabelWrapper>
			<LabelWrapper label="Druckbehälteranfangsdruck [barÜ]:">
				<NumberInput
					number={getContainerLeakageValues('onPressure')}
					onNumberChange={updateContainerLeakageValues('onPressure')}
				/>
			</LabelWrapper>
			<LabelWrapper label="Druckbehälterenddruck [barÜ]:">
				<NumberInput
					number={getContainerLeakageValues('offPressure')}
					onNumberChange={updateContainerLeakageValues('offPressure')}
				/>
			</LabelWrapper>
			<LabelWrapper label="Messzeit [s]:">
				<div className="flex w-full items-center gap-2">
					<NumberInput
						className="grow"
						number={getContainerLeakageValues('measureTime')}
						onNumberChange={updateContainerLeakageValues('measureTime')}
					/>
					<Button onClick={isMeasuring ? stopTimer : startTimer}>{isMeasuring ? 'Stop' : 'Start'}</Button>
				</div>
			</LabelWrapper>
			<LabelWrapper label="Leckagemenge [m3/min]:">
				<NumberInput number={result} disabled={true} />
			</LabelWrapper>
			{hasFooter && (
				<Footer
					resetValues={resetValues}
					subject="Behälter Leckage"
					getEmail={() => getEmail(containerLeakageValues, result)}
				/>
			)}
		</>
	);
};

export default ContainerLeakageCalculator;
