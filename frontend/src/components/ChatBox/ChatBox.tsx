import React from 'react';
import styles from './ChatBox.module.css';
import { CloseIcon } from '../../icons/Close';
import { MaximizeIcon } from '../../icons/Maximize';
import { MinimizeIcon } from '../../icons/Minimize';
import { SidebarLeftIcon } from '../../icons/SIdeBarLeft';
import { SettingIcon } from '../../icons/Setting';
import { SendIcon } from '../../icons/Send';
import { Avatar } from '../Avatar/Avatar';

type Message = {
    ava?: string;
    user?: string;
};

const temp_data: Message[] = [
    {
        ava: 'Hi jane, \n Amazing how Mosey is simplifying state compliance \n for businesses across the board!',
    },
    { user: 'Hi, thanks for connecting!' },
    {
        ava: 'Hi jane, \n Amazing how Mosey is simplifying state compliance \n for businesses across the board!',
    },
    { user: 'Hi, thanks for connecting!' },
    {
        ava: 'Hi jane, \n Amazing how Mosey is simplifying state compliance \n for businesses across the board!',
    },
    {
        ava: 'Hi jane, \n Amazing how Mosey is simplifying state compliance \n for businesses across the board!',
    },
    { user: 'Hi, thanks for connecting!' },
    {
        ava: 'Hi jane, \n Amazing how Mosey is simplifying state compliance \n for businesses across the board!',
    },
];

export const ChatBox: React.FC = () => {
    const [isMaximized, setIsMaximized] = React.useState<boolean>(false);
    const [data, setData] = React.useState<Message[]>([...temp_data]);
    const chatRef = React.useRef<HTMLDivElement | null>(null);
    const [text, setText] = React.useState<string>('');

    const handleKeyPress = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                setText(text + '\n');
                event.preventDefault();
            } else {
                event.preventDefault();
                sendMessage();
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const sendMessage = () => {
        setData([...data, { user: text }]);
        setText('');
    };

    const editText = (index: number, value: string) => {
        setText(value);
    };

    const inStyleCss = {
        width: isMaximized ? `calc(100% - 40px)` : '320px',
        height: isMaximized ? `calc(100% - 40px)` : '568px',
    };

    React.useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [data]);

    return (
        <div className={styles.chatBox} style={inStyleCss}>
            <div className={styles.boxController}>
                <div>
                    <span
                        className={styles.icons}
                        onClick={() => setIsMaximized(!isMaximized)}
                    >
                        {isMaximized ? <MinimizeIcon /> : <MaximizeIcon />}
                    </span>
                    <span className={styles.icons}>
                        <SidebarLeftIcon />
                    </span>
                </div>
                <div>
                    <span className={styles.icons}>
                        <CloseIcon />
                    </span>
                </div>
            </div>
            <div className={styles.chatWindow} data-testid="chat-window" ref={chatRef}>
                <div className={styles.chatHeader}>
                    <Avatar
                        src="ava.png"
                        alt="Ava Image"
                        height={'50px'}
                        width={'50px'}
                        scale={1.8}
                        top={'19px'}
                    />
                    <h3 className={styles.title}>Hey👋, I'm Ava</h3>
                    <p>Ask me anything or pick a place to start</p>
                </div>
                <div className={styles.chatBody}>
                    {data.map((item, index) => {
                        const value = item.ava ?? item.user ?? '';
                        return (
                            <div
                                className={`${styles.message} ${
                                    item.ava ? styles.ava : ''
                                }`}
                                key={index}
                                onDoubleClick={
                                    item.user
                                        ? () => editText(index, value)
                                        : undefined
                                }
                            >
                                {item.ava && (
                                    <Avatar
                                        src="ava.png"
                                        alt="Ava Image"
                                        height={'30px'}
                                        width={'30px'}
                                        scale={1.8}
                                        top={'11px'}
                                    />
                                )}
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: value.replace(/\n/g, '<br />'),
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.chatInput}>
                <div className={styles.inputBox}>
                    <Avatar
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="User Image"
                    />
                    <textarea
                        value={text}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Your question"
                    />
                </div>
                <div className={styles.chatFooter}>
                    <div className={styles.contextBox}>
                        <span className={styles.context}>Context</span>
                        <select name="context">
                            <option value="onboarding">Onboarding</option>
                            <option value="support">Support</option>
                            <option value="sales">Sales</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className={styles.chatController}>
                        <span className={styles.icons}>
                            <SettingIcon />
                        </span>
                        <span className={styles.icons}>
                            <SendIcon />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
