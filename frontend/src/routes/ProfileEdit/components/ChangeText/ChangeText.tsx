import clsx from 'clsx';
import React from 'react';
import classes from './ChangeText.module.scss';

interface Props {
	title: string;
	placeHolder: string;
	textarea?: boolean;
	password?: boolean;
	value: string | undefined;
	setValue: (newValue: string) => void;
}

function ChangeText(props: Props) {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		props.setValue(event.target.value);
	};

	return (
		<div className={clsx(classes.changeText)}>
			<h2>{props.title}</h2>
			{props.textarea ? <textarea placeholder={props.placeHolder} value={props.value} onChange={handleInputChange}></textarea> : <input type={props.password ? 'password' : 'text'} placeholder={props.placeHolder} value={props.value} onChange={handleInputChange} autoComplete="off"></input>}
		</div>
	);
}

export default ChangeText;
