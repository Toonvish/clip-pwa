import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import { BiCalculator, BiCylinder, BiWater } from 'react-icons/bi';
import { CgCompressRight, CgTimer } from 'react-icons/cg';
import { FaFan } from 'react-icons/fa';
import { GiHeatHaze, GiPipes, GiTeePipe } from 'react-icons/gi';
import { MdSettings } from 'react-icons/md';

interface IconLinkProps extends PropsWithChildren {
	to: string;
	className?: string;
	title: string;
}

const IconLink: FC<IconLinkProps> = ({ to, title, className, children }) => (
	<Link
		to={to}
		className={clsx(className, 'flex w-full flex-col items-center gap-2 rounded-md bg-rose-600 p-4')}
	>
		{children}
		<span className={'w-full text-center text-xl'}>{title}</span>
	</Link>
);

export const iconClassName = 'w-10 h-10 hover:bg-white/25 rounded-sm hover:cursor-pointer';

const Home: FC = () => {
	return (
		<main className={'flex h-screen flex-col text-white'}>
			<header className={'flex w-full items-center justify-between bg-rose-600 text-white'}>
				<div className="w-10" />
				<span className={'p-2 text-2xl'}>Clip GmbH Drucklufttechnik</span>
				<Link to={'/settings'}>
					<MdSettings className={iconClassName} />
				</Link>
			</header>
			<section className={'m-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2'}>
				<IconLink to={'/pipeCable'} title={'Rohrleitung'}>
					<GiPipes className={'h-10 w-10'} />
				</IconLink>
				<IconLink to={'/leakage'} title={'Leckage'}>
					<GiTeePipe className={'h-10 w-10'} />
				</IconLink>
				<IconLink to={'/airCurrent'} title={'Lüftungstechnik'}>
					<FaFan className={'h-10 w-10'} />
				</IconLink>
				<IconLink to={'/container'} title={'Druckluft Behälter'}>
					<BiCylinder className={'h-10 w-10'} />
				</IconLink>
				<IconLink to={'/containerLeakage'} title={'Behälter Leckage'}>
					<CgTimer className={'h-10 w-10'} />
				</IconLink>
				<IconLink to={'/pressureWork'} title={'Verdichtungsarbeit'}>
					<CgCompressRight className={'h-10 w-10'} />
				</IconLink>
				<IconLink to={'/condensate'} title={'Kondensat'}>
					<BiWater className={'h-10 w-10'} />
				</IconLink>
				<IconLink to={'/units'} title={'Einheiten Rechner'}>
					<BiCalculator className={'h-10 w-10'} />
				</IconLink>
				<IconLink to={'/roomHeater'} title={'Raumheizung durch Abluftwärme'}>
					<GiHeatHaze className={'h-10 w-10'} />
				</IconLink>
			</section>
		</main>
	);
};

export default Home;
