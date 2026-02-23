import Campaign from '../models/Campaign.js';

export const getActiveCampaigns = async (_req, res, next) => {
  try {
    const campaigns = await Campaign.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    }).lean();
    res.json({ success: true, campaigns });
  } catch (err) {
    next(err);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.query;
    const campaign = await Campaign.findOne({
      code: (code || '').toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
      $or: [{ usageLimit: null }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }],
    }).lean();
    const minPurchase = Number(subtotal) || 0;
    if (!campaign || minPurchase < (campaign.minPurchase || 0)) {
      return res.json({ success: false, message: 'Kupon geçersiz veya minimum tutar sağlanmıyor' });
    }
    const discount =
      campaign.discountType === 'percent'
        ? (minPurchase * campaign.discountValue) / 100
        : Math.min(campaign.discountValue, minPurchase);
    res.json({ success: true, campaign: { ...campaign, calculatedDiscount: discount } });
  } catch (err) {
    next(err);
  }
};
