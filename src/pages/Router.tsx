import {
	createHashHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
} from '@tanstack/react-router';
import type { FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import CalcWrapper from '../controls/CalcWrapper';
import ErrorFallback from '../controls/ErrorFallback';
import AirCurrentCalculator from './Calculator/AirCurrentCalculator';
import CondensateCalculator from './Calculator/CondensateCalculator';
import ContainerCalculator from './Calculator/ContainerCalculator';
import ContainerLeakageCalculator from './Calculator/ContainerLeakageCalculator';
import LeakageCalculator from './Calculator/LeakageCalculator';
import PipeCableCalculator from './Calculator/PipeCableCalculator';
import PressureWorkCalculator from './Calculator/PressureWorkCalculator';
import RoomHeaterCalculator from './Calculator/RoomHeating/RoomHeaterCalculator';
import UnitCalculator from './Calculator/UnitCalculator/UnitCalculator';
import Home from './Home';
import Settings from './Misc/Settings';
import Tools from './Misc/Tools';

const RootComponent: FC = () => {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Outlet />
		</ErrorBoundary>
	);
};

const rootRoute = createRootRoute({
	component: RootComponent,
});

const homeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Home,
});

const containerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/container',
	component: () => (
		<CalcWrapper title={'Behälter Leckage'}>
			<ContainerCalculator />
		</CalcWrapper>
	),
});

const pipeCableRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/pipeCable',
	component: () => (
		<CalcWrapper title={'Rohrleitung'}>
			<PipeCableCalculator />
		</CalcWrapper>
	),
});

const airCurrentRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/airCurrent',
	component: () => (
		<CalcWrapper title={'Lüftungstechnik'}>
			<AirCurrentCalculator />
		</CalcWrapper>
	),
});

const leakageRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/leakage',
	component: () => (
		<CalcWrapper title={'Leckage'}>
			<LeakageCalculator />
		</CalcWrapper>
	),
});

const containerLeakageRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/containerLeakage',
	component: () => (
		<CalcWrapper title={'Behälter Leckage'}>
			<ContainerLeakageCalculator />
		</CalcWrapper>
	),
});

const pressureWorkRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/pressureWork',
	component: () => (
		<CalcWrapper title={'Verdichtungsarbeit'}>
			<PressureWorkCalculator />
		</CalcWrapper>
	),
});

const condensateRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/condensate',
	component: () => (
		<CalcWrapper title={'Kondensat'}>
			<CondensateCalculator />
		</CalcWrapper>
	),
});

const unitsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/units',
	component: () => (
		<CalcWrapper title={'Einheiten Rechner'}>
			<UnitCalculator />
		</CalcWrapper>
	),
});

const roomHeaterRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/roomHeater',
	component: () => (
		<CalcWrapper title={'Raumheizung durch Abluftwärme'}>
			<RoomHeaterCalculator />
		</CalcWrapper>
	),
});

const settingsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/settings',
	component: Settings,
});

const toolsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/tools',
	component: Tools,
});

const routeTree = rootRoute.addChildren([
	homeRoute,
	containerRoute,
	pipeCableRoute,
	airCurrentRoute,
	leakageRoute,
	containerLeakageRoute,
	pressureWorkRoute,
	condensateRoute,
	unitsRoute,
	roomHeaterRoute,
	settingsRoute,
	toolsRoute,
]);

const hashHistory = createHashHistory();

export const router = createRouter({ routeTree, history: hashHistory });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
