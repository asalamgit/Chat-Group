import { IMessage } from '../../../../../../interfaces/IMessage';
import classes from './Message.module.scss';

interface Props {
	message: IMessage;
}

const Message = (props: Props) => {
	const parseDate = () => {
		const date = new Date(props.message.createdAt);
		const now = new Date();
		const diffInDays = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

		if (diffInDays > 1 || diffInDays < 0) {
			const formattedDate = date.toLocaleDateString('fr-FR', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			});

			const formattedTime = date.toLocaleTimeString('fr-FR', {
				hour: '2-digit',
				minute: '2-digit',
			});

			return `${formattedDate} ${formattedTime}`;
		} else if (diffInDays === 1) {
			const formattedTime = date.toLocaleTimeString('fr-FR', {
				hour: '2-digit',
				minute: '2-digit',
			});

			return `Yesterday at ${formattedTime}`;
		} else {
			const formattedTime = date.toLocaleTimeString('fr-FR', {
				hour: '2-digit',
				minute: '2-digit',
			});

			return `Today at ${formattedTime}`;
		}
	};

	return (
		<div className={classes.message}>
			<img src={`http://${process.env.REACT_APP_API_URL}:3000/${props.message.user.photo}`} alt="ProfilePhoto" />
			<div className={classes.messageRight}>
				<div className={classes.messageRightTop}>
					<p className={classes.name}>{props.message.user.name}</p>
					<p className={classes.date}>{parseDate()}</p>
				</div>
				<p className={classes.content}>{props.message.content}</p>
			</div>
		</div>
	);
};

export default Message;
