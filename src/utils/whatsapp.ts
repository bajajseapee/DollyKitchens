import { BUSINESS_INFO } from '../data/menuData';
import { CartItem, CheckoutFormState, PartyEnquiryFormState } from '../types/menu';

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function buildOrderWhatsAppMessage(
  items: CartItem[],
  subtotal: number,
  form: CheckoutFormState
): string {
  const orderDetailsLines = items.map(
    ({ item, quantity }) =>
      `${item.name} x ${quantity} = ₹${(item.price * quantity).toLocaleString('en-IN')}`
  );

  const addressValue =
    form.orderType === 'Home Delivery'
      ? form.deliveryAddress.trim()
      : 'Takeaway (Self Pickup)';

  const instructionsValue = form.specialInstructions.trim() || 'None';
  const contactLine = form.contactNumber.trim()
    ? `\nContact Number: ${form.contactNumber.trim()}\n`
    : '\n';

  return `Hello Dolly's Kitchen!

I would like to place an order.

Customer Name: ${form.customerName.trim()}${contactLine}
Order Type: ${form.orderType}

Order Details:
${orderDetailsLines.join('\n')}

Subtotal: ₹${subtotal.toLocaleString('en-IN')}

Delivery Address: ${addressValue}

Special Instructions: ${instructionsValue}

Please confirm my order. Thank you!`;
}

export function buildWhatsAppUrl(message: string): string {
  return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function buildPartyEnquiryMessage(form: PartyEnquiryFormState): string {
  return `Hello Dolly's Kitchen!

I would like to enquire about a Party / Bulk Order (Per Kg Menu).

Customer Name: ${form.customerName.trim()}
Contact Number: ${form.contactNumber.trim()}
Event Date: ${form.eventDate.trim()}
Approximate Quantity / Guests: ${form.approximateQuantity.trim()}
Food Requirements: ${form.foodRequirements.trim()}

Please share per-kg rates and advance booking details. Thank you!`;
}

export function buildQuickBulkDishUrl(dishName: string): string {
  const message = `Hello Dolly's Kitchen!

I would like to enquire about per-kg rates and advance booking details for:
${dishName}

Please share availability and pricing. Thank you!`;
  return buildWhatsAppUrl(message);
}
