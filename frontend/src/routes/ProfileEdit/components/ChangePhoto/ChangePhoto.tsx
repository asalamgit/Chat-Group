import React, { useState } from 'react';
import classes from './ChangePhoto.module.scss';

interface Props {
	setUploadedFile: (newValue: File | null) => void;
	photo: string | null;
}

function ChangePhoto(props: Props) {
	const [selectedFileName, setSelectedFileName] = useState<string>('Change photo');
	const [avatarImg, setAvatarImg] = useState<string>(`http://${process.env.REACT_APP_API_URL}:3000/${props.photo}`);

	const hiddenFileInput = React.useRef<HTMLInputElement>(null);

	const handleClick = () => {
		if (hiddenFileInput.current) hiddenFileInput.current.click();
	};

	const changeAvatarImg = (event: React.FormEvent<HTMLInputElement>) => {
		if (event.currentTarget.files) {
			props.setUploadedFile(event.currentTarget.files[0]);
			try {
				setAvatarImg(URL.createObjectURL(event.currentTarget.files[0]));
			} catch {
				setAvatarImg('');
			}
			try {
				setSelectedFileName(event.currentTarget.files[0].name);
			} catch {
				setSelectedFileName('');
			}
		}
	};

	return (
		<div className={classes.changePhoto}>
			<img className={classes.imgDevChallenge} src={avatarImg} alt="ProfilePhoto" />
			<button className="buttonChooseFile" onClick={handleClick}>
				<span className="material-symbols-outlined">backup</span>
				<p>{selectedFileName}</p>
			</button>
			<input accept="image/png, image/jpeg, image/svg" type="file" ref={hiddenFileInput} onChange={changeAvatarImg} style={{ display: 'none' }} />
		</div>
	);
}

export default ChangePhoto;
