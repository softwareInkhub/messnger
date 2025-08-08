import { VALIDATION_CONSTANTS } from './constants';

// Validation utility functions
export class ValidationUtils {
  // Validate phone number
  static validatePhoneNumber(phoneNumber: string): { isValid: boolean; error?: string } {
    if (!phoneNumber) {
      return { isValid: false, error: 'Phone number is required' };
    }

    if (phoneNumber.length < VALIDATION_CONSTANTS.PHONE_NUMBER.MIN_LENGTH) {
      return { isValid: false, error: `Phone number must be at least ${VALIDATION_CONSTANTS.PHONE_NUMBER.MIN_LENGTH} digits` };
    }

    if (phoneNumber.length > VALIDATION_CONSTANTS.PHONE_NUMBER.MAX_LENGTH) {
      return { isValid: false, error: `Phone number cannot exceed ${VALIDATION_CONSTANTS.PHONE_NUMBER.MAX_LENGTH} digits` };
    }

    if (!VALIDATION_CONSTANTS.PHONE_NUMBER.PATTERN.test(phoneNumber)) {
      return { isValid: false, error: 'Invalid phone number format' };
    }

    return { isValid: true };
  }

  // Validate message
  static validateMessage(message: string): { isValid: boolean; error?: string } {
    if (!message) {
      return { isValid: false, error: 'Message is required' };
    }

    if (message.length < VALIDATION_CONSTANTS.MESSAGE.MIN_LENGTH) {
      return { isValid: false, error: `Message must be at least ${VALIDATION_CONSTANTS.MESSAGE.MIN_LENGTH} character` };
    }

    if (message.length > VALIDATION_CONSTANTS.MESSAGE.MAX_LENGTH) {
      return { isValid: false, error: `Message cannot exceed ${VALIDATION_CONSTANTS.MESSAGE.MAX_LENGTH} characters` };
    }

    return { isValid: true };
  }

  // Validate user ID
  static validateUserId(userId: string): { isValid: boolean; error?: string } {
    if (!userId) {
      return { isValid: false, error: 'User ID is required' };
    }

    if (userId.length < VALIDATION_CONSTANTS.USER_ID.MIN_LENGTH) {
      return { isValid: false, error: `User ID must be at least ${VALIDATION_CONSTANTS.USER_ID.MIN_LENGTH} character` };
    }

    if (userId.length > VALIDATION_CONSTANTS.USER_ID.MAX_LENGTH) {
      return { isValid: false, error: `User ID cannot exceed ${VALIDATION_CONSTANTS.USER_ID.MAX_LENGTH} characters` };
    }

    return { isValid: true };
  }

  // Validate email
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
  }

  // Validate API response
  static validateApiResponse(response: any): { isValid: boolean; error?: string } {
    if (!response) {
      return { isValid: false, error: 'No response received' };
    }

    if (response.error) {
      return { isValid: false, error: response.error };
    }

    return { isValid: true };
  }

  // Sanitize input
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  // Format phone number
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // Add + if not present
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  }
}


