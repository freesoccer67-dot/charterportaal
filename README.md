# Cargro Charterportaal Demo

A Streamlit prototype for a Cargro-style charter portal.

This is a demo layer on top of MendriX/TMS thinking. It does **not** replace MendriX. It shows how Cargro could manage charters, routes, tariffs, weekly payout, issues/returns, and future MendriX integration.

## What is included

- Admin / Cargro office dashboard
- Charter dashboard
- Driver mobile-style route view
- Demo tariff engine
- Weekly payout overview
- Issues and returns overview
- MendriX connection plan

## Run locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

## Deploy on Streamlit Cloud

1. Go to Streamlit Cloud.
2. Click **New app**.
3. Choose this GitHub repo: `freesoccer67-dot/charterportaal`.
4. Main file path: `app.py`.
5. Click **Deploy**.

## Future real version

The demo data in `app.py` should later be replaced with:

- MendriX route/order import
- Database tables for charters, routes, stops, issues and payouts
- User login/roles
- Document upload for KVK, BTW, NIWO, insurance and vehicle data
- POD/photo/status sync back to MendriX
- PDF weekly self-billing statements
- Customer-specific tariffs
- TLN/diesel correction logic
- Zone-based charter assignment
- Performance dashboard per charter and route

## Important note

This prototype uses fake data only. Do not put real customer addresses, driver details, or financial data into the public demo repository.
