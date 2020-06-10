import { asyncWrap } from '@server/utils';

export const company = asyncWrap(async (req, res) => {
  const companyId =
    'companyId' in req.params ? parseInt(req.params.companyId) : 0;

  try {
    const root = await req.api.$1.companies
      ._id(companyId)
      .get({ query: { details: true } });
    res.status(root.status).json(root.body);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
