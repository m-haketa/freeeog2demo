import { asyncWrap } from '@server/utils';

export const companies = asyncWrap(async (req, res) => {
  try {
    const root = await req.api.$1.companies.get();
    res.status(root.status).json(root.body);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
