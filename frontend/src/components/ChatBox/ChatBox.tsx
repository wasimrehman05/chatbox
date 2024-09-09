import React from 'react';
import styles from './ChatBox.module.css';
import { CloseIcon } from '../../icons/Close';
import { MaximizeIcon } from '../../icons/Maximize';
import { MinimizeIcon } from '../../icons/Minimize';
import { SidebarLeftIcon } from '../../icons/SIdeBarLeft';
import { SettingIcon } from '../../icons/Setting';
import { SendIcon } from '../../icons/Send';
import { Avatar } from '../Avatar/Avatar';
import { fetchMessages, Message } from '../../services/FetchMessages';
import { sendMessage } from '../../services/SendMessage';
import { updateMessage } from '../../services/updateMessage';
import { deleteMessage } from '../../services/deleteMessage';

type ChatData = {
    page_number: number;
    messages: Message[];
};

const first_message =
    'Hi jane, \n Amazing how Mosey is simplifying state compliance \n for businesses across the board!';

export const ChatBox: React.FC = () => {
    const [isMaximized, setIsMaximized] = React.useState<boolean>(false);

    const user_id = React.useRef<number>(1234).current;
    const [data, setData] = React.useState<ChatData>({
        page_number: 1,
        messages: [],
    });
    const [context, setContext] = React.useState<string>('onboarding');
    const chatRef = React.useRef<HTMLDivElement | null>(null);
    const [text, setText] = React.useState<string>('');
    const [selectedMessage, setSelectedMessage] =
        React.useState<Message | null>(null);
    const [updatedText, setUpdatedText] = React.useState<string>('');

    const handleKeyPress = async (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                setText(text + '\n');
                event.preventDefault();
            } else {
                event.preventDefault();
                await handleSend();
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };
    const handleTextChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setUpdatedText(event.target.value);
    };

    const handleSend = async () => {
        if (!text) {
            return;
        }
        const response = await sendMessage({ user_id, context, message: text });
        setData((prevData) => ({
            ...prevData,
            messages: [...prevData.messages, response],
        }));
        setText('');
    };

    const handleEdit = async (message: Message) => {
        if (selectedMessage && selectedMessage.id === message.id) {
            if (updatedText === message.message) {
                return;
            }

            const response: Message = await updateMessage({
                message_id: selectedMessage.id,
                message: updatedText,
            });

            if (response?.id === selectedMessage.id) {
                setUpdatedText('');
                setSelectedMessage(null);
                loadMessages();
            }
        }
    };

    const handleDelete = async (message: Message) => {
        if (selectedMessage && selectedMessage.id === message.id) {
            const response = await deleteMessage(message.id);
            if (response) {
                setUpdatedText('');
                setSelectedMessage(null);
                loadMessages();
            }
        }
    };

    const handleContextChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setContext(event.target.value);
    };

    const inStyleCss = {
        width: isMaximized ? `calc(100% - 40px)` : '320px',
        height: isMaximized ? `calc(100% - 40px)` : '568px',
    };

    const loadMessages = async () => {
        try {
            const response = await fetchMessages(user_id, context, 10);
            setData((prevData) => ({
                ...prevData,
                messages: response.messages, // Use spread operator to merge messages
            }));
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    React.useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [data]);

    React.useEffect(() => {
        loadMessages();
        // eslint-disable-next-line 
    }, [user_id, context]);

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
            <div
                className={styles.chatWindow}
                data-testid="chat-window"
                ref={chatRef}
            >
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
                    <div
                        className={`${styles.message}  ${styles.ava}`}
                        key={`ava-${0}`}
                    >
                        <Avatar
                            src="ava.png"
                            alt="Ava Image"
                            height={'30px'}
                            width={'30px'}
                            scale={1.8}
                            top={'11px'}
                        />
                        <p
                            dangerouslySetInnerHTML={{
                                __html: first_message.replace(/\n/g, '<br />'),
                            }}
                        />
                    </div>
                    {data.messages.map((item) => {
                        return (
                            <>
                                <div
                                    className={`${styles.message}`}
                                    data-testid="chat-message"
                                    key={`user-${item.id}`}
                                    onDoubleClick={() => {
                                        setUpdatedText(item.message);
                                        setSelectedMessage(item);
                                    }}
                                >
                                    <div
                                        className={styles.popup}
                                        style={{
                                            ...inStyleCss,
                                            display:
                                                item.id === selectedMessage?.id
                                                    ? 'flex'
                                                    : 'none',
                                        }}
                                    >
                                        <div>
                                            <span
                                                style={{
                                                    cursor: 'pointer',
                                                    position: 'absolute',
                                                    right: '8px',
                                                    top: '8px',
                                                }}
                                                onClick={() => {
                                                    setUpdatedText('');
                                                    setSelectedMessage(null);
                                                }}
                                            >
                                                <CloseIcon />
                                            </span>
                                            <textarea
                                                value={updatedText}
                                                onChange={handleTextChange}
                                                placeholder="Update your message"
                                            />
                                            <span>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: item.message.replace(
                                                /\n/g,
                                                '<br />'
                                            ),
                                        }}
                                    />
                                </div>
                                <div
                                    className={`${styles.message}  ${styles.ava}`}
                                    key={`ava-${item.id}`}
                                >
                                    <Avatar
                                        src="ava.png"
                                        alt="Ava Image"
                                        height={'30px'}
                                        width={'30px'}
                                        scale={1.8}
                                        top={'11px'}
                                    />
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: item.reply.replace(
                                                /\n/g,
                                                '<br />'
                                            ),
                                        }}
                                    />
                                </div>
                            </>
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
                        <select
                            name="context"
                            value={context}
                            onChange={handleContextChange}
                        >
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
