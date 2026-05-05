import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faqData } from '../data/mockData';
import type { ChatMessage } from '../types';
import styles from './ChatPage.module.css';

function getBotResponse(input: string, fallback: string): string {
  const lower = input.toLowerCase();

  for (const faq of faqData) {
    if (faq.keywords.some((keyword) => lower.includes(keyword.toLowerCase()))) {
      return faq.answer;
    }
  }

  return fallback;
}

export default function ChatPage() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      role: 'bot',
      content: t('chat.initialMessage'),
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    t('chat.quickQuestionWifi'),
    t('chat.quickQuestionTrash'),
    t('chat.quickQuestionAircon'),
    t('chat.quickQuestionExtend'),
    t('chat.quickQuestionEmergency'),
  ];

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].id !== 'm0') return prev;
      return [{ ...prev[0], content: t('chat.initialMessage') }];
    });
  }, [i18n.language, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: 'bot',
        content: getBotResponse(text, t('chat.unknownResponse')),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.botAvatar}>💬</span>
        <div>
          <div className={styles.botName}>{t('chat.supportName')}</div>
          <div className={styles.botStatus}>{t('common.online')}</div>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.botMessage}`}
          >
            {message.role === 'bot' && <span className={styles.msgAvatar}>🤖</span>}
            <div className={styles.msgBubble}>
              {message.content.split('\n').map((line, index, lines) => (
                <span key={`${message.id}-${index}`}>
                  {line}
                  {index < lines.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={styles.quickBtns}>
        {quickQuestions.map((question) => (
          <button key={question} className={styles.quickBtn} onClick={() => sendMessage(question)}>
            {question}
          </button>
        ))}
      </div>

      <form
        className={styles.inputArea}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat.type_message')}
          className={styles.input}
        />
        <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
          {t('chat.send')}
        </button>
      </form>
    </div>
  );
}
