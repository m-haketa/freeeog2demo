import { asyncWrap } from '@server/utils';

export const companies = asyncWrap(async (req, res) => {
  try {
    const root = await req.api.$1.companies.get();

    const ret =
      `<table cellpadding="10"><tr><th>会社名</th><td>　</td></tr>` +
      root.body.companies
        .map(
          (company) =>
            `<tr><td>${company.display_name}</td><td><a href="/demo/companies/${company.id}/account_items">科目一覧</a><tr>`
        )
        .join('') +
      `</table>`;
    res.status(200).send(ret);
  } catch (e) {
    res.status(500).send(`<p>読み込み時にエラーが発生しました</p><p>${e}</p>`);
  }
});
