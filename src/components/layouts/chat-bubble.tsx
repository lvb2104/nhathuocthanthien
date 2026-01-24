'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, X, Send, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatHistory, useChatSocket, useOnlinePharmacists } from '@/hooks';
import { ChatMessage, ChatUserRole } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { routes } from '@/configs/routes';

type Conversation = {
	pharmacistId: number;
	pharmacistName: string;
	pharmacistAvatar?: string | null;
	lastMessage?: string;
	lastMessageTime?: string;
	unreadCount?: number;
};

export function ChatBubble() {
	const { data: session } = useSession();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [activeConversation, setActiveConversation] =
		useState<Conversation | null>(null);
	const [conversations, setConversations] = useState<Conversation[]>([]);

	// Fetch online pharmacists
	const { data: onlinePharmacists, isLoading: _isLoadingPharmacists } =
		useOnlinePharmacists();

	// Sync online pharmacists to conversations when they change
	useEffect(() => {
		if (onlinePharmacists && onlinePharmacists.length > 0) {
			setConversations(prev => {
				// Keep existing conversations that are still online, add new ones
				const existingIds = new Set(prev.map(c => c.pharmacistId));
				const onlineIds = new Set(onlinePharmacists.map(p => p.id));

				// Filter existing to only keep those still online
				const stillOnline = prev.filter(c => onlineIds.has(c.pharmacistId));

				// Add new online pharmacists
				const newPharmacists = onlinePharmacists
					.filter(p => !existingIds.has(p.id))
					.map(p => ({
						pharmacistId: p.id,
						pharmacistName: p.fullName,
						pharmacistAvatar: p.avatarUrl,
					}));

				return [...stillOnline, ...newPharmacists];
			});
		} else if (onlinePharmacists && onlinePharmacists.length === 0) {
			// Fallback to default pharmacist ID 3 when no online pharmacists found
			setConversations([
				{
					pharmacistId: 3,
					pharmacistName: 'Dược sĩ tư vấn',
				},
			]);
		}
	}, [onlinePharmacists]);
	const [inputValue, setInputValue] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Check authentication status
	const user = session?.user;
	const isCustomer = user?.role === 'customer';
	const userId = user?.id;
	const isAuthenticated = !!user;

	// Chat history for active conversation
	const { data: chatHistory, isLoading: isLoadingHistory } = useChatHistory(
		{ pharmacistId: activeConversation?.pharmacistId || 0 },
		undefined,
	);

	// Socket connection
	const {
		isConnected,
		messages: socketMessages,
		sendMessage,
		clearMessages,
	} = useChatSocket({
		userId: userId || 0,
		receiverId: activeConversation?.pharmacistId || 0,
		userRole: ChatUserRole.CUSTOMER,
	});

	// Combine history and socket messages
	const allMessages = useMemo<ChatMessage[]>(
		() => [...(chatHistory || []), ...socketMessages],
		[chatHistory, socketMessages],
	);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [allMessages]);

	// Clear socket messages when switching conversations
	useEffect(() => {
		clearMessages();
	}, [activeConversation?.pharmacistId, clearMessages]);

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

	// Handler for opening chat - requires authentication
	const handleOpenChat = useCallback(() => {
		if (!isAuthenticated) {
			toast.info('Vui lòng đăng nhập để sử dụng tính năng chat.');
			router.push(
				`${routes.auth.signIn}?callbackUrl=${encodeURIComponent(routes.home)}`,
			);
			return;
		}

		if (!isCustomer) {
			toast.info('Chỉ tài khoản khách hàng mới có thể sử dụng tính năng chat.');
			return;
		}

		setIsOpen(!isOpen);
		if (!isOpen && conversations.length === 1) {
			setActiveConversation(conversations[0]);
		}
	}, [isAuthenticated, isCustomer, isOpen, conversations, router]);

	// Add pharmacist to conversations (called from product detail page)
	const addConversation = useCallback(
		(pharmacistId: number, pharmacistName: string) => {
			const newConv = { pharmacistId, pharmacistName };
			setConversations(prev => {
				if (prev.some(c => c.pharmacistId === pharmacistId)) {
					return prev;
				}
				return [...prev, newConv];
			});
			// Open chat bubble and set this as active conversation
			setIsOpen(true);
			setActiveConversation(newConv);
		},
		[],
	);

	// Expose addConversation to window for external usage (e.g., from product detail page)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			(
				window as Window & { addChatConversation?: typeof addConversation }
			).addChatConversation = addConversation;
		}
		return () => {
			if (typeof window !== 'undefined') {
				delete (
					window as Window & { addChatConversation?: typeof addConversation }
				).addChatConversation;
			}
		};
	}, [addConversation]);

	// Show chat bubble for all users, but only customers can actually use it

	return (
		<>
			{/* Floating Chat Bubble Button */}
			<button
				onClick={handleOpenChat}
				className={cn(
					'fixed right-4 bottom-16 z-50 flex items-center justify-center',
					'w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg',
					'hover:bg-primary/90 transition-all duration-300 cursor-pointer',
					'hover:scale-105 active:scale-95',
					isOpen && 'opacity-0 pointer-events-none',
				)}
			>
				<MessageCircle className='w-6 h-6' />
			</button>

			{/* Chat Window */}
			<div
				className={cn(
					'fixed right-4 bottom-16 z-50 flex flex-col',
					'w-[360px] h-[500px] max-h-[80vh]',
					'bg-background border rounded-2xl shadow-2xl',
					'transition-all duration-300 ease-out origin-bottom-right',
					isOpen
						? 'scale-100 opacity-100'
						: 'scale-0 opacity-0 pointer-events-none',
				)}
			>
				{/* Header */}
				<div className='flex items-center gap-3 p-4 border-b bg-primary text-primary-foreground rounded-t-2xl'>
					{activeConversation && conversations.length > 1 && (
						<button
							onClick={() => setActiveConversation(null)}
							className='p-1 hover:bg-white/20 rounded cursor-pointer'
						>
							<ChevronLeft className='w-5 h-5' />
						</button>
					)}
					<div className='flex-1'>
						<h3 className='font-semibold'>
							{activeConversation
								? activeConversation.pharmacistName
								: 'Tin nhắn'}
						</h3>
						{activeConversation && (
							<p className='text-xs opacity-80'>
								{isConnected ? 'Đang hoạt động' : 'Đang kết nối...'}
							</p>
						)}
					</div>
					<button
						onClick={() => {
							setIsOpen(false);
							setActiveConversation(null);
						}}
						className='p-1 hover:bg-white/20 rounded cursor-pointer'
					>
						<X className='w-5 h-5' />
					</button>
				</div>

				{/* Content */}
				<div className='flex-1 overflow-hidden'>
					{!activeConversation ? (
						// Conversation List
						<div className='h-full overflow-y-auto'>
							{conversations.length === 0 ? (
								<div className='flex items-center justify-center h-full text-muted-foreground'>
									Chưa có cuộc trò chuyện
								</div>
							) : (
								<div className='divide-y'>
									{conversations.map(conv => (
										<button
											key={conv.pharmacistId}
											onClick={() => setActiveConversation(conv)}
											className='w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors text-left cursor-pointer'
										>
											{conv.pharmacistAvatar ? (
												<Image
													src={conv.pharmacistAvatar}
													alt={conv.pharmacistName}
													className='w-10 h-10 rounded-full object-cover'
												/>
											) : (
												<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
													<MessageCircle className='w-5 h-5 text-primary' />
												</div>
											)}
											<div className='flex-1 min-w-0'>
												<p className='font-medium text-sm truncate'>
													{conv.pharmacistName}
												</p>
												<p className='text-xs text-muted-foreground truncate'>
													{conv.lastMessage || 'Dược sĩ tư vấn'}
												</p>
											</div>
											{conv.unreadCount && conv.unreadCount > 0 && (
												<span className='bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5'>
													{conv.unreadCount}
												</span>
											)}
										</button>
									))}
								</div>
							)}
						</div>
					) : (
						// Messages View
						<div className='flex flex-col h-full'>
							{/* Messages */}
							<div className='flex-1 overflow-y-auto p-4 space-y-3'>
								{isLoadingHistory ? (
									<div className='flex items-center justify-center h-full text-muted-foreground'>
										Đang tải tin nhắn...
									</div>
								) : allMessages.length === 0 ? (
									<div className='flex items-center justify-center h-full text-muted-foreground text-sm'>
										Bắt đầu cuộc trò chuyện với dược sĩ
									</div>
								) : (
									<>
										{allMessages.map(msg => {
											const isOwn = msg.customerId === userId;

											return (
												<div
													key={msg.id}
													className={cn(
														'flex',
														isOwn ? 'justify-end' : 'justify-start',
													)}
												>
													<div
														className={cn(
															'max-w-[80%] px-4 py-2 rounded-2xl',
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
																isOwn
																	? 'text-white/70'
																	: 'text-muted-foreground',
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
						</div>
					)}
				</div>
			</div>
		</>
	);
}
