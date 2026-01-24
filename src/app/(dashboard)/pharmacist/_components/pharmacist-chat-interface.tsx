'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePharmacistChats, useChatMessages } from '@/hooks';
import { ChatMessage, ChatUserRole } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

type ActiveConversation = {
	customerId: number;
	customerName: string;
	lastMessage?: string;
	lastMessageTime?: string;
};

export function PharmacistChatInterface() {
	const [activeConversation, setActiveConversation] =
		useState<ActiveConversation | null>(null);
	const [inputValue, setInputValue] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Fetch all conversations for this pharmacist
	const { data: pharmacistChats, isLoading: isLoadingChats } =
		usePharmacistChats();

	// Build conversation list from chats
	const conversations = useMemo<ActiveConversation[]>(() => {
		if (!pharmacistChats || pharmacistChats.length === 0) return [];

		// Group chats by customer
		const convMap = new Map<number, ActiveConversation>();
		pharmacistChats.forEach(chat => {
			const customerId = chat.customerId;
			const existing = convMap.get(customerId);

			// Keep the most recent message
			if (
				!existing ||
				new Date(chat.sentAt) > new Date(existing.lastMessageTime || '')
			) {
				convMap.set(customerId, {
					customerId,
					customerName: chat.customer?.fullName || `Khách hàng ${customerId}`,
					lastMessage: chat.message,
					lastMessageTime: chat.sentAt,
				});
			}
		});

		return Array.from(convMap.values()).sort(
			(a, b) =>
				new Date(b.lastMessageTime || 0).getTime() -
				new Date(a.lastMessageTime || 0).getTime(),
		);
	}, [pharmacistChats]);

	// Socket connection for active conversation
	const {
		isConnected,
		messages: socketMessages,
		sendMessage,
		clearMessages,
	} = useChatMessages({
		receiverId: activeConversation?.customerId || 0,
		userRole: ChatUserRole.PHARMACIST,
	});

	// Get chat history for active conversation
	const chatHistory = useMemo<ChatMessage[]>(() => {
		if (!pharmacistChats || !activeConversation) return [];
		return pharmacistChats.filter(
			chat => chat.customerId === activeConversation.customerId,
		);
	}, [pharmacistChats, activeConversation]);

	// Combine history and socket messages, deduplicate by ID, and sort by time
	const allMessages = useMemo<ChatMessage[]>(() => {
		// Combine both sources
		const combined = [...chatHistory, ...socketMessages];

		// Deduplicate by ID (prefer newer entries from socket)
		const messageMap = new Map<number, ChatMessage>();
		combined.forEach(msg => {
			messageMap.set(msg.id, msg);
		});

		// Convert back to array and sort by sentAt (oldest first)
		return Array.from(messageMap.values()).sort(
			(a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
		);
	}, [chatHistory, socketMessages]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [allMessages]);

	// Clear socket messages when switching conversations
	useEffect(() => {
		clearMessages();
	}, [activeConversation?.customerId, clearMessages]);

	const handleSendMessage = useCallback(() => {
		if (!inputValue.trim() || !activeConversation) return;
		sendMessage(inputValue.trim());
		setInputValue('');
	}, [inputValue, activeConversation, sendMessage]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				handleSendMessage();
			}
		},
		[handleSendMessage],
	);

	return (
		<div className='flex flex-1 rounded-lg border shadow-sm overflow-hidden'>
			{/* Left Panel: Conversation List */}
			<div className='w-80 border-r flex flex-col bg-muted/30'>
				<div className='p-4 border-b bg-background'>
					<h2 className='font-semibold text-sm'>Cuộc trò chuyện</h2>
				</div>
				<div className='flex-1 overflow-y-auto'>
					{isLoadingChats ? (
						<div className='flex items-center justify-center h-32 text-muted-foreground text-sm'>
							Đang tải...
						</div>
					) : conversations.length === 0 ? (
						<div className='flex items-center justify-center h-32 text-muted-foreground text-sm'>
							Chưa có cuộc trò chuyện
						</div>
					) : (
						<div className='divide-y'>
							{conversations.map(conv => (
								<button
									key={conv.customerId}
									onClick={() => setActiveConversation(conv)}
									className={cn(
										'w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors text-left',
										activeConversation?.customerId === conv.customerId &&
											'bg-accent',
									)}
								>
									<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
										<MessageCircle className='w-5 h-5 text-primary' />
									</div>
									<div className='flex-1 min-w-0'>
										<p className='font-medium text-sm truncate'>
											{conv.customerName}
										</p>
										<p className='text-xs text-muted-foreground truncate'>
											{conv.lastMessage || 'Bắt đầu cuộc trò chuyện'}
										</p>
									</div>
									{conv.lastMessageTime && (
										<span className='text-xs text-muted-foreground flex-shrink-0'>
											{formatDistanceToNow(new Date(conv.lastMessageTime), {
												addSuffix: true,
												locale: vi,
											})}
										</span>
									)}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Right Panel: Chat Messages */}
			<div className='flex-1 flex flex-col bg-background'>
				{!activeConversation ? (
					<div className='flex-1 flex items-center justify-center text-muted-foreground'>
						Chọn một cuộc trò chuyện để bắt đầu
					</div>
				) : (
					<>
						{/* Chat Header */}
						<div className='p-4 border-b'>
							<h3 className='font-semibold'>
								{activeConversation.customerName}
							</h3>
							<p className='text-xs text-muted-foreground'>
								{isConnected ? 'Đang hoạt động' : 'Đang kết nối...'}
							</p>
						</div>

						{/* Messages */}
						<div className='flex-1 overflow-y-auto p-4 space-y-3'>
							{allMessages.length === 0 ? (
								<div className='flex items-center justify-center h-full text-muted-foreground text-sm'>
									Bắt đầu cuộc trò chuyện với khách hàng
								</div>
							) : (
								<>
									{allMessages.map((msg, index) => {
										// If senderId === pharmacistId, then pharmacist sent it (right side)
										// If senderId === customerId, then customer sent it (left side)
										const isOwn = msg.senderId === msg.pharmacistId;

										return (
											<div
												key={msg.id || `temp-${index}-${msg.sentAt}`}
												className={cn(
													'flex',
													isOwn ? 'justify-end' : 'justify-start',
												)}
											>
												<div
													className={cn(
														'max-w-[70%] px-4 py-2 rounded-2xl',
														isOwn
															? 'bg-primary text-primary-foreground rounded-br-md'
															: 'bg-muted rounded-bl-md',
													)}
												>
													<p className='text-sm whitespace-pre-wrap break-words'>
														{msg.message}
													</p>
													<p
														className={cn(
															'text-[10px] mt-1',
															isOwn ? 'text-white/70' : 'text-muted-foreground',
														)}
													>
														{msg.sentAt
															? formatDistanceToNow(new Date(msg.sentAt), {
																	addSuffix: true,
																	locale: vi,
																})
															: ''}
													</p>
												</div>
											</div>
										);
									})}
									<div ref={messagesEndRef} />
								</>
							)}
						</div>

						{/* Input Area */}
						<div className='p-3 border-t'>
							<div className='flex items-center gap-2'>
								<input
									type='text'
									value={inputValue}
									onChange={e => setInputValue(e.target.value)}
									onKeyDown={handleKeyPress}
									placeholder='Nhập tin nhắn...'
									className='flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50'
								/>
								<Button
									size='icon'
									onClick={handleSendMessage}
									disabled={!inputValue.trim() || !isConnected}
									className='rounded-full'
								>
									<Send className='w-4 h-4' />
								</Button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
