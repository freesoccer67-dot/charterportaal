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
            padding-top: 1.25rem;
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
                radial-gradient(circle at top right, rgba(255, 184, 0, 0.38), transparent 34%),
                linear-gradient(135deg, #0b1220 0%, #101828 50%, #23314f 100%);
            box-shadow: 0 24px 60px rgba(16, 24, 40, 0.18);
        }

        .hero h1 {
            margin: 0 0 8px 0;
            font-size: 42px;
            letter-spacing: -1.1px;
        }

        .hero p {
            color: #d0d5dd;
            max-width: 920px;
            margin: 0;
            font-size: 16px;
            line-height: 1.55;
        }

        .tag {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 999px;
            margin: 0 8px 12px 0;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.18);
            color: #fff;
            font-size: 13px;
            font-weight: 700;
        }

        .section-title {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin: 16px 0 8px 0;
            color: #101828;
        }

        .subtle {
            color: #667085;
            font-size: 14px;
            line-height: 1.5;
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
            font-weight: 800;
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

        .pill-dark {
            display: inline-block;
            padding: 5px 11px;
            border-radius: 999px;
            background: #101828;
            color: white;
            font-size: 12px;
            font-weight: 800;
            margin: 3px 5px 3px 0;
        }

        .price-box {
            border-radius: 18px;
            padding: 16px;
            background: #101828;
            color: white;
            min-height: 126px;
        }

        .price-label {
            color: #d0d5dd;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .price-value {
            font-size: 30px;
            font-weight: 900;
            margin-top: 6px;
        }

        .good {
            color: #027a48;
            font-weight: 800;
        }

        .warn {
            color: #b54708;
            font-weight: 800;
        }

        .bad {
            color: #b42318;
            font-weight: 800;
        }

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
            background: #f8fafc;
            border: 1px dashed #98a2b3;
            font-weight: 700;
            text-align: center;
            color: #344054;
        }

        div[data-testid="stMetric"] {
            background: #ffffff;
            border: 1px solid #e4e7ec;
            padding: 14px 16px;
            border-radius: 18px;
            box-shadow: 0 8px 22px rgba(16, 24, 40, 0.045);
        }
    </style>
    """,
    unsafe_allow_html=True,
)

# ------------------------------------------------------------
# Demo constants
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
                "opportunity_score": 68,
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
                "opportunity_score": 86,
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
                "opportunity_score": 51,
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
                "opportunity_score": 91,
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
                "opportunity_score": 95,
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
                "customer": "Viking Choice",
                "zone": "Oost",
                "from_city": "Wijchen",
                "first_stop": "Zwolle",
                "last_stop": "Beek-Ubbergen",
                "vehicle_needed": "Bakwagen",
                "required_equipment": "Steekwagen, spanbanden",
                "description": "Long route with bulky consumer goods. Driver must call customers before arrival.",
                "loading_time": "06:30",
                "stops": 17,
                "packages": 46,
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
            },
            {
                "route_id": "MX-2026-0629-002",
                "date": "2026-06-29",
                "source": "MendriX route",
                "customer": "Speelgoed de Betuwe",
                "zone": "Midden",
                "from_city": "Wijchen",
                "first_stop": "Amersfoort",
                "last_stop": "Hilversum",
                "vehicle_needed": "L4",
                "required_equipment": "Steekwagen",
                "description": "Mixed toy route. Medium volume, many apartment buildings.",
                "loading_time": "07:00",
                "stops": 14,
                "packages": 39,
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
            },
            {
                "route_id": "MX-2026-0629-003",
                "date": "2026-06-29",
                "source": "MendriX route",
                "customer": "Barori BV",
                "zone": "Randstad",
                "from_city": "Wijchen",
                "first_stop": "Rotterdam",
                "last_stop": "Den Haag",
                "vehicle_needed": "L4",
                "required_equipment": "Geen extra materiaal",
                "description": "Urban route with parking difficulty. Efficient driver preferred.",
                "loading_time": "07:15",
                "stops": 22,
                "packages": 62,
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
            },
            {
                "route_id": "MX-2026-0629-004",
                "date": "2026-06-29",
                "source": "MendriX route",
                "customer": "Viking Choice",
                "zone": "Noord",
                "from_city": "Wijchen",
                "first_stop": "Assen",
                "last_stop": "Groningen",
                "vehicle_needed": "Bakwagen laadklep",
                "required_equipment": "Laadklep, pompwagen, steekwagen",
                "description": "Heavy route. Nobody accepted initial price. Route is open for bids.",
                "loading_time": "06:15",
                "stops": 18,
                "packages": 61,
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
            },
            {
                "route_id": "MX-2026-0629-005",
                "date": "2026-06-29",
                "source": "MendriX route",
                "customer": "Viking Choice",
                "zone": "Zuid",
                "from_city": "Wijchen",
                "first_stop": "Eindhoven",
                "last_stop": "Maastricht",
                "vehicle_needed": "Bakwagen",
                "required_equipment": "Laadklep aanbevolen, steekwagen verplicht",
                "description": "High kg and long route. Good candidate for fair distribution to under-used charter.",
                "loading_time": "06:45",
                "stops": 16,
                "packages": 53,
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
            },
            {
                "route_id": "MX-2026-0628-006",
                "date": "2026-06-28",
                "source": "Manual route",
                "customer": "Speelgoed de Betuwe",
                "zone": "Oost",
                "from_city": "Wijchen",
                "first_stop": "Arnhem",
                "last_stop": "Nijmegen",
                "vehicle_needed": "L3",
                "required_equipment": "Geen extra materiaal",
                "description": "Short route. Good for newer charter or trial driver.",
                "loading_time": "08:00",
                "stops": 9,
                "packages": 20,
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

    route_events = pd.DataFrame(
        [
            {"time": "05:58", "route_id": "MX-2026-0629-001", "event": "Planning exported route from MendriX"},
            {"time": "06:10", "route_id": "MX-2026-0629-001", "event": "Route assigned to LuxeLine Transport"},
            {"time": "06:28", "route_id": "MX-2026-0629-001", "event": "Driver checked in at loading"},
            {"time": "07:02", "route_id": "MX-2026-0629-002", "event": "Bidding opened because route was not accepted"},
            {"time": "07:13", "route_id": "MX-2026-0629-004", "event": "Noord route received 4 bids"},
        ]
    )

    return charters, vehicles, drivers, routes, bids, route_events


if "demo_initialized" not in st.session_state:
    (
        st.session_state.charters,
        st.session_state.vehicles,
        st.session_state.drivers,
        st.session_state.routes,
        st.session_state.bids,
        st.session_state.route_events,
    ) = load_demo_data()
    st.session_state.demo_initialized = True


charters = st.session_state.charters
vehicles = st.session_state.vehicles
drivers = st.session_state.drivers
routes = st.session_state.routes
bids = st.session_state.bids
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

def get_best_bid(route_id: str) -> pd.Series | None:
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
    earnings = (
        routes_df[routes_df["assigned_charter"] != ""]
        .groupby("assigned_charter")["route_price"]
        .sum()
        .rename("assigned_value")
        .reset_index()
    )
    fair = charters_df[["company", "zones", "rating", "on_time_pct", "opportunity_score", "this_week_routes", "this_week_earnings"]].copy()
    fair = fair.merge(assigned_counts, left_on="company", right_on="assigned_charter", how="left").drop(columns=["assigned_charter"], errors="ignore")
    fair = fair.merge(earnings, left_on="company", right_on="assigned_charter", how="left").drop(columns=["assigned_charter"], errors="ignore")
    fair[["assigned_routes", "assigned_value"]] = fair[["assigned_routes", "assigned_value"]].fillna(0)
    fair["fairness_priority"] = (
        fair["opportunity_score"] * 0.45
        + (100 - fair["this_week_routes"] * 12).clip(lower=0) * 0.25
        + fair["rating"] * 6
        + (fair["on_time_pct"] / 2) * 0.15
    ).round(1)
    fair["recommendation"] = fair["fairness_priority"].apply(
        lambda x: "Give more opportunity" if x >= 78 else ("Balanced" if x >= 62 else "Already received enough")
    )
    return fair.sort_values("fairness_priority", ascending=False)


fairness_df = fairness_recommendations(routes, charters)

# ------------------------------------------------------------
# Helper UI
# ------------------------------------------------------------
def money(value: float) -> str:
    return f"€{value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def status_class(status: str) -> str:
    if status in ["Completed", "Assigned"]:
        return "good"
    if status in ["Open", "Open for bid", "In progress"]:
        return "warn"
    return "subtle"


def hero():
    st.markdown(
        """
        <div class="hero">
            <span class="tag">MendriX route upload</span>
            <span class="tag">Charter marketplace</span>
            <span class="tag">Bid approval</span>
            <span class="tag">Weekly factuur</span>
            <span class="tag">Power BI-style dashboard</span>
            <h1>Cargro Charterportaal MVP</h1>
            <p>
                A sexy working prototype for Stan: planning uploads routes from MendriX, the portal calculates total route price,
                charters can bid on difficult routes, weekly invoices are transparent, and Cargro can track margin, performance and fair opportunity.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_route_card(row: pd.Series, show_actions: bool = True):
    best_bid = get_best_bid(row["route_id"])
    bid_text = "No bids yet"
    if best_bid is not None:
        bid_text = f"Best/recommended bid: {money(best_bid['bid_price'])} by {best_bid['charter']}"

    margin_class = "good" if row["cargro_margin"] >= 120 else ("warn" if row["cargro_margin"] >= 60 else "bad")

    col_left, col_right = st.columns([3, 1])
    with col_left:
        st.markdown(
            f"""
            <div class="route-card">
                <div class="route-title">{row['route_id']} · {row['customer']}</div>
                <div class="route-meta">
                    {row['date']} · {ZONE_BADGES.get(row['zone'], row['zone'])} · Load {row['loading_time']} ·
                    {row['from_city']} → {row['first_stop']} → {row['last_stop']}
                </div>
                <span class="pill-dark">{row['vehicle_needed']}</span>
                <span class="pill">{row['kg']} kg</span>
                <span class="pill">{row['stops']} stops</span>
                <span class="pill">{row['km']} km</span>
                <span class="pill">{row['hours']} hours</span>
                <span class="pill">{row['required_equipment']}</span>
                <p class="subtle" style="margin-top: 12px;">{row['description']}</p>
                <p class="subtle"><b>Status:</b> <span class="{status_class(row['status'])}">{row['status']}</span> · <b>Assigned:</b> {row['assigned_charter'] or 'Not assigned'} · <b>Bids:</b> {int(row['bids_count'])}</p>
                <p class="subtle"><b>{bid_text}</b></p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with col_right:
        st.markdown(
            f"""
            <div class="price-box">
                <div class="price-label">Calculated route price</div>
                <div class="price-value">{money(row['route_price'])}</div>
                <div class="price-label" style="margin-top: 10px;">Cargro margin</div>
                <div class="{margin_class}" style="font-size: 22px;">{money(row['cargro_margin'])} · {row['margin_pct']}%</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        if show_actions and row["bidding_allowed"] == "Yes":
            with st.popover("Place bid / approve"):
                st.write("Demo bidding form")
                selected_charter = st.selectbox("Charter", charters["company"], key=f"bid_charter_{row['route_id']}")
                default_bid = float(max(row["route_price"] + 25, row["route_price"]))
                bid_amount = st.number_input("Bid price", min_value=0.0, value=round(default_bid, 2), step=10.0, key=f"bid_amount_{row['route_id']}")
                note = st.text_area("Bid note", value="Available and can meet route requirements.", key=f"bid_note_{row['route_id']}")
                if st.button("Submit demo bid", key=f"submit_bid_{row['route_id']}"):
                    new_bid = pd.DataFrame(
                        [
                            {
                                "route_id": row["route_id"],
                                "charter": selected_charter,
                                "bid_price": bid_amount,
                                "vehicle": row["vehicle_needed"],
                                "driver": "To be selected",
                                "note": note,
                                "approved": "No",
                            }
                        ]
                    )
                    st.session_state.bids = pd.concat([st.session_state.bids, new_bid], ignore_index=True)
                    st.success("Demo bid added. Refresh/change page to see it in the bid table.")

# ------------------------------------------------------------
# Sidebar
# ------------------------------------------------------------
st.sidebar.title("🚚 Cargro Portal")
st.sidebar.caption("Stan-style charterportaal prototype")
page = st.sidebar.radio(
    "Open module",
    [
        "Executive overview",
        "Planning route upload",
        "Route marketplace",
        "Bid approval",
        "Charter account",
        "Weekly factuur",
        "Power BI dashboard",
        "Fairness system",
        "MendriX data flow",
    ],
)
st.sidebar.markdown("---")
st.sidebar.write("**Vehicle km rates**")
for vehicle, rate in VEHICLE_KM_RATES.items():
    st.sidebar.write(f"{vehicle}: €{rate:.2f}/km")
st.sidebar.markdown("---")
st.sidebar.caption("Fake demo data only. Later this becomes database + MendriX API.")

hero()

# ------------------------------------------------------------
# Executive overview
# ------------------------------------------------------------
if page == "Executive overview":
    total_routes = len(routes)
    open_routes = len(routes[routes["assigned_charter"] == ""])
    total_revenue = routes["cargro_customer_revenue"].sum()
    total_charter_cost = routes["route_price"].sum()
    total_margin = total_revenue - total_charter_cost
    avg_margin_pct = (total_margin / total_revenue * 100) if total_revenue else 0

    m1, m2, m3, m4, m5 = st.columns(5)
    m1.metric("Routes in portal", total_routes)
    m2.metric("Open routes", open_routes)
    m3.metric("Customer revenue", money(total_revenue))
    m4.metric("Charter payout", money(total_charter_cost))
    m5.metric("Cargro margin", f"{money(total_margin)} · {avg_margin_pct:.1f}%")

    st.markdown('<div class="section-title">What this portal does</div>', unsafe_allow_html=True)
    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown('<div class="mini-card"><h4>1. Planning uploads routes</h4><strong>MendriX → Portal</strong><p class="subtle">Route, km, stops, hours, kg, zone, vehicle and loading time enter the charterportaal.</p></div>', unsafe_allow_html=True)
    with c2:
        st.markdown('<div class="mini-card"><h4>2. Portal calculates price</h4><strong>km + stops + hours</strong><p class="subtle">Vehicle-specific km rate is used: L3, L4, Bakwagen or Bakwagen laadklep.</p></div>', unsafe_allow_html=True)
    with c3:
        st.markdown('<div class="mini-card"><h4>3. Charters accept or bid</h4><strong>Marketplace</strong><p class="subtle">Difficult routes can receive higher bids, then planning approves the best/fair option.</p></div>', unsafe_allow_html=True)

    st.markdown('<div class="section-title">Today’s route board</div>', unsafe_allow_html=True)
    route_board = routes[
        [
            "route_id",
            "customer",
            "zone",
            "vehicle_needed",
            "loading_time",
            "stops",
            "kg",
            "km",
            "hours",
            "route_price",
            "cargro_customer_revenue",
            "cargro_margin",
            "status",
            "assigned_charter",
        ]
    ].copy()
    st.dataframe(route_board, use_container_width=True, hide_index=True)

# ------------------------------------------------------------
# Planning route upload
# ------------------------------------------------------------
elif page == "Planning route upload":
    st.markdown('<div class="section-title">Planning route upload</div>', unsafe_allow_html=True)
    st.caption("This simulates planning uploading a route made in MendriX. In the real version this can be CSV/API import.")

    with st.expander("Expected MendriX/import fields", expanded=True):
        st.dataframe(
            pd.DataFrame(
                [
                    {"field": "route_id", "example": "MX-2026-0629-007"},
                    {"field": "zone", "example": "Oost / Midden / Zuid / Noord / West / Randstad"},
                    {"field": "vehicle_needed", "example": "L3 / L4 / Bakwagen / Bakwagen laadklep"},
                    {"field": "loading_time", "example": "06:30"},
                    {"field": "stops, km, hours, kg", "example": "17 stops, 420 km, 10.5 hours, 850 kg"},
                    {"field": "required_equipment", "example": "Laadklep, steekwagen, pompwagen"},
                    {"field": "description", "example": "Heavy route, customer calls required"},
                ]
            ),
            use_container_width=True,
            hide_index=True,
        )

    uploaded = st.file_uploader("Upload demo CSV from planning/MendriX", type=["csv"])
    if uploaded is not None:
        try:
            uploaded_df = pd.read_csv(uploaded)
            st.success("CSV loaded in demo view.")
            st.dataframe(uploaded_df, use_container_width=True)
        except Exception as exc:
            st.error(f"Could not read CSV: {exc}")

    st.markdown("### Add route manually for demo")
    with st.form("manual_route_form"):
        col1, col2, col3 = st.columns(3)
        with col1:
            route_id = st.text_input("Route ID", value="MX-2026-0629-007")
            customer = st.selectbox("Customer", ["Viking Choice", "Speelgoed de Betuwe", "Barori BV", "New customer"])
            zone = st.selectbox("Zone", list(ZONE_BADGES.keys()))
            loading_time = st.text_input("Loading time", value="07:00")
        with col2:
            vehicle_needed = st.selectbox("Vehicle needed", list(VEHICLE_KM_RATES.keys()))
            stops_input = st.number_input("Stops", min_value=1, value=13)
            km_input = st.number_input("KM", min_value=1, value=285)
            hours_input = st.number_input("Hours", min_value=1.0, value=8.5, step=0.5)
        with col3:
            kg_input = st.number_input("Kilos", min_value=0, value=540)
            packages_input = st.number_input("Packages", min_value=1, value=34)
            stop_tariff = st.number_input("Stop tariff", min_value=0.0, value=12.25, step=0.25)
            hour_rate = st.number_input("Hour rate", min_value=0.0, value=23.50, step=0.50)

        equipment = st.multiselect("Needed equipment", ["Laadklep", "Steekwagen", "Pompwagen", "Spanbanden", "Customer call before arrival"], default=["Steekwagen"])
        description = st.text_area("Omschrijving", value="Demo route uploaded by planning. Add special instructions here.")
        customer_revenue = st.number_input("Cargro customer revenue", min_value=0.0, value=585.00, step=10.0)

        submitted = st.form_submit_button("Add route to portal")
        if submitted:
            new_route = pd.DataFrame(
                [
                    {
                        "route_id": route_id,
                        "date": str(date.today()),
                        "source": "Planning manual upload",
                        "customer": customer,
                        "zone": zone,
                        "from_city": "Wijchen",
                        "first_stop": "Demo first stop",
                        "last_stop": "Demo last stop",
                        "vehicle_needed": vehicle_needed,
                        "required_equipment": ", ".join(equipment) if equipment else "Geen extra materiaal",
                        "description": description,
                        "loading_time": loading_time,
                        "stops": int(stops_input),
                        "packages": int(packages_input),
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
                    }
                ]
            )
            st.session_state.routes = pd.concat([st.session_state.routes, new_route], ignore_index=True)
            st.success("Demo route added to the portal. Open Route marketplace to see it.")

# ------------------------------------------------------------
# Route marketplace
# ------------------------------------------------------------
elif page == "Route marketplace":
    st.markdown('<div class="section-title">Route marketplace for charters</div>', unsafe_allow_html=True)
    st.caption("Planning publishes routes. Charters can accept, request, or bid higher if the route is difficult.")

    f1, f2, f3 = st.columns(3)
    with f1:
        zone_filter = st.selectbox("Filter zone", ["All"] + list(ZONE_BADGES.keys()))
    with f2:
        vehicle_filter = st.selectbox("Filter vehicle", ["All"] + list(VEHICLE_KM_RATES.keys()))
    with f3:
        status_filter = st.selectbox("Filter status", ["All", "Open", "Open for bid", "Assigned", "Completed"])

    filtered = routes.copy()
    if zone_filter != "All":
        filtered = filtered[filtered["zone"] == zone_filter]
    if vehicle_filter != "All":
        filtered = filtered[filtered["vehicle_needed"] == vehicle_filter]
    if status_filter != "All":
        filtered = filtered[filtered["status"] == status_filter]

    for _, row in filtered.iterrows():
        render_route_card(row)

# ------------------------------------------------------------
# Bid approval
# ------------------------------------------------------------
elif page == "Bid approval":
    st.markdown('<div class="section-title">Bid approval cockpit</div>', unsafe_allow_html=True)
    st.caption("Routes that nobody wants can receive bids. Planning can approve based on price, equipment, location, performance and fairness.")

    selected_route_id = st.selectbox("Select route with bids", sorted(bids["route_id"].unique()))
    selected_route = routes[routes["route_id"] == selected_route_id].iloc[0]
    render_route_card(selected_route, show_actions=False)

    route_bids = bids[bids["route_id"] == selected_route_id].merge(
        charters[["company", "rating", "on_time_pct", "opportunity_score", "this_week_routes", "this_week_earnings"]],
        left_on="charter",
        right_on="company",
        how="left",
    )
    route_bids["above_base"] = (route_bids["bid_price"] - selected_route["route_price"]).round(2)
    route_bids["approval_score"] = (
        (100 - route_bids["above_base"].clip(lower=0) / 5).clip(lower=0) * 0.35
        + route_bids["rating"] * 10 * 0.20
        + route_bids["on_time_pct"] * 0.20
        + route_bids["opportunity_score"] * 0.25
    ).round(1)

    st.markdown("### Bids received")
    st.dataframe(
        route_bids[
            [
                "charter",
                "bid_price",
                "above_base",
                "vehicle",
                "driver",
                "rating",
                "on_time_pct",
                "opportunity_score",
                "this_week_routes",
                "approval_score",
                "approved",
                "note",
            ]
        ].sort_values("approval_score", ascending=False),
        use_container_width=True,
        hide_index=True,
    )

    recommended = route_bids.sort_values("approval_score", ascending=False).iloc[0]
    st.success(
        f"Recommended approval: {recommended['charter']} at {money(recommended['bid_price'])}. "
        f"Reason: best combined score for price, performance and fair opportunity."
    )

    selected_bidder = st.selectbox("Approve charter", route_bids["charter"])
    if st.button("Approve selected bid in demo"):
        st.success(f"Demo: {selected_bidder} approved for route {selected_route_id}. Real version updates route assignment and notifies charter.")

# ------------------------------------------------------------
# Charter account
# ------------------------------------------------------------
elif page == "Charter account":
    st.markdown('<div class="section-title">Charter account page</div>', unsafe_allow_html=True)
    st.caption("This is the private login section for each charter. Vehicles, drivers, assigned routes, bids and weekly factuur are connected.")

    selected_charter = st.selectbox("Login as charter", charters["company"])
    profile = charters[charters["company"] == selected_charter].iloc[0]
    my_vehicles = vehicles[vehicles["charter"] == selected_charter]
    my_drivers = drivers[drivers["charter"] == selected_charter]
    my_routes = routes[routes["assigned_charter"] == selected_charter]
    my_bids = bids[bids["charter"] == selected_charter]

    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Status", profile["status"])
    c2.metric("Rating", profile["rating"])
    c3.metric("On-time", f"{profile['on_time_pct']}%")
    c4.metric("This week routes", int(profile["this_week_routes"]))
    c5.metric("This week earnings", money(profile["this_week_earnings"]))

    tab1, tab2, tab3, tab4 = st.tabs(["Routes", "Vehicles", "Drivers", "Bids & opportunity"])

    with tab1:
        st.subheader("Assigned routes")
        if my_routes.empty:
            st.info("No assigned routes yet.")
        else:
            st.dataframe(
                my_routes[
                    [
                        "route_id",
                        "date",
                        "customer",
                        "zone",
                        "vehicle_needed",
                        "loading_time",
                        "stops",
                        "kg",
                        "km",
                        "hours",
                        "route_price",
                        "status",
                    ]
                ],
                use_container_width=True,
                hide_index=True,
            )
            selected_route = st.selectbox("See tariff specification", my_routes["route_id"])
            row = my_routes[my_routes["route_id"] == selected_route].iloc[0]
            st.markdown("#### Tarief specificatie")
            spec = pd.DataFrame(
                [
                    {"Onderdeel": "KM", "Berekening": f"{row['km']} km × €{row['vehicle_km_rate']:.2f}", "Bedrag": money(row["km_amount"])},
                    {"Onderdeel": "Stops", "Berekening": f"{row['stops']} stops × €{row['stop_tariff']:.2f}", "Bedrag": money(row["stop_amount"])},
                    {"Onderdeel": "Uren", "Berekening": f"{row['hours']} uur × €{row['hour_rate']:.2f}", "Bedrag": money(row["hour_amount"])},
                    {"Onderdeel": "Totaal routeprijs", "Berekening": "KM + stops + uren", "Bedrag": money(row["route_price"])},
                ]
            )
            st.dataframe(spec, use_container_width=True, hide_index=True)

    with tab2:
        st.subheader("My uploaded vehicles")
        st.dataframe(my_vehicles, use_container_width=True, hide_index=True)
        with st.expander("Upload new vehicle demo"):
            st.text_input("Kenteken")
            st.selectbox("Vehicle type", list(VEHICLE_KM_RATES.keys()))
            st.number_input("Capacity kg", value=800)
            st.file_uploader("Upload vehicle document/photo", type=["pdf", "jpg", "png"])
            st.button("Save vehicle demo")

    with tab3:
        st.subheader("My drivers")
        st.dataframe(my_drivers, use_container_width=True, hide_index=True)
        with st.expander("Add driver demo"):
            st.text_input("Driver name")
            st.text_input("Phone")
            st.selectbox("License", ["B", "C", "CE"])
            st.button("Save driver demo")

    with tab4:
        st.subheader("My bids and fair opportunity")
        st.dataframe(my_bids, use_container_width=True, hide_index=True)
        st.info(
            f"Opportunity score for {selected_charter}: {profile['opportunity_score']}. "
            "Higher score means this charter should receive more fair chances when performance and route fit are acceptable."
        )

# ------------------------------------------------------------
# Weekly factuur
# ------------------------------------------------------------
elif page == "Weekly factuur":
    st.markdown('<div class="section-title">Weekly factuur / self-billing</div>', unsafe_allow_html=True)
    st.caption("Charter and Cargro can both see the weekly invoice with transparent route specifications.")

    selected_charter = st.selectbox("Select charter", charters["company"])
    week_routes = routes[(routes["assigned_charter"] == selected_charter) & (routes["status"].isin(["Assigned", "Completed"]))]

    if week_routes.empty:
        st.info("No routes for this week.")
    else:
        total_ex = week_routes["route_price"].sum()
        vat = total_ex * 0.21
        total_inc = total_ex + vat

        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Routes", len(week_routes))
        c2.metric("Stops", int(week_routes["stops"].sum()))
        c3.metric("Total excl. BTW", money(total_ex))
        c4.metric("Total incl. BTW", money(total_inc))

        invoice_lines = week_routes[
            [
                "route_id",
                "date",
                "customer",
                "zone",
                "vehicle_needed",
                "km",
                "vehicle_km_rate",
                "km_amount",
                "stops",
                "stop_tariff",
                "stop_amount",
                "hours",
                "hour_rate",
                "hour_amount",
                "route_price",
            ]
        ].copy()
        st.dataframe(invoice_lines, use_container_width=True, hide_index=True)

        st.markdown("### Factuur uitleg")
        st.write("Every route price is explained as:")
        st.code("route price = (km × vehicle km rate) + (stops × stop tariff) + (hours × hour rate)", language="text")

        col_a, col_b = st.columns(2)
        with col_a:
            if st.button("Charter akkoord"):
                st.success("Demo: charter approved weekly factuur.")
        with col_b:
            if st.button("Vraag/dispute openen"):
                st.warning("Demo: dispute created and linked to the invoice lines.")

# ------------------------------------------------------------
# Power BI dashboard
# ------------------------------------------------------------
elif page == "Power BI dashboard":
    st.markdown('<div class="section-title">Power BI-style dashboard</div>', unsafe_allow_html=True)
    st.caption("Management view: margin per route, performance per charter, route cost, and scoreboard.")

    total_revenue = routes["cargro_customer_revenue"].sum()
    total_cost = routes["route_price"].sum()
    total_margin = total_revenue - total_cost
    avg_margin = total_margin / total_revenue * 100 if total_revenue else 0

    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Revenue", money(total_revenue))
    k2.metric("Charter cost", money(total_cost))
    k3.metric("Margin", money(total_margin))
    k4.metric("Margin %", f"{avg_margin:.1f}%")

    tab1, tab2, tab3 = st.tabs(["Margin by route", "Charter performance", "Scoreboard"])

    with tab1:
        margin_df = routes[["route_id", "customer", "zone", "vehicle_needed", "cargro_customer_revenue", "route_price", "cargro_margin", "margin_pct"]].copy()
        st.dataframe(margin_df.sort_values("cargro_margin", ascending=False), use_container_width=True, hide_index=True)
        st.bar_chart(margin_df.set_index("route_id")["cargro_margin"])

    with tab2:
        performance = charters[["company", "rating", "on_time_pct", "damage_rate", "acceptance_pct", "this_week_routes", "this_week_earnings", "opportunity_score"]].copy()
        st.dataframe(performance.sort_values("rating", ascending=False), use_container_width=True, hide_index=True)
        st.bar_chart(performance.set_index("company")[["rating", "opportunity_score"]])

    with tab3:
        scoreboard = charters[["company", "this_week_earnings", "this_week_routes", "rating", "on_time_pct"]].copy()
        scoreboard["rank"] = scoreboard["this_week_earnings"].rank(ascending=False, method="dense").astype(int)
        st.dataframe(scoreboard.sort_values("rank"), use_container_width=True, hide_index=True)
        st.bar_chart(scoreboard.set_index("company")["this_week_earnings"])

# ------------------------------------------------------------
# Fairness system
# ------------------------------------------------------------
elif page == "Fairness system":
    st.markdown('<div class="section-title">Fair route distribution system</div>', unsafe_allow_html=True)
    st.caption("This prevents one charter from always getting the best routes while still protecting quality and reliability.")

    st.markdown(
        """
        The portal can recommend who should get a route using a mixed score:

        - Route fit: correct zone, vehicle, equipment and capacity.
        - Performance: on-time %, damage rate, acceptance rate and rating.
        - Fair chance: how many routes and earnings the charter already received this week.
        - Price: route base price or bid price.
        - Operational risk: loading time, kg, difficulty and customer requirements.
        """
    )

    st.dataframe(fairness_df, use_container_width=True, hide_index=True)

    st.markdown("### Fairness logic example")
    st.code(
        """fairness_priority =
  opportunity_score * 45%
+ under-used this week * 25%
+ rating/performance * 20%
+ zone/vehicle fit * 10%

Planning can override, but must add a reason.""",
        language="text",
    )

    st.info(
        "This means the cheapest charter does not always win. The portal can recommend the fairest good option: good price, correct vehicle, reliable performance and enough opportunity."
    )

# ------------------------------------------------------------
# MendriX data flow
# ------------------------------------------------------------
elif page == "MendriX data flow":
    st.markdown('<div class="section-title">MendriX ↔ Charterportaal data flow</div>', unsafe_allow_html=True)

    f1, f2, f3, f4, f5 = st.columns(5)
    f1.markdown('<div class="data-flow">1. MendriX<br>Route created</div>', unsafe_allow_html=True)
    f2.markdown('<div class="data-flow">2. Portal<br>Calculate price</div>', unsafe_allow_html=True)
    f3.markdown('<div class="data-flow">3. Charter<br>Accept / bid</div>', unsafe_allow_html=True)
    f4.markdown('<div class="data-flow">4. Driver<br>Load + deliver</div>', unsafe_allow_html=True)
    f5.markdown('<div class="data-flow">5. Finance<br>Weekly invoice</div>', unsafe_allow_html=True)

    st.markdown("### What planning uploads from MendriX")
    st.dataframe(
        routes[
            [
                "route_id",
                "source",
                "customer",
                "zone",
                "vehicle_needed",
                "loading_time",
                "stops",
                "packages",
                "kg",
                "km",
                "hours",
                "required_equipment",
                "description",
            ]
        ],
        use_container_width=True,
        hide_index=True,
    )

    st.markdown("### Event timeline")
    st.dataframe(route_events, use_container_width=True, hide_index=True)

    st.markdown("### Final architecture")
    st.write(
        "MendriX remains the TMS. The charterportaal becomes the custom external network layer: route marketplace, bidding, charter documents, driver/vehicle management, weekly factuur, dashboard and fairness logic."
    )
