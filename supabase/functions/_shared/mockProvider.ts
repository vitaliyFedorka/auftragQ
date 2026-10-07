import type { AIProvider, ExtractedOrder, OrderSummaryInput, ReplyTone } from './aiProvider.ts';

/**
 * Deterministic, regex-based extraction. No API key, no network call — lets the app be
 * demoed end-to-end for free, and gives a provider-swap target for openaiProvider.ts.
 * Understands the German/English phrasing used by the product's target customers.
 */

const WEEKDAYS: Record<string, number> = {
  sonntag: 0,
  sunday: 0,
  montag: 1,
  monday: 1,
  dienstag: 2,
  tuesday: 2,
  mittwoch: 3,
  wednesday: 3,
  donnerstag: 4,
  thursday: 4,
  freitag: 5,
  friday: 5,
  samstag: 6,
  saturday: 6,
};

const ORDER_TYPE_KEYWORDS: { pattern: RegExp; label: string }[] = [
  { pattern: /geburtstagsstrauß|birthday bouquet/i, label: 'Birthday bouquet' },
  { pattern: /hochzeitsstrauß|wedding bouquet/i, label: 'Wedding bouquet' },
  { pattern: /tischdeko|table decoration/i, label: 'Table decoration' },
  { pattern: /blumenkorb|flower basket/i, label: 'Flower basket' },
  { pattern: /blumenstrauß|bouquet/i, label: 'Bouquet' },
  { pattern: /flowers|blumen/i, label: 'Flowers' },
];

const COLOR_WORDS: { pattern: RegExp; label: string }[] = [
  { pattern: /rosa|pink/i, label: 'pink' },
  { pattern: /weiß|weiss|white/i, label: 'white' },
  { pattern: /\brot\b|\bred\b/i, label: 'red' },
  { pattern: /blau|blue/i, label: 'blue' },
  { pattern: /gelb|yellow/i, label: 'yellow' },
  { pattern: /grün|green/i, label: 'green' },
  { pattern: /lila|purple/i, label: 'purple' },
  { pattern: /orange/i, label: 'orange' },
];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function extractDate(text: string, now: Date): string | null {
  const lower = text.toLowerCase();
  if (/heute|today/.test(lower)) return toIsoDate(now);
  if (/morgen|tomorrow/.test(lower)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return toIsoDate(d);
  }
  for (const [name, weekday] of Object.entries(WEEKDAYS)) {
    if (lower.includes(name)) {
      const d = new Date(now);
      const diff = (weekday - d.getDay() + 7) % 7;
      d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
      return toIsoDate(d);
    }
  }
  return null;
}

function extractTime(text: string): string | null {
  const match = text.match(/(\d{1,2})(?:[:.](\d{2}))?\s*uhr/i);
  if (match) {
    const hour = match[1].padStart(2, '0');
    const minute = (match[2] ?? '00').padStart(2, '0');
    return `${hour}:${minute}`;
  }
  const ampm = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (ampm) {
    let hour = Number(ampm[1]) % 12;
    if (ampm[3].toLowerCase() === 'pm') hour += 12;
    const minute = (ampm[2] ?? '00').padStart(2, '0');
    return `${String(hour).padStart(2, '0')}:${minute}`;
  }
  return null;
}

function extractBudget(text: string): number | null {
  const range = text.match(/(\d+)\s*[-–]\s*(\d+)\s*€/);
  if (range) {
    return Math.round((Number(range[1]) + Number(range[2])) / 2);
  }
  const single = text.match(/(\d+)\s*€|€\s*(\d+)/);
  if (single) {
    return Number(single[1] ?? single[2]);
  }
  return null;
}

function extractCustomerName(text: string): string | null {
  const match = text.match(/^([A-ZÄÖÜ][a-zäöüß]+)\s+(?:braucht|benötigt|needs|wants|möchte)/);
  return match ? match[1] : null;
}

function extractOrderType(text: string): string | null {
  for (const { pattern, label } of ORDER_TYPE_KEYWORDS) {
    if (pattern.test(text)) return label;
  }
  return null;
}

function extractPreferences(text: string): string[] {
  const found = new Set<string>();
  for (const { pattern, label } of COLOR_WORDS) {
    if (pattern.test(text)) found.add(label);
  }
  return Array.from(found);
}

function extractDeliveryRequired(text: string): boolean {
  return /lieferung|liefern|delivery|deliver/i.test(text);
}

function extractDeliveryAddress(text: string): string | null {
  const match = text.match(/(?:lieferung\s+)?(?:nach|to)\s+([A-ZÄÖÜ][\wäöüßÄÖÜ-]+)/);
  return match ? match[1] : null;
}

function buildTitle(orderType: string | null, customerName: string | null): string {
  if (orderType && customerName) return `${orderType} for ${customerName}`;
  if (orderType) return orderType;
  return 'New order from message';
}

function extractOrder(text: string): ExtractedOrder {
  const now = new Date();
  const customerName = extractCustomerName(text);
  const orderType = extractOrderType(text);
  const deliveryRequired = extractDeliveryRequired(text);

  return {
    customerName,
    orderType,
    title: buildTitle(orderType, customerName),
    date: extractDate(text, now),
    time: extractTime(text),
    budget: extractBudget(text),
    deliveryRequired,
    deliveryAddress: deliveryRequired ? extractDeliveryAddress(text) : null,
    preferences: extractPreferences(text),
    notes: null,
  };
}

function generateReply(order: OrderSummaryInput, tone: ReplyTone): string {
  const dateText = order.date ? ` on ${order.date}` : '';
  const fulfillmentText = order.fulfillment === 'delivery' ? 'delivery' : 'pickup';
  const priceText = `${order.price} ${order.currency}`;

  const templates: Record<ReplyTone, string> = {
    friendly: `Hi! Just confirming your order "${order.title}"${dateText} for ${priceText}, with ${fulfillmentText}. Let me know if anything needs to change — looking forward to it!`,
    professional: `Dear customer, this confirms your order "${order.title}"${dateText}. Total: ${priceText} (${fulfillmentText}). Please let us know if you have any questions.`,
    short: `Order "${order.title}"${dateText} confirmed — ${priceText}, ${fulfillmentText}.`,
    warm: `Hello! Thank you so much for your order "${order.title}"${dateText}. It will be ${priceText} total with ${fulfillmentText}. We can't wait to make this special for you!`,
  };
  return templates[tone];
}

export const mockProvider: AIProvider = {
  extractOrderFromText(text) {
    return Promise.resolve(extractOrder(text));
  },
  generateCustomerReply(order, tone) {
    return Promise.resolve(generateReply(order, tone));
  },
  summarizeConversation(messages) {
    return Promise.resolve(messages.join(' ').slice(0, 280));
  },
};
