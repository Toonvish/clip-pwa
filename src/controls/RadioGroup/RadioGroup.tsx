import { createContext, type FC, type PropsWithChildren, useContext } from 'react';

type RadioContextProps = {
	selected: string;
	onSelectChange: (selected: string) => void;
};

const RadioContext = createContext<RadioContextProps | undefined>(undefined);

interface RadioGroupProps extends RadioContextProps, PropsWithChildren {}

const RadioGroup: FC<RadioGroupProps> = ({ selected, onSelectChange, children }) => {
	return <RadioContext.Provider value={{ selected, onSelectChange }}>{children}</RadioContext.Provider>;
};

export default RadioGroup;
export function useRadioGroup() {
	const context = useContext(RadioContext);
	if (!context) throw new Error("useRadioGroup can't be used outside a RadioGroup component.");
	return context;
}
