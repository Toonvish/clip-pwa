import { round } from '../../../utils/helper';
import type {
	EnergyPriceResult,
	EnergyPriceValues,
	EnergyType,
	RoomHeaterResult,
	RoomHeaterValues,
} from './RoomHeaterTypes';

export function calcRoomHeating(roomHeatingValues: RoomHeaterValues): RoomHeaterResult {
	const {
		motorOutputPower = 0,
		motorEfficiency = 0,
		usageHours = 0,
		usageMonths = 0,
		heatTransferEfficiency = 0,
	} = roomHeatingValues;

	const motorPowerUsage = motorEfficiency > 0 ? motorOutputPower / (motorEfficiency / 100) : 0;
	const availableOilPower = motorOutputPower * 0.72;
	const availableAirPower = motorOutputPower * 0.94;
	const heatPowerEfficiencyWithHeatTransfer = availableOilPower * (heatTransferEfficiency / 100);
	const generatedHeatPowerWRG =
		usageHours * 30 * availableOilPower * (heatTransferEfficiency / 100) * usageMonths;
	const generatedHeatPowerAir = usageHours * 30 * usageMonths * availableAirPower;
	return {
		motorPowerUsage: round(motorPowerUsage),
		availableOilPower: round(availableOilPower),
		availableAirPower: round(availableAirPower),
		heatPowerEfficiencyWithHeatTransfer: round(heatPowerEfficiencyWithHeatTransfer),
		generatedHeatPowerWRG: round(generatedHeatPowerWRG, 0),
		generatedHeatPowerAir: round(generatedHeatPowerAir, 0),
	};
}

export function calcEnergyPrice(
	energyPriceValues: EnergyPriceValues,
	energyType: EnergyType,
	roomHeatingResult: RoomHeaterResult,
): EnergyPriceResult {
	const {
		price = 0,
		consumptionYear = 0,
		outputPower = 0,
		co2Emissions = 0,
		heaterEfficiency = 0,
	} = energyPriceValues;
	const { generatedHeatPowerWRG, generatedHeatPowerAir } = roomHeatingResult;
	const isOil = energyType === 'heatOil';
	const completePrice = price * consumptionYear;
	const generatedEnergy = outputPower * (isOil ? 100 : 1) * consumptionYear;
	const heatPowerEfficiency = (heaterEfficiency / 100) * generatedEnergy;
	const savingsWRGPrice = isOil
		? (completePrice / heatPowerEfficiency) * generatedHeatPowerWRG
		: (completePrice / generatedEnergy) * generatedHeatPowerWRG;
	const savingsAirPrice = (completePrice / generatedEnergy) * generatedHeatPowerAir;
	const factor = isOil ? 100 : 12;
	const savingsWRGCo2 = (generatedEnergy / factor - generatedHeatPowerWRG / factor) * co2Emissions;
	const savingsAirCo2 = (generatedEnergy / factor - generatedHeatPowerAir / factor) * co2Emissions;

	return {
		completePrice: round(completePrice),
		generatedEnergy: round(generatedEnergy),
		heatPowerEfficiency: round(heatPowerEfficiency),
		savingsWRGHeat: {
			price: round(savingsWRGPrice, 0),
			co2: round(savingsWRGCo2, 0),
		},
		savingsAir: {
			price: round(savingsAirPrice, 0),
			co2: round(savingsAirCo2, 0),
		},
	};
}
