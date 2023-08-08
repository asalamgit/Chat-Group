import classes from './ChannelDetail.module.scss';
import { Dispatch, SetStateAction } from 'react';
import { IChannel } from '../../../../../../interfaces/IChannel';
import { IUser } from '../../../../../../interfaces/IUser';

interface Props {
	selectedChannel: IChannel | null;
	setSelectedChannel: Dispatch<SetStateAction<IChannel | null>>;
	members: IUser[];
}

const ChannelDetail = (props: Props) => {
	return (
		<div className={classes.channelDetail}>
			<div
				className={classes.back}
				onClick={() => {
					props.setSelectedChannel(null);
				}}
			>
				<span className="material-symbols-outlined">keyboard_arrow_left</span>
				<p>All channels</p>
			</div>
			<h5 className={classes.channelName}>{props.selectedChannel && props.selectedChannel.name}</h5>
			<p className={classes.channelDescription}>{props.selectedChannel && props.selectedChannel.description}</p>
			<h5>Members</h5>
			<div className={classes.members}>
				{props.members.map((member: IUser, index: number) => (
					<div className={classes.member} key={index}>
						<img src={`http://${process.env.REACT_APP_API_URL}:3000/${member.photo}`} alt="ProfilePhoto" />
						<p>{member.name}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default ChannelDetail;
