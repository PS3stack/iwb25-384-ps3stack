// Support API client for real backend integration
import { supportAPI as apiSupportAPI } from '@/api/api'

export const supportAPI = {
  sendMessage: async (message: string, sessionHistory: any[] = []) => {
    try {
      console.log('Sending support message:', { message, sessionHistory });
      
      const response = await apiSupportAPI.sendChatMessage({
        message: message,
        sessionHistory: sessionHistory
      })

      console.log('Support API response:', response);

      return { 
        message: response.data.reply || 'Sorry, I could not process your request at this time.',
        success: true 
      }
    } catch (error: any) {
      console.error('Error calling support service:', error);
      
      // Check if it's a 401 error specifically
      if (error.response?.status === 401) {
        console.error('Authentication error - token might be invalid or expired');
        console.error('Error details:', error.response);
        console.error('Request config:', error.config);
        console.error('Request headers:', error.config?.headers);
      }
      
      // Fallback to mock response if service is unavailable
      const fallbackResponses = [
        "I'm sorry, but the support service is currently unavailable. Please try again later.",
        "The chatbot service is temporarily down. For immediate assistance, please contact your system administrator.",
        "I'm having trouble connecting to the support system. Please check your connection and try again."
      ]
      
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      
      return { 
        message: fallbackResponse,
        success: false 
      }
    }
  }
}
