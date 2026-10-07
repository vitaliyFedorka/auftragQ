import { Linking } from 'react-native';

function digitsOnly(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export function callPhone(phone: string): Promise<void> {
  return Linking.openURL(`tel:${digitsOnly(phone)}`);
}

export function openWhatsApp(phone: string): Promise<void> {
  return Linking.openURL(`https://wa.me/${digitsOnly(phone).replace(/^\+/, '')}`);
}

export function sendEmail(email: string): Promise<void> {
  return Linking.openURL(`mailto:${email}`);
}
