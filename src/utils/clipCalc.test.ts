import { describe, expect, it } from 'bun:test';
import {
	airCurrentCalculator,
	condensateCalculator,
	containerCalculator,
	leakageCalculator,
} from './clipCalc';

describe('leakageCalculator', () => {
	// air, 20 °C, 8 bar abs upstream
	const leak = (p2: number) => leakageCalculator(8, p2, 20, 1.4, 287.1, 1, 0, 'leakageCurrent')[0];

	it('is continuous at the critical pressure ratio', () => {
		const critical = (2 / 2.4) ** 3.5;
		const below = leak(8 * (critical - 1e-6));
		const above = leak(8 * (critical + 1e-6));
		expect(Math.abs(below - above) / above).toBeLessThan(1e-3);
	});
	it('uses the maximum outflow function of air (0.484) when choked', () => {
		// 1 mm hole, 8 bar: m = A * 0.484 * sqrt(2 * p1 * rho), volume at p1 density
		const rho = 800000 / 287.1 / 293;
		const expected = ((Math.PI / 4) * 1e-6 * 0.484 * Math.sqrt(2 * 800000 * rho)) / rho;
		expect(leak(1)).toBeCloseTo(expected * 60000, 0);
	});
});

describe('containerCalculator', () => {
	it('does not round the volume to 10 litres', () => {
		// 0.1 m³/min delivered, 0.05 needed, 30 cycles/h, 1 bar diff -> 0.05 m³ -> 50 l
		expect(containerCalculator(0.1, 0.05, 30, 7, 6, 0, 'volume')).toBeCloseTo(50, 1);
	});
	it('is the inverse of the engine tolerance calculation', () => {
		const volume = containerCalculator(5, 2, 20, 8, 7, 0, 'volume');
		const tolerance = containerCalculator(5, 2, 0, 8, 7, volume, 'engineTolerance');
		expect(tolerance).toBeCloseTo(20, 1);
	});
});

describe('airCurrentCalculator', () => {
	it('keeps enough precision for small areas', () => {
		expect(airCurrentCalculator(800, 4, 0, 'area')).toBeCloseTo(0.0556, 4);
	});
});

describe('condensateCalculator', () => {
	const result = condensateCalculator(20, 50, 10, 7, 50, 5, 2);
	it('sums condensate after compression and after the dryer', () => {
		expect(result.totalLoss).toBeCloseTo(result.condensateLoss + result.coldLoss, 1);
		expect(result.totalLoss).toBeCloseTo(result.waterAmount - result.coldHumidity, 1);
	});
	it('treats the pressure as gauge pressure', () => {
		const abs = condensateCalculator(20, 50, 10, 0, 50, 5, 1);
		const gauge = condensateCalculator(20, 50, 10, 7, 50, 5, 1);
		expect(abs.remainingHumidity / gauge.remainingHumidity).toBeCloseTo(8, 0);
	});
});
