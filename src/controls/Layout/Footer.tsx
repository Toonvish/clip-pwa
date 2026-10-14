import { useStore } from '@nanostores/react';
import type { FC } from 'react';
import { $email } from '../../utils/stores';
import Button from './Button';

interface FooterProps {
	resetValues: () => void;
	getEmail: () => string;
	subject: string;
}

const LINE_BREAK = '%0D%0A';

// the mail bodies mark line breaks with %0D%0A, everything else has to be encoded (e.g. the % in "[%]")
const encodeMailText = (text: string) => text.split(LINE_BREAK).map(encodeURIComponent).join(LINE_BREAK);

const Footer: FC<FooterProps> = ({ resetValues, getEmail, subject }) => {
	const email = useStore($email);
	return (
		<div className={'flex gap-2'}>
			<Button onClick={resetValues}>Zurücksetzen</Button>
			<a
				className="rounded-md bg-gradient-to-tr from-rose-500 to-rose-700 py-2 px-3 text-lg text-white shadow-md"
				href={`mailto:${email}?subject=${encodeMailText(subject)}&body=${encodeMailText(getEmail())}`}
			>
				Ergebnis als Mail
			</a>
		</div>
	);
};

export default Footer;
