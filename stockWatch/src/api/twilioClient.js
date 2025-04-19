import { Client as TwilioClient } from '@twilio/conversations';

let twilioClient = null;

export const initTwilio = async (token) => {
  try {
    if (!twilioClient) {
        twilioClient = new TwilioClient(token);

    }
    return twilioClient;
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error);
    throw error;
  }
};

export const getTwilioClient = () => twilioClient;
