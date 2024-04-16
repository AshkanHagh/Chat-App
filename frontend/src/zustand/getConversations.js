import { create } from 'zustand'

const getConversations = create(set => ({
    autoCompleteConversation: null,
    addAutoCompleteConversation: conversation => set({ autoCompleteConversation: conversation[0] ? conversation : null }),
    conversations: [],
    addConversations: conversation => set({ conversations: conversation }),
    addConLoading: false,
    setAddConLoading: (state) => set({ addConLoading: state })
}))

export default getConversations