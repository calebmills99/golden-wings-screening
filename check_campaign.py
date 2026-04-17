#!/usr/bin/env python3
"""
Query Google Ads campaign performance for gwingz.com traffic analysis.

Shows clicks, impressions, cost, and conversions by campaign and date.
Run after configuring google-ads.yaml with valid credentials.

Usage:
    python check_campaign.py
    python check_campaign.py --days 60   # expand lookback window
"""
import argparse
import os
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

# Customer ID should be configured in google-ads.yaml or via environment variable
CUSTOMER_ID = os.environ.get("GOOGLE_ADS_CUSTOMER_ID", "")


def run(client, customer_id, days):
    ga_service = client.get_service("GoogleAdsService")

    query = f"""
        SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            segments.date,
            metrics.clicks,
            metrics.impressions,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr,
            metrics.average_cpc
        FROM campaign
        WHERE segments.date DURING LAST_{days}_DAYS
          AND metrics.impressions > 0
        ORDER BY segments.date DESC, metrics.clicks DESC
    """

    response = ga_service.search_stream(customer_id=customer_id, query=query)

    rows = []
    for batch in response:
        for row in batch.results:
            rows.append({
                "date": row.segments.date,
                "campaign": row.campaign.name,
                "status": row.campaign.status.name,
                "clicks": row.metrics.clicks,
                "impressions": row.metrics.impressions,
                "cost": row.metrics.cost_micros / 1_000_000,
                "conversions": row.metrics.conversions,
                "ctr_pct": row.metrics.ctr * 100,
                "avg_cpc": row.metrics.average_cpc / 1_000_000,
            })

    if not rows:
        print(f"No campaign activity found in the last {days} days.")
        return

    # Print summary
    total_clicks = sum(r["clicks"] for r in rows)
    total_impressions = sum(r["impressions"] for r in rows)
    total_cost = sum(r["cost"] for r in rows)
    total_conversions = sum(r["conversions"] for r in rows)

    print(f"\n{'='*80}")
    print(f"Google Ads Performance — Last {days} Days (Customer: {customer_id})")
    print(f"{'='*80}")
    print(f"TOTALS: {total_clicks:,} clicks | {total_impressions:,} impressions | "
          f"${total_cost:.2f} spend | {total_conversions:.0f} conversions")
    print(f"{'='*80}\n")

    # Group by campaign for summary
    campaigns = {}
    for r in rows:
        name = r["campaign"]
        if name not in campaigns:
            campaigns[name] = {"clicks": 0, "impressions": 0, "cost": 0.0,
                               "conversions": 0, "status": r["status"], "dates": set()}
        campaigns[name]["clicks"] += r["clicks"]
        campaigns[name]["impressions"] += r["impressions"]
        campaigns[name]["cost"] += r["cost"]
        campaigns[name]["conversions"] += r["conversions"]
        campaigns[name]["dates"].add(r["date"])

    print("BY CAMPAIGN:")
    print(f"{'Campaign':<40} {'Status':<10} {'Clicks':>7} {'Impr':>8} {'Cost':>8} {'Conv':>6} {'Days Active':>11}")
    print("-" * 96)
    for name, d in sorted(campaigns.items(), key=lambda x: x[1]["clicks"], reverse=True):
        print(f"{name:<40} {d['status']:<10} {d['clicks']:>7,} {d['impressions']:>8,} "
              f"${d['cost']:>7.2f} {d['conversions']:>6.0f} {len(d['dates']):>11}")

    # Daily breakdown
    print("\nDAILY BREAKDOWN (dates with clicks):")
    print(f"{'Date':<12} {'Campaign':<40} {'Clicks':>7} {'Impr':>8} {'Cost':>8} {'Conv':>6}")
    print("-" * 84)
    for r in rows:
        if r["clicks"] > 0:
            print(f"{r['date']:<12} {r['campaign']:<40} {r['clicks']:>7,} "
                  f"{r['impressions']:>8,} ${r['cost']:>7.2f} {r['conversions']:>6.0f}")


def main():
    parser = argparse.ArgumentParser(description="Check Google Ads campaign performance")
    parser.add_argument("--days", type=int, default=30,
                        choices=[7, 14, 30, 60, 90],
                        help="Lookback window in days (default: 30)")
    args = parser.parse_args()

    try:
        client = GoogleAdsClient.load_from_storage()
    except Exception as e:
        print(f"Error loading google-ads.yaml: {e}")
        print("\nMake sure google-ads.yaml exists and is configured.")
        print("See google-ads.yaml.example for the required format.")
        raise SystemExit(1)

    if not CUSTOMER_ID:
        print("Error: GOOGLE_ADS_CUSTOMER_ID environment variable not set.")
        print("Set it via: export GOOGLE_ADS_CUSTOMER_ID=your_customer_id")
        print("Or configure login_customer_id in google-ads.yaml")
        raise SystemExit(1)

    try:
        run(client, CUSTOMER_ID, args.days)
    except GoogleAdsException as ex:
        print(f"Google Ads API error: {ex.error.code().name}")
        for error in ex.failure.errors:
            print(f"  {error.message}")
            if error.location:
                for field in error.location.field_path_elements:
                    print(f"    field: {field.field_name}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
