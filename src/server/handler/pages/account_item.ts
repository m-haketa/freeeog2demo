import { asyncWrap } from '@server/utils';

export const account_item = asyncWrap(async (req, res) => {
  const company_id =
    'companyId' in req.params ? parseInt(req.params.companyId) : 0;
  const id = 'id' in req.params ? parseInt(req.params.id) : 0;

  try {
    const root = await req.api.$1.account_items
      ._id(id)
      .get({ query: { company_id } });

    const item = root.body.account_item;
    const ret =
      `<table>` +
      `<tr><td>勘定科目コード</td><td>${item.id}</td></tr>` +
      `<tr><td>勘定科目名</td><td>${item.name}</td></tr>` +
      `<tr><td>カテゴリ</td><td>${item.account_category}</td></tr>` +
      `</table>`;

    res.status(200).send(ret);
  } catch (e) {
    res.status(500).send(`<p>読み込み時にエラーが発生しました</p><p>${e}</p>`);
  }
});
