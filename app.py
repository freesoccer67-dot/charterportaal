import streamlit as st
import pandas as pd
from datetime import date

st.set_page_config(
    page_title="Cargro Charterportaal MVP",
    page_icon="🚚",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ------------------------------------------------------------
# Styling
# ------------------------------------------------------------
st.markdown(
    """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        html, body, [class*="css"] {
            font-family: 'Inter', sans-serif;
        }

        .block-container {
            padding-top: 1.15rem;
            padding-bottom: 2rem;
        }

        .hero {
            position: relative;
            overflow: hidden;
            color: white;
            padding: 30px;
            border-radius: 28px;
            margin-bottom: 22px;
            background:
                radial-gradient(circle at top right, rgba(47, 128, 237, 0.42), transparent 34%),
                linear-gradient(135deg, #07111f 0%, #101828 52%, #1d4ed8 130%);
            box-shadow: 0 24px 60px rgba(16, 24, 40, 0.18);
        }

        .hero h1 {
            margin: 0 0 8px 0;
            font-size: 42px;
            letter-spacing: -1.1px;
        }

        .hero p {
            color: #d0d5dd;
            max-width: 950px;
            margin: 0;
            font-size: 16px;
            line-height: 1.55;
        }

        .tag {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 999px;
            margin: 0 8px 12px 0;
            background: rgba(255, 255, 255, 0.13);
            border: 1px solid rgba(255, 255, 255, 0.20);
            color: #fff;
            font-size: 13px;
            font-weight: 800;
        }

        .section-title {
            font-size: 25px;
            font-weight: 900;
            letter-spacing: -0.55px;
            margin: 16px 0 8px 0;
            color: #101828;
        }

        .subtle {
            color: #667085;
            font-size: 14px;
            line-height: 1.5;
        }

        .portal-banner {
            padding: 15px 18px;
            border-radius: 18px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1e3a8a;
            font-weight: 700;
            margin-bottom: 16px;
        }

        .filter-panel {
            background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
            border: 1px solid #bfdbfe;
            border-radius: 20px;
            padding: 16px 18px;
            margin: 8px 0 18px 0;
        }

        .route-card {
            border: 1px solid #e4e7ec;
            border-radius: 22px;
            padding: 20px;
            margin-bottom: 16px;
            background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
            box-shadow: 0 12px 34px rgba(16, 24, 40, 0.07);
        }

        .route-title {
            font-size: 21px;
            font-weight: 900;
            color: #101828;
            margin-bottom: 4px;
        }

        .route-meta {
            color: #667085;
            font-size: 13px;
            margin-bottom: 12px;
        }

        .pill {
            display: inline-block;
            padding: 5px 11px;
            border-radius: 999px;
            background: #f2f4f7;
            color: #344054;
            font-size: 12px;
            font-weight: 800;
            margin: 3px 5px 3px 0;
            border: 1px solid #e4e7ec;
        }

        .pill-blue {
            display: inline-block;
            padding: 5px 11px;
            border-radius: 999px;
            background: #dbeafe;
            color: #1d4ed8;
            font-size: 12px;
            font-weight: 900;
            margin: 3px 5px 3px 0;
            border: 1px solid #bfdbfe;
        }

        .pill-dark {
            display: inline-block;
            padding: 5px 11px;
            border-radius: 999px;
            background: #101828;
            color: white;
            font-size: 12px;
            font-weight: 900;
            margin: 3px 5px 3px 0;
        }

        .price-box {
            border-radius: 18px;
            padding: 16px;
            background: #101828;
            color: white;
            min-height: 126px;
            box-shadow: 0 14px 30px rgba(16, 24, 40, 0.18);
        }

        .price-box-blue {
            border-radius: 18px;
            padding: 16px;
            background: linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%);
            color: white;
            min-height: 126px;
            box-shadow: 0 14px 30px rgba(29, 78, 216, 0.22);
        }

        .price-label {
            color: #d0d5dd;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .price-value {
            font-size: 30px;
            font-weight: 900;
            margin-top: 6px;
        }

        .good { color: #027a48; font-weight: 900; }
        .warn { color: #b54708; font-weight: 900; }
        .bad { color: #b42318; font-weight: 900; }

        .mini-card {
            border: 1px solid #e4e7ec;
            border-radius: 18px;
            padding: 16px;
            background: white;
            box-shadow: 0 8px 22px rgba(16, 24, 40, 0.045);
            min-height: 132px;
        }

        .mini-card h4 {
            margin: 0 0 8px 0;
            color: #101828;
            font-size: 15px;
        }

        .mini-card strong {
            font-size: 22px;
            color: #101828;
        }

        .data-flow {
            padding: 18px;
            border-radius: 20px;
            background: #eff6ff;
            border: 1px dashed #60a5fa;
            font-weight: 800;
            text-align: center;
            color: #1e3a8a;
        }

        div[data-testid="stMetric"] {
            background: #ffffff;
            border: 1px solid #e4e7ec;
            padding: 14px 16px;
            border-radius: 18px;
            box-shadow: 0 8px 22px rgba(16, 24, 40, 0.045);
        }

        .stButton > button[kind="primary"] {
            font-weight: 900;
            background: #1d4ed8;
            border-color: #1d4ed8;
        }
    </style>
    """,
    unsafe_allow_html=True,
)

# ------------------------------------------------------------
# Constants
# ------------------------------------------------------------
VEHICLE_KM_RATES = {
    "L3": 0.25,
    "L4": 0.35,
    "Bakwagen": 0.45,
    "Bakwagen laadklep": 0.50,
}

ZONE_BADGES = {
    "Midden": "🟣 Midden",
    "Oost": "🟢 Oost",
    "Zuid": "🟠 Zuid",
    "Noord": "🔵 Noord",
    "West": "🟡 West",
    "Randstad": "⚫ Randstad",
}

CHARTER_PASSWORD = "demo123"

# ------------------------------------------------------------
# Fake data
# ------------------------------------------------------------
def load_demo_data():
    charters = pd.DataFrame(
        [
            {
                "charter_id": "CH-001",
                "company": "LuxeLine Transport",
                "contact": "Daya",
                "email": "daya@example.com",
                "home_city": "Nijmegen",
                "zones": "Oost, Midden, Zuid",
                "status": "Active",
                "rating": 4.8,
                "on_time_pct": 96,
                "damage_rate": 0.8,
                "acceptance_pct": 82,
                "documents": "Complete",
                "this_week_routes": 3,
                "this_week_earnings": 1998.25,
                "allocation_priority": 68,
            },
            {
                "charter_id": "CH-002",
                "company": "Duiven Express",
                "contact": "Ravi",
                "email": "ravi@example.com",
                "home_city": "Duiven",
                "zones": "Oost",
                "status": "Trial",
                "rating": 4.3,
                "on_time_pct": 91,
                "damage_rate": 1.1,
                "acceptance_pct": 70,
                "documents": "NIWO pending",
                "this_week_routes": 1,
                "this_week_earnings": 461.80,
                "allocation_priority": 86,
            },
            {
                "charter_id": "CH-003",
                "company": "Randstad Koeriers",
                "contact": "Ahmed",
                "email": "ahmed@example.com",
                "home_city": "Utrecht",
                "zones": "Randstad, Midden, West",
                "status": "Active",
                "rating": 4.6,
                "on_time_pct": 94,
                "damage_rate": 0.6,
                "acceptance_pct": 76,
                "documents": "Complete",
                "this_week_routes": 4,
                "this_week_earnings": 2715.45,
                "allocation_priority": 51,
            },
            {
                "charter_id": "CH-004",
                "company": "Noord Carrier Network",
                "contact": "Jeroen",
                "email": "jeroen@example.com",
                "home_city": "Groningen",
                "zones": "Noord",
                "status": "Active",
                "rating": 4.4,
                "on_time_pct": 89,
                "damage_rate": 1.4,
                "acceptance_pct": 66,
                "documents": "Insurance review",
                "this_week_routes": 1,
                "this_week_earnings": 695.20,
                "allocation_priority": 91,
            },
            {
                "charter_id": "CH-005",
                "company": "Zuid Logistics Partner",
                "contact": "Sem",
                "email": "sem@example.com",
                "home_city": "Eindhoven",
                "zones": "Zuid, Midden",
                "status": "Active",
                "rating": 4.1,
                "on_time_pct": 87,
                "damage_rate": 2.0,
                "acceptance_pct": 63,
                "documents": "Complete",
                "this_week_routes": 0,
                "this_week_earnings": 0.00,
                "allocation_priority": 95,
            },
        ]
    )

    vehicles = pd.DataFrame(
        [
            {"charter": "LuxeLine Transport", "vehicle_id": "VH-001", "type": "Bakwagen", "plate": "V-123-AB", "capacity_kg": 950, "laadklep": "Yes", "status": "Approved"},
            {"charter": "LuxeLine Transport", "vehicle_id": "VH-002", "type": "L4", "plate": "V-222-LL", "capacity_kg": 750, "laadklep": "No", "status": "Pending photo"},
            {"charter": "Duiven Express", "vehicle_id": "VH-003", "type": "L3", "plate": "V-456-CD", "capacity_kg": 650, "laadklep": "No", "status": "Approved"},
            {"charter": "Randstad Koeriers", "vehicle_id": "VH-004", "type": "L4", "plate": "V-789-EF", "capacity_kg": 780, "laadklep": "No", "status": "Approved"},
            {"charter": "Noord Carrier Network", "vehicle_id": "VH-005", "type": "Bakwagen laadklep", "plate": "V-333-GH", "capacity_kg": 1200, "laadklep": "Yes", "status": "Approved"},
            {"charter": "Zuid Logistics Partner", "vehicle_id": "VH-006", "type": "Bakwagen", "plate": "V-918-ZL", "capacity_kg": 980, "laadklep": "Yes", "status": "Approved"},
        ]
    )

    drivers = pd.DataFrame(
        [
            {"charter": "LuxeLine Transport", "driver": "Daya", "phone": "+31 6 0000 0001", "license": "B", "active": "Yes"},
            {"charter": "LuxeLine Transport", "driver": "Sukh", "phone": "+31 6 0000 0002", "license": "B", "active": "Yes"},
            {"charter": "Duiven Express", "driver": "Ravi", "phone": "+31 6 0000 0003", "license": "B", "active": "Yes"},
            {"charter": "Randstad Koeriers", "driver": "Ahmed", "phone": "+31 6 0000 0004", "license": "B", "active": "Yes"},
            {"charter": "Noord Carrier Network", "driver": "Jeroen", "phone": "+31 6 0000 0005", "license": "B", "active": "Yes"},
            {"charter": "Zuid Logistics Partner", "driver": "Sem", "phone": "+31 6 0000 0006", "license": "B", "active": "Yes"},
        ]
    )

    routes = pd.DataFrame(
        [
            {
                "route_id": "MX-2026-0629-001",
                "date": "2026-06-29",
                "source": "MendriX route",
                "route_type": "Mixed delivery route",
                "account_group": "Viking Choice + mixed e-commerce",
                "zone": "Oost",
                "from_city": "Wijchen",
                "first_stop": "Zwolle",
                "last_stop": "Beek-Ubbergen",
                "vehicle_needed": "Bakwagen",
                "required_equipment": "Steekwagen, spanbanden",
                "description": "Long mixed route with bulky consumer goods. Driver must call customers before arrival.",
                "loading_time": "06:30",
                "stops": 17,
                "packages_optional": 46,
                "kg": 780,
                "km": 727,
                "hours": 14.0,
                "stop_tariff": 12.50,
                "hour_rate": 24.00,
                "cargro_customer_revenue": 895.00,
                "status": "Assigned",
                "assigned_charter": "LuxeLine Transport",
                "bidding_allowed": "No",
                "bids_count": 0,
                "invoice_status": "To be paid",
                "dispute_status": "None",
                "due_date": "2026-07-05",
            },
            {
                "route_id": "MX-2026-0629-002",
                "date": "2026-06-29",
                "source": "MendriX route",
                "route_type": "Mixed delivery route",
                "account_group": "Mixed toys / e-commerce",
                "zone": "Midden",
                "from_city": "Wijchen",
                "first_stop": "Amersfoort",
                "last_stop": "Hilversum",
                "vehicle_needed": "L4",
                "required_equipment": "Steekwagen",
                "description": "Mixed delivery route. Medium volume, several apartment buildings.",
                "loading_time": "07:00",
                "stops": 14,
                "packages_optional": 39,
                "kg": 520,
                "km": 322,
                "hours": 9.5,
                "stop_tariff": 12.00,
                "hour_rate": 23.00,
                "cargro_customer_revenue": 625.00,
                "status": "Open",
                "assigned_charter": "",
                "bidding_allowed": "Yes",
                "bids_count": 3,
                "invoice_status": "Not assigned",
                "dispute_status": "None",
                "due_date": "",
            },
            {
                "route_id": "MX-2026-0629-003",
                "date": "2026-06-29",
                "source": "MendriX route",
                "route_type": "Mixed delivery route",
                "account_group": "Barori BV + mixed parcels",
                "zone": "Randstad",
                "from_city": "Wijchen",
                "first_stop": "Rotterdam",
                "last_stop": "Den Haag",
                "vehicle_needed": "L4",
                "required_equipment": "Geen extra materiaal",
                "description": "Urban mixed route with parking difficulty. Efficient driver preferred.",
                "loading_time": "07:15",
                "stops": 22,
                "packages_optional": 62,
                "kg": 610,
                "km": 388,
                "hours": 11.0,
                "stop_tariff": 12.25,
                "hour_rate": 23.50,
                "cargro_customer_revenue": 825.00,
                "status": "Assigned",
                "assigned_charter": "Randstad Koeriers",
                "bidding_allowed": "No",
                "bids_count": 0,
                "invoice_status": "Pending approval",
                "dispute_status": "Open",
                "due_date": "2026-07-05",
            },
            {
                "route_id": "MX-2026-0629-004",
                "date": "2026-06-29",
                "source": "MendriX route",
                "route_type": "Heavy mixed delivery route",
                "account_group": "Mixed bulky goods",
                "zone": "Noord",
                "from_city": "Wijchen",
                "first_stop": "Assen",
                "last_stop": "Groningen",
                "vehicle_needed": "Bakwagen laadklep",
                "required_equipment": "Laadklep, pompwagen, steekwagen",
                "description": "Heavy mixed route. Nobody accepted initial price. Route is open for bids.",
                "loading_time": "06:15",
                "stops": 18,
                "packages_optional": 61,
                "kg": 1120,
                "km": 455,
                "hours": 11.0,
                "stop_tariff": 12.50,
                "hour_rate": 24.00,
                "cargro_customer_revenue": 980.00,
                "status": "Open for bid",
                "assigned_charter": "",
                "bidding_allowed": "Yes",
                "bids_count": 4,
                "invoice_status": "Not assigned",
                "dispute_status": "None",
                "due_date": "",
            },
            {
                "route_id": "MX-2026-0629-005",
                "date": "2026-06-29",
                "source": "MendriX route",
                "route_type": "Mixed delivery route",
                "account_group": "Mixed bulky goods",
                "zone": "Zuid",
                "from_city": "Wijchen",
                "first_stop": "Eindhoven",
                "last_stop": "Maastricht",
                "vehicle_needed": "Bakwagen",
                "required_equipment": "Laadklep aanbevolen, steekwagen verplicht",
                "description": "High kg and long mixed route. Good candidate for fair distribution to under-used charter.",
                "loading_time": "06:45",
                "stops": 16,
                "packages_optional": 53,
                "kg": 910,
                "km": 412,
                "hours": 10.5,
                "stop_tariff": 12.50,
                "hour_rate": 24.00,
                "cargro_customer_revenue": 815.00,
                "status": "Open",
                "assigned_charter": "",
                "bidding_allowed": "Yes",
                "bids_count": 2,
                "invoice_status": "Not assigned",
                "dispute_status": "None",
                "due_date": "",
            },
            {
                "route_id": "MX-2026-0628-006",
                "date": "2026-06-28",
                "source": "Manual route",
                "route_type": "Short mixed route",
                "account_group": "Mixed parcels",
                "zone": "Oost",
                "from_city": "Wijchen",
                "first_stop": "Arnhem",
                "last_stop": "Nijmegen",
                "vehicle_needed": "L3",
                "required_equipment": "Geen extra materiaal",
                "description": "Short mixed route. Good for newer charter or trial driver.",
                "loading_time": "08:00",
                "stops": 9,
                "packages_optional": 20,
                "kg": 260,
                "km": 148,
                "hours": 5.0,
                "stop_tariff": 11.75,
                "hour_rate": 22.00,
                "cargro_customer_revenue": 360.00,
                "status": "Completed",
                "assigned_charter": "Duiven Express",
                "bidding_allowed": "No",
                "bids_count": 0,
                "invoice_status": "Paid",
                "dispute_status": "None",
                "due_date": "2026-07-02",
            },
        ]
    )

    bids = pd.DataFrame(
        [
            {"route_id": "MX-2026-0629-002", "charter": "LuxeLine Transport", "bid_price": 535.00, "vehicle": "Bakwagen", "driver": "Sukh", "note": "Can take route after 07:00. Has extra space.", "approved": "No"},
            {"route_id": "MX-2026-0629-002", "charter": "Randstad Koeriers", "bid_price": 515.00, "vehicle": "L4", "driver": "Ahmed", "note": "Based near route zone.", "approved": "Recommended"},
            {"route_id": "MX-2026-0629-002", "charter": "Zuid Logistics Partner", "bid_price": 545.00, "vehicle": "Bakwagen", "driver": "Sem", "note": "Wants more opportunity this week.", "approved": "No"},
            {"route_id": "MX-2026-0629-004", "charter": "Noord Carrier Network", "bid_price": 745.00, "vehicle": "Bakwagen laadklep", "driver": "Jeroen", "note": "Local in Noord, has laadklep and pompwagen.", "approved": "Recommended"},
            {"route_id": "MX-2026-0629-004", "charter": "LuxeLine Transport", "bid_price": 780.00, "vehicle": "Bakwagen", "driver": "Daya", "note": "Can do it but long deadhead back to Nijmegen.", "approved": "No"},
            {"route_id": "MX-2026-0629-004", "charter": "Randstad Koeriers", "bid_price": 810.00, "vehicle": "L4", "driver": "Ahmed", "note": "No laadklep, not ideal for heavy route.", "approved": "No"},
            {"route_id": "MX-2026-0629-004", "charter": "Zuid Logistics Partner", "bid_price": 825.00, "vehicle": "Bakwagen", "driver": "Sem", "note": "Available, but far from Noord.", "approved": "No"},
            {"route_id": "MX-2026-0629-005", "charter": "Zuid Logistics Partner", "bid_price": 645.00, "vehicle": "Bakwagen", "driver": "Sem", "note": "Local fit and low earnings this week.", "approved": "Recommended"},
            {"route_id": "MX-2026-0629-005", "charter": "LuxeLine Transport", "bid_price": 630.00, "vehicle": "Bakwagen", "driver": "Daya", "note": "Can do it, but already has good routes.", "approved": "No"},
        ]
    )

    disputes = pd.DataFrame(
        [
            {"dispute_id": "DSP-001", "route_id": "MX-2026-0629-003", "charter": "Randstad Koeriers", "reason": "Waiting time discussion", "status": "Open", "amount": 35.00},
            {"dispute_id": "DSP-002", "route_id": "MX-2026-0628-006", "charter": "Duiven Express", "reason": "Resolved route correction", "status": "Closed", "amount": 15.00},
        ]
    )

    route_events = pd.DataFrame(
        [
            {"time": "05:58", "route_id": "MX-2026-0629-001", "event": "Planning exported route from MendriX"},
            {"time": "06:10", "route_id": "MX-2026-0629-001", "event": "Route assigned to LuxeLine Transport"},
            {"time": "06:28", "route_id": "MX-2026-0629-001", "event": "Driver checked in at loading"},
            {"time": "07:02", "route_id": "MX-2026-0629-002", "event": "Bidding opened because route was not accepted"},
            {"time": "07:13", "route_id": "MX-2026-0629-004", "event": "Noord route received 4 bids"},
        ]
    )

    return charters, vehicles, drivers, routes, bids, disputes, route_events


if "demo_initialized" not in st.session_state:
    (
        st.session_state.charters,
        st.session_state.vehicles,
        st.session_state.drivers,
        st.session_state.routes,
        st.session_state.bids,
        st.session_state.disputes,
        st.session_state.route_events,
    ) = load_demo_data()
    st.session_state.demo_initialized = True

charters = st.session_state.charters
vehicles = st.session_state.vehicles
drivers = st.session_state.drivers
routes = st.session_state.routes
bids = st.session_state.bids
disputes = st.session_state.disputes
route_events = st.session_state.route_events

# ------------------------------------------------------------
# Calculations
# ------------------------------------------------------------
def route_price_breakdown(row: pd.Series) -> dict:
    vehicle_rate = VEHICLE_KM_RATES.get(row["vehicle_needed"], 0.35)
    km_amount = row["km"] * vehicle_rate
    stop_amount = row["stops"] * row["stop_tariff"]
    hour_amount = row["hours"] * row["hour_rate"]
    total = km_amount + stop_amount + hour_amount
    margin = row["cargro_customer_revenue"] - total
    margin_pct = (margin / row["cargro_customer_revenue"] * 100) if row["cargro_customer_revenue"] else 0
    return {
        "vehicle_km_rate": vehicle_rate,
        "km_amount": round(km_amount, 2),
        "stop_amount": round(stop_amount, 2),
        "hour_amount": round(hour_amount, 2),
        "route_price": round(total, 2),
        "cargro_margin": round(margin, 2),
        "margin_pct": round(margin_pct, 1),
    }

breakdowns = routes.apply(route_price_breakdown, axis=1, result_type="expand")
routes = pd.concat([routes.drop(columns=[c for c in breakdowns.columns if c in routes.columns], errors="ignore"), breakdowns], axis=1)

def money(value: float) -> str:
    return f"€{value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

def status_class(status: str) -> str:
    if status in ["Completed", "Assigned", "Paid"]:
        return "good"
    if status in ["Open", "Open for bid", "Pending approval", "To be paid"]:
        return "warn"
    return "subtle"

def get_best_bid(route_id: str):
    route_bids = bids[bids["route_id"] == route_id]
    if route_bids.empty:
        return None
    recommended = route_bids[route_bids["approved"] == "Recommended"]
    if not recommended.empty:
        return recommended.sort_values("bid_price").iloc[0]
    return route_bids.sort_values("bid_price").iloc[0]

def fairness_recommendations(routes_df: pd.DataFrame, charters_df: pd.DataFrame) -> pd.DataFrame:
    assigned_counts = (
        routes_df[routes_df["assigned_charter"] != ""]
        .groupby("assigned_charter")
        .size()
        .rename("assigned_routes")
        .reset_index()
    )
    assigned_values = (
        routes_df[routes_df["assigned_charter"] != ""]
        .groupby("assigned_charter")["route_price"]
        .sum()
        .rename("assigned_value")
        .reset_index()
    )
    fair = charters_df[["company", "zones", "rating", "on_time_pct", "allocation_priority", "this_week_routes", "this_week_earnings"]].copy()
    fair = fair.merge(assigned_counts, left_on="company", right_on="assigned_charter", how="left").drop(columns=["assigned_charter"], errors="ignore")
    fair = fair.merge(assigned_values, left_on="company", right_on="assigned_charter", how="left").drop(columns=["assigned_charter"], errors="ignore")
    fair[["assigned_routes", "assigned_value"]] = fair[["assigned_routes", "assigned_value"]].fillna(0)
    fair["fair_allocation_priority"] = (
        fair["allocation_priority"] * 0.45
        + (100 - fair["this_week_routes"] * 12).clip(lower=0) * 0.25
        + fair["rating"] * 6
        + (fair["on_time_pct"] / 2) * 0.15
    ).round(1)
    fair["planning_recommendation"] = fair["fair_allocation_priority"].apply(
        lambda x: "Give more fair chances" if x >= 78 else ("Balanced" if x >= 62 else "Already well served")
    )
    return fair.sort_values("fair_allocation_priority", ascending=False)

fairness_df = fairness_recommendations(routes, charters)

# ------------------------------------------------------------
# UI helpers
# ------------------------------------------------------------
def hero(mode: str):
    subtitle = (
        "Internal planning environment for route upload, bid approval, margin, payables and performance."
        if mode == "Cargro Office"
        else "Private charter environment for available routes, own bids, vehicles, drivers, invoices and disputes."
    )
    st.markdown(
        f"""
        <div class="hero">
            <span class="tag">MendriX route import</span>
            <span class="tag">Role-based access</span>
            <span class="tag">Bidding</span>
            <span class="tag">Weekly invoices</span>
            <span class="tag">Fair allocation</span>
            <h1>Cargro Charterportaal MVP</h1>
            <p>{subtitle}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

def render_tariff_spec(row: pd.Series):
    spec = pd.DataFrame(
        [
            {"Onderdeel": "KM", "Berekening": f"{row['km']} km × €{row['vehicle_km_rate']:.2f}", "Bedrag": money(row["km_amount"])},
            {"Onderdeel": "Stops", "Berekening": f"{row['stops']} stops × €{row['stop_tariff']:.2f}", "Bedrag": money(row["stop_amount"])},
            {"Onderdeel": "Uren", "Berekening": f"{row['hours']} uur × €{row['hour_rate']:.2f}", "Bedrag": money(row["hour_amount"])},
            {"Onderdeel": "Totaal routeprijs", "Berekening": "KM + stops + uren", "Bedrag": money(row["route_price"])},
        ]
    )
    st.dataframe(spec, use_container_width=True, hide_index=True)

def render_route_card(row: pd.Series, audience: str = "charter", charter_company: str = None, show_actions: bool = True):
    best_bid = get_best_bid(row["route_id"])
    show_internal = audience == "admin"
    margin_class = "good" if row["cargro_margin"] >= 120 else ("warn" if row["cargro_margin"] >= 60 else "bad")

    col_left, col_right = st.columns([3, 1])
    with col_left:
        internal_line = ""
        if show_internal:
            internal_line = f"<p class='subtle'><b>Internal account group:</b> {row['account_group']} · <b>Optional packages:</b> {int(row['packages_optional'])}</p>"
        bid_line = ""
        if show_internal and best_bid is not None:
            bid_line = f"<p class='subtle'><b>Recommended/lowest bid:</b> {money(best_bid['bid_price'])} by {best_bid['charter']}</p>"
        elif not show_internal and row["bidding_allowed"] == "Yes":
            own_bid = bids[(bids["route_id"] == row["route_id"]) & (bids["charter"] == charter_company)] if charter_company else pd.DataFrame()
            bid_line = "<p class='subtle'><b>Bidding:</b> Open for your bid</p>" if own_bid.empty else f"<p class='subtle'><b>Your bid:</b> {money(own_bid.iloc[0]['bid_price'])} · {own_bid.iloc[0]['approved']}</p>"

        st.markdown(
            f"""
            <div class="route-card">
                <div class="route-title">{row['route_id']} · {row['route_type']}</div>
                <div class="route-meta">
                    {row['date']} · {ZONE_BADGES.get(row['zone'], row['zone'])} · Load {row['loading_time']} ·
                    {row['from_city']} → {row['first_stop']} → {row['last_stop']}
                </div>
                <span class="pill-dark">{row['vehicle_needed']}</span>
                <span class="pill-blue">{row['kg']} kg</span>
                <span class="pill">{row['stops']} stops</span>
                <span class="pill">{row['km']} km</span>
                <span class="pill">{row['hours']} hours</span>
                <span class="pill">{row['required_equipment']}</span>
                <p class="subtle" style="margin-top: 12px;">{row['description']}</p>
                <p class="subtle"><b>Status:</b> <span class="{status_class(row['status'])}">{row['status']}</span> · <b>Assigned:</b> {row['assigned_charter'] or 'Not assigned'} · <b>Bids:</b> {int(row['bids_count'])}</p>
                {internal_line}
                {bid_line}
            </div>
            """,
            unsafe_allow_html=True,
        )
    with col_right:
        if show_internal:
            st.markdown(
                f"""
                <div class="price-box">
                    <div class="price-label">Charter payout</div>
                    <div class="price-value">{money(row['route_price'])}</div>
                    <div class="price-label" style="margin-top:10px;">Cargro margin</div>
                    <div class="{margin_class}" style="font-size:22px;">{money(row['cargro_margin'])} · {row['margin_pct']}%</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f"""
                <div class="price-box-blue">
                    <div class="price-label">Route payout</div>
                    <div class="price-value">{money(row['route_price'])}</div>
                    <div class="price-label" style="margin-top:10px;">Visible to charter</div>
                    <div style="font-size:14px;color:#dbeafe;font-weight:800;">No internal Cargro margin shown</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        with st.expander("Tarief specificatie"):
            render_tariff_spec(row)

        if show_actions and not show_internal and row["bidding_allowed"] == "Yes" and charter_company:
            with st.popover("Place bid"):
                my_vehicles = vehicles[vehicles["charter"] == charter_company]
                my_drivers = drivers[drivers["charter"] == charter_company]
                selected_vehicle = st.selectbox("Vehicle for this bid", my_vehicles["type"] + " · " + my_vehicles["plate"], key=f"vehicle_{row['route_id']}")
                selected_driver = st.selectbox("Preferred driver", my_drivers["driver"], key=f"driver_{row['route_id']}")
                bid_amount = st.number_input("Bid price", min_value=0.0, value=float(row["route_price"] + 25), step=10.0, key=f"bid_{row['route_id']}")
                note = st.text_area("Note to planning", value="Available and can meet route requirements.", key=f"note_{row['route_id']}")
                if st.button("Submit bid", type="primary", key=f"submit_{row['route_id']}"):
                    new_bid = pd.DataFrame([
                        {"route_id": row["route_id"], "charter": charter_company, "bid_price": bid_amount, "vehicle": selected_vehicle, "driver": selected_driver, "note": note, "approved": "No"}
                    ])
                    st.session_state.bids = pd.concat([st.session_state.bids, new_bid], ignore_index=True)
                    st.success("Bid submitted in demo. Planning can review it in Cargro Office.")

def route_filter_panel(df: pd.DataFrame, key_prefix: str):
    st.markdown('<div class="filter-panel"><b>🔎 Highlighted route filters</b><br><span class="subtle">Filter by zone, vehicle and status. These are the filters charters/planning will use daily.</span></div>', unsafe_allow_html=True)
    f1, f2, f3 = st.columns(3)
    with f1:
        zone_filter = st.selectbox("Zone", ["All"] + list(ZONE_BADGES.keys()), key=f"{key_prefix}_zone")
    with f2:
        vehicle_filter = st.selectbox("Vehicle", ["All"] + list(VEHICLE_KM_RATES.keys()), key=f"{key_prefix}_vehicle")
    with f3:
        status_filter = st.selectbox("Status", ["All", "Open", "Open for bid", "Assigned", "Completed"], key=f"{key_prefix}_status")

    filtered = df.copy()
    if zone_filter != "All":
        filtered = filtered[filtered["zone"] == zone_filter]
    if vehicle_filter != "All":
        filtered = filtered[filtered["vehicle_needed"] == vehicle_filter]
    if status_filter != "All":
        filtered = filtered[filtered["status"] == status_filter]
    return filtered

# ------------------------------------------------------------
# Sidebar access separation
# ------------------------------------------------------------
st.sidebar.title("🚚 Cargro Portal")
access = st.sidebar.radio("Choose portal", ["Cargro Office", "Charter Portal"])
st.sidebar.markdown("---")

if access == "Cargro Office":
    st.sidebar.caption("Internal area: planning, margin, payables and performance.")
    page = st.sidebar.radio(
        "Office module",
        [
            "Office overview",
            "Route upload",
            "Route management",
            "Bid approval",
            "Cargro invoices/payables",
            "Margin dashboard",
            "Charter management",
            "Fair allocation",
            "MendriX data flow",
        ],
    )
    hero("Cargro Office")
    st.markdown('<div class="portal-banner">🔒 Cargro Office view: internal revenue, margin, payables and fairness logic are only shown here.</div>', unsafe_allow_html=True)

    if page == "Office overview":
        total_routes = len(routes)
        open_routes = len(routes[routes["assigned_charter"] == ""])
        total_revenue = routes["cargro_customer_revenue"].sum()
        total_charter_cost = routes["route_price"].sum()
        total_margin = total_revenue - total_charter_cost
        avg_margin_pct = total_margin / total_revenue * 100 if total_revenue else 0
        k1, k2, k3, k4, k5 = st.columns(5)
        k1.metric("Routes", total_routes)
        k2.metric("Open routes", open_routes)
        k3.metric("Revenue", money(total_revenue))
        k4.metric("Charter payout", money(total_charter_cost))
        k5.metric("Margin", f"{money(total_margin)} · {avg_margin_pct:.1f}%")
        st.markdown('<div class="section-title">Internal route board</div>', unsafe_allow_html=True)
        st.dataframe(
            routes[["route_id", "route_type", "account_group", "zone", "vehicle_needed", "loading_time", "stops", "kg", "km", "hours", "route_price", "cargro_customer_revenue", "cargro_margin", "status", "assigned_charter", "invoice_status", "dispute_status"]],
            use_container_width=True,
            hide_index=True,
        )

    elif page == "Route upload":
        st.markdown('<div class="section-title">Planning route upload</div>', unsafe_allow_html=True)
        st.info("There are two route-upload methods: bulk upload from MendriX/Excel for daily planning, and manual one-by-one entry for urgent routes or corrections.")
        bulk_tab, manual_tab = st.tabs(["Bulk upload from MendriX / Excel", "Manual single route"])

        with bulk_tab:
            st.write("Use this for the normal daily workflow. One file can contain multiple routes.")
            expected = pd.DataFrame([
                {"field": "route_id", "required": "Yes", "example": "MX-2026-0629-007"},
                {"field": "route_type", "required": "Yes", "example": "Mixed delivery route"},
                {"field": "zone", "required": "Yes", "example": "Oost / Midden / Zuid / Noord / West / Randstad"},
                {"field": "vehicle_needed", "required": "Yes", "example": "L3 / L4 / Bakwagen / Bakwagen laadklep"},
                {"field": "loading_time", "required": "Yes", "example": "06:30"},
                {"field": "stops, km, hours, kg", "required": "Yes", "example": "17 stops, 420 km, 10.5 hours, 850 kg"},
                {"field": "packages_optional", "required": "Optional/internal", "example": "46"},
                {"field": "required_equipment", "required": "Yes", "example": "Laadklep, steekwagen, pompwagen"},
                {"field": "description", "required": "Yes", "example": "Heavy route, customer calls required"},
            ])
            st.dataframe(expected, use_container_width=True, hide_index=True)
            uploaded = st.file_uploader("Upload CSV or Excel demo file", type=["csv", "xlsx"])
            if uploaded is not None:
                try:
                    uploaded_df = pd.read_excel(uploaded) if uploaded.name.endswith(".xlsx") else pd.read_csv(uploaded)
                    st.success("File loaded in demo view. Real version will validate and publish routes to the marketplace.")
                    st.dataframe(uploaded_df, use_container_width=True, hide_index=True)
                except Exception as exc:
                    st.error(f"Could not read file: {exc}")

        with manual_tab:
            st.write("Use this only for urgent routes, test routes, or corrections.")
            with st.form("manual_route_form"):
                col1, col2, col3 = st.columns(3)
                with col1:
                    route_id = st.text_input("Route ID", value="MX-2026-0629-007")
                    route_type = st.text_input("Route type", value="Mixed delivery route")
                    account_group = st.text_input("Account group / internal", value="Mixed clients")
                    zone = st.selectbox("Zone", list(ZONE_BADGES.keys()))
                    loading_time = st.text_input("Loading time", value="07:00")
                with col2:
                    vehicle_needed = st.selectbox("Vehicle needed", list(VEHICLE_KM_RATES.keys()))
                    stops_input = st.number_input("Stops", min_value=1, value=13)
                    km_input = st.number_input("KM", min_value=1, value=285)
                    hours_input = st.number_input("Hours", min_value=1.0, value=8.5, step=0.5)
                with col3:
                    kg_input = st.number_input("Kilos", min_value=0, value=540)
                    packages_input = st.number_input("Packages optional/internal", min_value=0, value=0)
                    stop_tariff = st.number_input("Stop tariff", min_value=0.0, value=12.25, step=0.25)
                    hour_rate = st.number_input("Hour rate", min_value=0.0, value=23.50, step=0.50)
                equipment = st.multiselect("Needed equipment", ["Laadklep", "Steekwagen", "Pompwagen", "Spanbanden", "Customer call before arrival"], default=["Steekwagen"])
                description = st.text_area("Omschrijving", value="Mixed route uploaded by planning. Add special instructions here.")
                customer_revenue = st.number_input("Cargro customer revenue / internal only", min_value=0.0, value=585.00, step=10.0)
                submitted = st.form_submit_button("🚀 Add route to portal", type="primary", use_container_width=True)
                if submitted:
                    new_route = pd.DataFrame([
                        {
                            "route_id": route_id,
                            "date": str(date.today()),
                            "source": "Planning manual upload",
                            "route_type": route_type,
                            "account_group": account_group,
                            "zone": zone,
                            "from_city": "Wijchen",
                            "first_stop": "Demo first stop",
                            "last_stop": "Demo last stop",
                            "vehicle_needed": vehicle_needed,
                            "required_equipment": ", ".join(equipment) if equipment else "Geen extra materiaal",
                            "description": description,
                            "loading_time": loading_time,
                            "stops": int(stops_input),
                            "packages_optional": int(packages_input),
                            "kg": int(kg_input),
                            "km": int(km_input),
                            "hours": float(hours_input),
                            "stop_tariff": float(stop_tariff),
                            "hour_rate": float(hour_rate),
                            "cargro_customer_revenue": float(customer_revenue),
                            "status": "Open",
                            "assigned_charter": "",
                            "bidding_allowed": "Yes",
                            "bids_count": 0,
                            "invoice_status": "Not assigned",
                            "dispute_status": "None",
                            "due_date": "",
                        }
                    ])
                    st.session_state.routes = pd.concat([st.session_state.routes, new_route], ignore_index=True)
                    st.success("Route added to the portal demo. Open Route management or Charter marketplace to see it.")

    elif page == "Route management":
        st.markdown('<div class="section-title">Route management / internal marketplace view</div>', unsafe_allow_html=True)
        filtered = route_filter_panel(routes, "admin_routes")
        for _, row in filtered.iterrows():
            render_route_card(row, audience="admin")

    elif page == "Bid approval":
        st.markdown('<div class="section-title">Bid approval cockpit</div>', unsafe_allow_html=True)
        selected_route_id = st.selectbox("Select route with bids", sorted(bids["route_id"].unique()))
        selected_route = routes[routes["route_id"] == selected_route_id].iloc[0]
        render_route_card(selected_route, audience="admin", show_actions=False)
        route_bids = bids[bids["route_id"] == selected_route_id].merge(
            charters[["company", "rating", "on_time_pct", "allocation_priority", "this_week_routes", "this_week_earnings"]],
            left_on="charter",
            right_on="company",
            how="left",
        )
        route_bids["above_base"] = (route_bids["bid_price"] - selected_route["route_price"]).round(2)
        route_bids["approval_score"] = (
            (100 - route_bids["above_base"].clip(lower=0) / 5).clip(lower=0) * 0.35
            + route_bids["rating"] * 10 * 0.20
            + route_bids["on_time_pct"] * 0.20
            + route_bids["allocation_priority"] * 0.25
        ).round(1)
        st.markdown("### Bids received")
        st.dataframe(
            route_bids[["charter", "bid_price", "above_base", "vehicle", "driver", "rating", "on_time_pct", "allocation_priority", "this_week_routes", "approval_score", "approved", "note"]].sort_values("approval_score", ascending=False),
            use_container_width=True,
            hide_index=True,
        )
        recommended = route_bids.sort_values("approval_score", ascending=False).iloc[0]
        st.success(f"Recommended approval: {recommended['charter']} at {money(recommended['bid_price'])}. Reason: price + performance + fair allocation priority.")
        selected_bidder = st.selectbox("Approve charter", route_bids["charter"])
        if st.button("Approve selected bid in demo", type="primary"):
            st.success(f"Demo: {selected_bidder} approved for route {selected_route_id}. Real version updates route assignment and sends notification.")

    elif page == "Cargro invoices/payables":
        st.markdown('<div class="section-title">Cargro invoices / payables</div>', unsafe_allow_html=True)
        st.caption("Internal view: what Cargro owes to charters, what is due, what is disputed, and margin per route.")
        payable = routes[routes["assigned_charter"] != ""].copy()
        k1, k2, k3, k4 = st.columns(4)
        k1.metric("Payable to charters", money(payable["route_price"].sum()))
        k2.metric("Customer revenue", money(payable["cargro_customer_revenue"].sum()))
        k3.metric("Gross margin", money(payable["cargro_margin"].sum()))
        k4.metric("Open disputes", len(disputes[disputes["status"] == "Open"]))
        st.dataframe(
            payable[["route_id", "assigned_charter", "route_type", "zone", "route_price", "cargro_customer_revenue", "cargro_margin", "invoice_status", "dispute_status", "due_date"]],
            use_container_width=True,
            hide_index=True,
        )
        st.markdown("### Disputes")
        st.dataframe(disputes, use_container_width=True, hide_index=True)

    elif page == "Margin dashboard":
        st.markdown('<div class="section-title">Power BI-style internal dashboard</div>', unsafe_allow_html=True)
        total_revenue = routes["cargro_customer_revenue"].sum()
        total_cost = routes["route_price"].sum()
        total_margin = total_revenue - total_cost
        avg_margin = total_margin / total_revenue * 100 if total_revenue else 0
        k1, k2, k3, k4 = st.columns(4)
        k1.metric("Weekly revenue", money(total_revenue))
        k2.metric("Weekly charter payout", money(total_cost))
        k3.metric("Weekly margin", money(total_margin))
        k4.metric("Margin %", f"{avg_margin:.1f}%")
        tab1, tab2, tab3 = st.tabs(["Margin by route", "Margin by zone", "Charter performance"])
        with tab1:
            margin_df = routes[["route_id", "route_type", "zone", "vehicle_needed", "cargro_customer_revenue", "route_price", "cargro_margin", "margin_pct"]].copy()
            st.dataframe(margin_df.sort_values("cargro_margin", ascending=False), use_container_width=True, hide_index=True)
            st.bar_chart(margin_df.set_index("route_id")["cargro_margin"])
        with tab2:
            zone_df = routes.groupby("zone").agg(routes=("route_id", "count"), revenue=("cargro_customer_revenue", "sum"), payout=("route_price", "sum"), margin=("cargro_margin", "sum")).reset_index()
            zone_df["margin_pct"] = (zone_df["margin"] / zone_df["revenue"] * 100).round(1)
            st.dataframe(zone_df, use_container_width=True, hide_index=True)
            st.bar_chart(zone_df.set_index("zone")["margin"])
        with tab3:
            perf = charters[["company", "rating", "on_time_pct", "damage_rate", "acceptance_pct", "this_week_routes", "this_week_earnings", "allocation_priority"]].copy()
            st.dataframe(perf.sort_values("rating", ascending=False), use_container_width=True, hide_index=True)
            st.bar_chart(perf.set_index("company")[["rating", "allocation_priority"]])

    elif page == "Charter management":
        st.markdown('<div class="section-title">Charter management</div>', unsafe_allow_html=True)
        st.dataframe(charters, use_container_width=True, hide_index=True)
        vtab, dtab = st.tabs(["Vehicles", "Drivers"])
        with vtab:
            st.dataframe(vehicles, use_container_width=True, hide_index=True)
        with dtab:
            st.dataframe(drivers, use_container_width=True, hide_index=True)

    elif page == "Fair allocation":
        st.markdown('<div class="section-title">Fair route distribution system</div>', unsafe_allow_html=True)
        st.caption("Internal planning tool. Charters do not see the full internal formula.")
        st.dataframe(fairness_df, use_container_width=True, hide_index=True)
        st.code(
            """fair_allocation_priority =
  allocation_priority * 45%
+ under-used this week * 25%
+ rating/performance * 20%
+ zone/vehicle fit * 10%

Planning can override, but must add a reason.""",
            language="text",
        )
        st.info("This prevents one charter from always getting the best routes, while still protecting service quality and route fit.")

    elif page == "MendriX data flow":
        st.markdown('<div class="section-title">MendriX ↔ Charterportaal data flow</div>', unsafe_allow_html=True)
        f1, f2, f3, f4, f5 = st.columns(5)
        f1.markdown('<div class="data-flow">1. MendriX<br>Route created</div>', unsafe_allow_html=True)
        f2.markdown('<div class="data-flow">2. Portal<br>Price + rules</div>', unsafe_allow_html=True)
        f3.markdown('<div class="data-flow">3. Charter<br>Accept / bid</div>', unsafe_allow_html=True)
        f4.markdown('<div class="data-flow">4. Driver<br>Load + deliver</div>', unsafe_allow_html=True)
        f5.markdown('<div class="data-flow">5. Finance<br>Invoice + margin</div>', unsafe_allow_html=True)
        st.dataframe(route_events, use_container_width=True, hide_index=True)

# ------------------------------------------------------------
# Charter portal
# ------------------------------------------------------------
else:
    st.sidebar.caption("Private charter area. Real version uses secure accounts.")
    email = st.sidebar.text_input("Email", placeholder="daya@example.com")
    password = st.sidebar.text_input("Password", type="password", placeholder="demo123")
    st.sidebar.caption("Demo password for listed test accounts: demo123")

    charter_match = charters[charters["email"].str.lower() == email.lower()] if email else pd.DataFrame()
    if charter_match.empty or password != CHARTER_PASSWORD:
        hero("Charter Portal")
        st.markdown('<div class="portal-banner">🔐 Charter login required. In the real version, every charter has their own email/password and cannot access other charter accounts.</div>', unsafe_allow_html=True)
        st.write("Demo test accounts:")
        st.dataframe(charters[["company", "email"]], use_container_width=True, hide_index=True)
    else:
        profile = charter_match.iloc[0]
        charter_company = profile["company"]
        st.sidebar.success(f"Logged in as {charter_company}")
        charter_page = st.sidebar.radio(
            "Charter module",
            ["Available routes", "My assigned routes", "My bids", "My vehicles/drivers", "My invoices", "My disputes/profile"],
        )
        hero("Charter Portal")
        st.markdown(f'<div class="portal-banner">🔐 Charter view: {charter_company}. Only your own routes, bids, vehicles, drivers, invoices and disputes are visible.</div>', unsafe_allow_html=True)

        my_routes = routes[routes["assigned_charter"] == charter_company]
        my_bids = bids[bids["charter"] == charter_company]
        my_vehicles = vehicles[vehicles["charter"] == charter_company]
        my_drivers = drivers[drivers["charter"] == charter_company]
        my_disputes = disputes[disputes["charter"] == charter_company]

        if charter_page == "Available routes":
            st.markdown('<div class="section-title">Available routes / marketplace</div>', unsafe_allow_html=True)
            st.caption("Charters only see route payout and operational requirements. Cargro revenue and margin are hidden.")
            marketplace = routes[(routes["status"].isin(["Open", "Open for bid"])) & (routes["bidding_allowed"] == "Yes")].copy()
            filtered = route_filter_panel(marketplace, "charter_market")
            for _, row in filtered.iterrows():
                render_route_card(row, audience="charter", charter_company=charter_company)

        elif charter_page == "My assigned routes":
            st.markdown('<div class="section-title">My assigned routes</div>', unsafe_allow_html=True)
            if my_routes.empty:
                st.info("No assigned routes yet.")
            else:
                st.dataframe(my_routes[["route_id", "date", "route_type", "zone", "vehicle_needed", "loading_time", "stops", "kg", "km", "hours", "route_price", "status"]], use_container_width=True, hide_index=True)
                selected = st.selectbox("Open route tariff specification", my_routes["route_id"])
                render_tariff_spec(my_routes[my_routes["route_id"] == selected].iloc[0])

        elif charter_page == "My bids":
            st.markdown('<div class="section-title">My bids</div>', unsafe_allow_html=True)
            if my_bids.empty:
                st.info("You have no bids yet.")
            else:
                st.dataframe(my_bids[["route_id", "bid_price", "vehicle", "driver", "approved", "note"]], use_container_width=True, hide_index=True)

        elif charter_page == "My vehicles/drivers":
            st.markdown('<div class="section-title">My vehicles and drivers</div>', unsafe_allow_html=True)
            vtab, dtab = st.tabs(["Vehicles", "Drivers"])
            with vtab:
                st.dataframe(my_vehicles, use_container_width=True, hide_index=True)
                with st.expander("Upload new vehicle demo"):
                    st.text_input("Kenteken")
                    st.selectbox("Vehicle type", list(VEHICLE_KM_RATES.keys()))
                    st.number_input("Capacity kg", value=800)
                    st.file_uploader("Upload vehicle document/photo", type=["pdf", "jpg", "png"])
                    st.button("Save vehicle demo", type="primary")
            with dtab:
                st.dataframe(my_drivers, use_container_width=True, hide_index=True)
                with st.expander("Add driver demo"):
                    st.text_input("Driver name")
                    st.text_input("Phone")
                    st.selectbox("License", ["B", "C", "CE"])
                    st.button("Save driver demo", type="primary")

        elif charter_page == "My invoices":
            st.markdown('<div class="section-title">My invoices</div>', unsafe_allow_html=True)
            if my_routes.empty:
                st.info("No invoice lines yet.")
            else:
                current = my_routes[my_routes["status"].isin(["Assigned", "Completed"])]
                total_ex = current["route_price"].sum()
                vat = total_ex * 0.21
                total_inc = total_ex + vat
                c1, c2, c3, c4 = st.columns(4)
                c1.metric("Routes", len(current))
                c2.metric("Stops", int(current["stops"].sum()))
                c3.metric("Total excl. BTW", money(total_ex))
                c4.metric("Total incl. BTW", money(total_inc))
                st.markdown("### Current week statement")
                st.dataframe(current[["route_id", "date", "route_type", "zone", "km", "stops", "hours", "route_price", "invoice_status", "due_date"]], use_container_width=True, hide_index=True)
                st.markdown("### Invoice history")
                history = current.copy()
                history["invoice_no"] = [f"INV-DEMO-{i+1:03d}" for i in range(len(history))]
                st.dataframe(history[["invoice_no", "route_id", "date", "route_price", "invoice_status", "due_date"]], use_container_width=True, hide_index=True)
                selected = st.selectbox("Dispute route", current["route_id"])
                if st.button("Open dispute for selected route", type="primary"):
                    st.warning(f"Demo dispute opened for {selected}. Real version sends it to Cargro planning/finance.")

        elif charter_page == "My disputes/profile":
            st.markdown('<div class="section-title">My disputes and profile</div>', unsafe_allow_html=True)
            st.dataframe(my_disputes, use_container_width=True, hide_index=True)
            st.markdown("### Profile")
            profile_public = pd.DataFrame([
                {"field": "Company", "value": profile["company"]},
                {"field": "Contact", "value": profile["contact"]},
                {"field": "Email", "value": profile["email"]},
                {"field": "Home city", "value": profile["home_city"]},
                {"field": "Zones", "value": profile["zones"]},
                {"field": "Documents", "value": profile["documents"]},
            ])
            st.dataframe(profile_public, use_container_width=True, hide_index=True)
