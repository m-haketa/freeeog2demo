import { asyncWrap } from '@server/utils';

export interface AccountItems {
  id: number;
  name: string;
  shortcut: string;
  default_tax_id: number;
  categories: string[];
}

export const account_items = asyncWrap(async (req, res) => {
  const companyId =
    'companyId' in req.params ? parseInt(req.params.companyId) : 0;
  if (companyId === 0) {
    res.status(200).send('nodata');
    return;
  }

  try {
    const root = await req.api.$1.companies
      ._id(companyId)
      .get({ query: { details: true } });

    //型定義が不完全（company配下にaccount_itemsの定義がない）なので、無理やり型を付ける
    const account_items: AccountItems[] = (root.body.company as any)
      .account_items;

    const ret =
      `<table><tr><td>勘定科目</td></tr>` +
      account_items
        .sort((a, b) => (a.id > b.id ? 1 : a.id === b.id ? 0 : -1))
        .map(
          (item) =>
            `<tr><td><a href="/demo/account_items/${companyId}/${item.id}">${item.name}</a></td></tr>`
        )
        .join('') +
      `</table>`;

    res.status(200).send(ret);
  } catch (e) {
    res.status(500).send(`<p>読み込み時にエラーが発生しました</p><p>${e}</p>`);
  }
});
