import Faq from '../models/Faq.js';

const DEFAULT_FAQ = [
  { keywords: ['kargo', 'teslimat', 'ne zaman gelir'], response: 'Siparişleriniz 2-4 iş günü içinde teslim edilmektedir.' },
  { keywords: ['iade', 'geri gönder'], response: 'Ürünleri 14 gün içinde ücretsiz olarak iade edebilirsiniz.' },
  { keywords: ['ödeme', 'kart', 'taksit'], response: 'Kredi kartı ve havale ile ödeme yapabilirsiniz.' },
];

export const getFaq = async (_req, res, next) => {
  try {
    let list = await Faq.find().sort({ order: 1 }).lean();
    if (!list.length) list = DEFAULT_FAQ;
    res.json({ success: true, faq: list });
  } catch (err) {
    next(err);
  }
};
