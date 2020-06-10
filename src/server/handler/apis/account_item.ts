import { asyncWrap } from '@server/utils';

export const account_item = asyncWrap(async (req, res) => {
  try {
    const company_id =
      'companyId' in req.params ? parseInt(req.params.companyId) : 0;
    const id = 'id' in req.params ? parseInt(req.params.id) : 0;
    const root = await req.api.$1.account_items
      ._id(id)
      .get({ query: { company_id } });
    res.status(root.status).json(root.body);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
