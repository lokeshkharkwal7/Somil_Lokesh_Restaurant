// src/components/bills-payment/PaymentMethodBadge.jsx
import { Icons } from './icons';

export const PaymentMethodBadge = ({ method }) => {
  const methods = {
    CASH: { icon: Icons.cash, label: 'Cash', bg: 'bg-green-50', text: 'text-green-600' },
    CARD: { icon: Icons.card, label: 'Card', bg: 'bg-blue-50', text: 'text-blue-600' },
    UPI: { icon: Icons.upi, label: 'UPI', bg: 'bg-purple-50', text: 'text-purple-600' }
  };

  const m = methods[method] || methods.CASH;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${m.bg} ${m.text} text-[10px] font-medium`}>
      {m.icon}
      {m.label}
    </span>
  );
};