// ============================================================================
// ENUMS
// ============================================================================
export enum ChatUserRole {
	CUSTOMER = 'customer',
	PHARMACIST = 'pharmacist',
}

// ============================================================================
// CHAT MESSAGE MODEL
// ============================================================================
export type ChatMessage = {
	id: number;
	customerId: number;
	pharmacistId: number;
	message: string;
	sentAt: string;
};

// ============================================================================
// SOCKET EVENTS
// ============================================================================
export type SendMessagePayload = {
	senderId: number;
	receiverId: number;
	senderRole: ChatUserRole;
	message: string;
};

// ============================================================================
// GET CHAT HISTORY (User)
// ============================================================================
export type GetChatHistoryParams = {
	pharmacistId: number;
};

export type GetChatHistoryResponse = ChatMessage[];

// ============================================================================
// GET CHATS FOR PHARMACIST
// ============================================================================
export type PharmacistChat = {
	id: number;
	customerId: number;
	pharmacistId: number;
	message: string;
	sentAt: string;
	customer?: {
		id: number;
		fullName: string;
	};
};

export type GetChatsForPharmacistResponse = PharmacistChat[];
