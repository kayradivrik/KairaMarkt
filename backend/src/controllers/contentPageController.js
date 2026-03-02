import ContentPage from '../models/ContentPage.js';

export const getPageBySlug = async (req, res, next) => {
  try {
    const raw = (req.params.slug || '').toString().trim();
    if (!raw) {
      return res.status(400).json({ success: false, message: 'Slug gerekli' });
    }
    const slug = raw.toLowerCase();
    const page = await ContentPage.findOne({ slug, isPublished: true }).lean();
    if (!page) {
      return res.status(404).json({ success: false, message: 'Sayfa bulunamadı' });
    }
    res.json({
      success: true,
      page: {
        slug: page.slug,
        title: page.title,
        body: page.body,
        updatedAt: page.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

