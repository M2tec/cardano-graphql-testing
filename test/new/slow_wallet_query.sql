EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
select
  __get_payment_addresses__."address" as "0",
  (not (__get_payment_addresses__ is null))::text as "1",
  (not (__frmcdc_payment_address_summary__ is null))::text as "2",
  array(
    select array[
      __frmcdc_asset_balance__."quantity"::text,
      __frmcdc_asset_balance__."address",
      (not (__frmcdc_asset_balance__ is null))::text,
      __asset__."assetId"::text,
      __asset__."isCoin"::text,
      __asset__."description",
      __asset__."name",
      __asset__."policyId"::text,
      __asset__."assetName"::text,
      (not (__asset__ is null))::text
    ]::text[]
    from unnest(__frmcdc_payment_address_summary__."assetBalances") as __frmcdc_asset_balance__
    left outer join "cardano_graphql"."Asset" as __asset__
    on (
    /* WHERE becoming ON */ (
      __asset__."ma_id" = __frmcdc_asset_balance__."ident"
    ))
  )::text as "3"
from "cardano_graphql"."getPaymentAddresses"(ARRAY['addr_test1zpd7cjjwcqllzps9uaqtdjy7ytxzk6sg2tmvxzwm9am0pq8xq98rskrmxdgx4hmax4uuqrklkzg0n52fk5gug57g7cts8wt3jz']::"varchar"[]) as __get_payment_addresses__
left outer join lateral (select (__get_payment_addresses__."summary").*) as __frmcdc_payment_address_summary__
on TRUE;