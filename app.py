import streamlit as st
import pandas as pd
from datetime import date

st.set_page_config(
    page_title="Cargro Charterportaal Demo",
    page_icon="🚚",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ------------------------------------------------------------
# Demo styling
# ------------------------------------------------------------
st.markdown(
    """
    <style>
        .block-container {
            padding-top: 1.5rem;
        }
        .hero {
            background: linear-gradient(135deg, #101828 0%, #1d2939 55%, #344054 100%);
            color: white;
            padding: 26px;
            border-radius: 22px;
            margin-bottom: 22px;
        }
        .hero h1 {
            margin-bottom: 6px;
        }
        .hero p {
            color: #d0d5dd;
            font-size: 16px;
            margin: 0;
        }
        .card {
            background: white;
            border: 1px solid #eaecf0;
            border-radius: 16px;
            padding: 18px;
            box-shadow: 0 2px 8px rgba(16, 24, 40, 0.04);
        }
        .muted {
            color: #667085;
            font-size: 14px;
        }
        .pill {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: #f2f4f7;
            color: #344054;
            font-size: 13px;
            font-weight: 600;
        }
    </style>
    """,
    unsafe_allow_html=True,
)

# ------------------------------------------------------------
# Demo data - in a real version this comes from MendriX/API/database
# ------------------------------------------------------------
charters = pd.DataFrame(
    [
        {
            "charter_id": "CH-001",
            "company": "LuxeLine Detailing",
            "contact": "Daya",
            "vehicle": "Bakwagen",
            "plate": "V-123-AB",
            "home_city": "Nijmegen",
            "zone": "Oost / Midden",
            "niwo": "Yes",
            "status": "Active",
            "rating": 4.8,
            "documents": "Complete",
        },
        {
            "charter_id": "CH-002",
            "company": "Duiven Transport",
            "contact": "Driver Duiven",
            "vehicle": "Sprinter",
            "plate": "V-456-CD",
            "home_city": "Duiven",
            "zone": "Oost",
            "niwo": "Pending",
            "status": "Trial",
            "rating": 4.2,
            "documents": "Missing NIWO",
        },
        {
            "charter_id": "CH-003",
            "company": "Randstad Koeriers",
            "contact": "Ahmed",
            "vehicle": "L4H3",
            "plate": "V-789-EF",
            "home_city": "Utrecht",
            "zone": "Randstad",
            "niwo": "Yes",
            "status": "Active",
            "rating": 4.5,
            "documents": "Complete",
        },
        {
            "charter_id": "CH-004",
            "company": "Noord Carrier Network",
            "contact": "Jeroen",
            "vehicle": "Bakwagen laadklep",
            "plate": "V-333-GH",
            "home_city": "Groningen",
            "zone": "Noord",
            "niwo": "Yes",
            "status": "Available",
            "rating": 4.4,
            "documents": "Insurance review",
        },
    ]
)

routes = pd.DataFrame(
    [
        {
            "route_id": "MX-2026-0626-001",
            "source": "MendriX import",
            "date": "2026-06-26",
            "customer": "Viking Choice",
            "zone": "Oost",
            "charter": "LuxeLine Detailing",
            "vehicle_needed": "Bakwagen",
            "loading_time": "06:30",
            "stops": 17,
            "packages": 42,
            "km": 727,
            "hours": 14,
            "heavy_stops": 2,
            "base_stop_tariff": 21.50,
            "diesel_correction": 14.50,
            "status": "Completed",
            "issues": 1,
        },
        {
            "route_id": "MX-2026-0626-002",
            "source": "MendriX import",
            "date": "2026-06-26",
            "customer": "Speelgoed de Betuwe",
            "zone": "Oost",
            "charter": "Duiven Transport",
            "vehicle_needed": "Sprinter",
            "loading_time": "07:15",
            "stops": 12,
            "packages": 26,
            "km": 310,
            "hours": 9,
            "heavy_stops": 0,
            "base_stop_tariff": 20.50,
            "diesel_correction": 8.00,
            "status": "In progress",
            "issues": 0,
        },
        {
            "route_id": "MX-2026-0626-003",
            "source": "MendriX import",
            "date": "2026-06-26",
            "customer": "Barori BV",
            "zone": "Randstad",
            "charter": "Randstad Koeriers",
            "vehicle_needed": "L4H3",
            "loading_time": "07:00",
            "stops": 21,
            "packages": 55,
            "km": 390,
            "hours": 11,
            "heavy_stops": 1,
            "base_stop_tariff": 22.00,
            "diesel_correction": 10.00,
            "status": "Planned",
            "issues": 0,
        },
        {
            "route_id": "MX-2026-0625-004",
            "source": "Manual correction",
            "date": "2026-06-25",
            "customer": "Viking Choice",
            "zone": "Zuid",
            "charter": "LuxeLine Detailing",
            "vehicle_needed": "Bakwagen",
            "loading_time": "06:45",
            "stops": 15,
            "packages": 38,
            "km": 520,
            "hours": 12,
            "heavy_stops": 3,
            "base_stop_tariff": 21.50,
            "diesel_correction": 12.00,
            "status": "Completed",
            "issues": 2,
        },
        {
            "route_id": "MX-2026-0627-005",
            "source": "MendriX import",
            "date": "2026-06-27",
            "customer": "Viking Choice",
            "zone": "Noord",
            "charter": "Noord Carrier Network",
            "vehicle_needed": "Bakwagen laadklep",
            "loading_time": "06:15",
            "stops": 18,
            "packages": 61,
            "km": 455,
            "hours": 11,
            "heavy_stops": 4,
            "base_stop_tariff": 22.00,
            "diesel_correction": 11.50,
            "status": "Assigned",
            "issues": 0,
        },
    ]
)

issues = pd.DataFrame(
    [
        {
            "issue_id": "ISS-001",
            "route_id": "MX-2026-0626-001",
            "stop": "Zwolle",
            "type": "Not home",
            "photo": "Uploaded",
            "return_required": "Yes",
            "status": "Open",
        },
        {
            "issue_id": "ISS-002",
            "route_id": "MX-2026-0625-004",
            "stop": "Eindhoven",
            "type": "Damaged box",
            "photo": "Uploaded",
            "return_required": "No",
            "status": "Under review",
        },
        {
            "issue_id": "ISS-003",
            "route_id": "MX-2026-0625-004",
            "stop": "Tilburg",
            "type": "Wrong address",
            "photo": "Uploaded",
            "return_required": "Yes",
            "status": "Closed",
        },
    ]
)

stops = pd.DataFrame(
    [
        {
            "route_id": "MX-2026-0626-001",
            "stop_no": 1,
            "city": "Zwolle",
            "address": "Demo address 1",
            "barcode": "VC-10001",
            "packages": 3,
            "size": "Medium",
            "status": "Not home",
        },
        {
            "route_id": "MX-2026-0626-001",
            "stop_no": 2,
            "city": "Apeldoorn",
            "address": "Demo address 2",
            "barcode": "VC-10002",
            "packages": 2,
            "size": "Small",
            "status": "Delivered",
        },
        {
            "route_id": "MX-2026-0626-001",
            "stop_no": 3,
            "city": "Arnhem",
            "address": "Demo address 3",
            "barcode": "VC-10003",
            "packages": 5,
            "size": "Large",
            "status": "Delivered",
        },
        {
            "route_id": "MX-2026-0626-001",
            "stop_no": 4,
            "city": "Nijmegen",
            "address": "Demo address 4",
            "barcode": "VC-10004",
            "packages": 1,
            "size": "Small",
            "status": "Delivered",
        },
    ]
)

# ------------------------------------------------------------
# Tariff engine
# ------------------------------------------------------------
def calculate_route_price(row: pd.Series) -> tuple[float, float, float, float, float]:
    """Example Cargro-style tariff engine.

    Real rules can be changed later per customer, charter, zone, diesel index or vehicle.
    """
    base_amount = row["stops"] * row["base_stop_tariff"]
    km_correction = max(row["km"] - 300, 0) * 0.35
    hour_correction = max(row["hours"] - 10, 0) * 18.00
    heavy_surcharge = row["heavy_stops"] * 15.00

    total_ex_vat = (
        base_amount
        + row["diesel_correction"]
        + km_correction
        + hour_correction
        + heavy_surcharge
    )

    return (
        round(base_amount, 2),
        round(km_correction, 2),
        round(hour_correction, 2),
        round(heavy_surcharge, 2),
        round(total_ex_vat, 2),
    )


price_rows = routes.apply(calculate_route_price, axis=1)
routes["base_amount"] = [x[0] for x in price_rows]
routes["km_correction"] = [x[1] for x in price_rows]
routes["hour_correction"] = [x[2] for x in price_rows]
routes["heavy_surcharge"] = [x[3] for x in price_rows]
routes["total_ex_vat"] = [x[4] for x in price_rows]
routes["vat_21"] = (routes["total_ex_vat"] * 0.21).round(2)
routes["total_inc_vat"] = (routes["total_ex_vat"] + routes["vat_21"]).round(2)

# ------------------------------------------------------------
# Sidebar
# ------------------------------------------------------------
st.sidebar.title("🚚 Charterportaal")
st.sidebar.caption("Demo layer on top of MendriX")
role = st.sidebar.selectbox(
    "Open portal as",
    ["Admin / Cargro Office", "Charter", "Driver", "MendriX Connection Plan"],
)
st.sidebar.markdown("---")
st.sidebar.write("**Demo status**")
st.sidebar.write("No real customer data")
st.sidebar.write("No live MendriX connection yet")
st.sidebar.write("Ready for Streamlit Cloud")

# ------------------------------------------------------------
# Header
# ------------------------------------------------------------
st.markdown(
    """
    <div class="hero">
        <h1>Cargro Charterportaal Demo</h1>
        <p>Prototype for charter onboarding, route assignment, tariff calculation, POD issues, weekly payout and future MendriX connection.</p>
    </div>
    """,
    unsafe_allow_html=True,
)

# ------------------------------------------------------------
# Admin view
# ------------------------------------------------------------
if role == "Admin / Cargro Office":
    total_routes = len(routes)
    completed_routes = len(routes[routes["status"] == "Completed"])
    total_payout = routes["total_ex_vat"].sum()
    open_issues = len(issues[issues["status"] != "Closed"])
    active_charters = len(charters[charters["status"].isin(["Active", "Available", "Trial"])])

    col1, col2, col3, col4, col5 = st.columns(5)
    col1.metric("Routes", total_routes)
    col2.metric("Completed", completed_routes)
    col3.metric("Charters", active_charters)
    col4.metric("Open issues", open_issues)
    col5.metric("Payout excl. VAT", f"€{total_payout:,.2f}")

    tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs(
        [
            "Route control",
            "Charters",
            "Tariff engine",
            "Weekly payout",
            "Issues / returns",
            "Strategic dashboard",
        ]
    )

    with tab1:
        st.subheader("Route control")
        st.caption("Routes imported from MendriX can be enriched with charter, tariff and invoice logic here.")
        st.dataframe(
            routes[
                [
                    "route_id",
                    "source",
                    "date",
                    "customer",
                    "zone",
                    "charter",
                    "vehicle_needed",
                    "loading_time",
                    "stops",
                    "packages",
                    "km",
                    "hours",
                    "status",
                    "total_ex_vat",
                ]
            ],
            use_container_width=True,
            hide_index=True,
        )
        st.bar_chart(routes.set_index("route_id")["total_ex_vat"])

    with tab2:
        st.subheader("Charter network")
        st.caption("This is where Cargro manages subcontractors, zones, vehicles, documents and compliance.")
        st.dataframe(charters, use_container_width=True, hide_index=True)

    with tab3:
        st.subheader("Tariff engine")
        selected_route = st.selectbox("Select route", routes["route_id"])
        route = routes[routes["route_id"] == selected_route].iloc[0]

        col_a, col_b = st.columns(2)
        with col_a:
            st.markdown("### Route details")
            st.write(f"**Customer:** {route['customer']}")
            st.write(f"**Charter:** {route['charter']}")
            st.write(f"**Zone:** {route['zone']}")
            st.write(f"**Stops:** {route['stops']}")
            st.write(f"**KM:** {route['km']}")
            st.write(f"**Hours:** {route['hours']}")
            st.write(f"**Heavy stops:** {route['heavy_stops']}")

        with col_b:
            st.markdown("### Price build-up")
            st.write(f"Base: {route['stops']} × €{route['base_stop_tariff']} = **€{route['base_amount']}**")
            st.write(f"Diesel correction: **€{route['diesel_correction']}**")
            st.write(f"KM correction: **€{route['km_correction']}**")
            st.write(f"Hour correction: **€{route['hour_correction']}**")
            st.write(f"Heavy surcharge: **€{route['heavy_surcharge']}**")
            st.markdown("---")
            st.success(f"Total excl. VAT: €{route['total_ex_vat']}")
            st.info(f"Total incl. VAT: €{route['total_inc_vat']}")

        st.markdown("#### Future tariff rules")
        st.write(
            "The real version can add TLN diesel index, zone pricing, minimum day amount, route difficulty, customer-specific agreements and manual corrections with approval."
        )

    with tab4:
        st.subheader("Weekly payout / self-billing overview")
        invoice = (
            routes.groupby("charter")
            .agg(
                routes=("route_id", "count"),
                stops=("stops", "sum"),
                packages=("packages", "sum"),
                km=("km", "sum"),
                total_ex_vat=("total_ex_vat", "sum"),
                vat_21=("vat_21", "sum"),
                total_inc_vat=("total_inc_vat", "sum"),
            )
            .reset_index()
        )
        st.dataframe(invoice, use_container_width=True, hide_index=True)

        selected_charter = st.selectbox("Select charter for approval", invoice["charter"])
        selected_invoice = invoice[invoice["charter"] == selected_charter].iloc[0]

        c1, c2, c3 = st.columns(3)
        c1.metric("Routes", int(selected_invoice["routes"]))
        c2.metric("Stops", int(selected_invoice["stops"]))
        c3.metric("Total incl. VAT", f"€{selected_invoice['total_inc_vat']:,.2f}")

        col_ok, col_dispute = st.columns(2)
        with col_ok:
            if st.button("Approve weekly payout"):
                st.success("Demo: payout approved. Real version creates PDF/self-billing statement.")
        with col_dispute:
            if st.button("Open dispute"):
                st.warning("Demo: dispute ticket opened. Real version links it to route and stop data.")

    with tab5:
        st.subheader("Issues and returns")
        st.caption("This should sync back to MendriX as delivery status/POD when the integration is ready.")
        st.dataframe(issues, use_container_width=True, hide_index=True)

    with tab6:
        st.subheader("Strategic dashboard")
        zone_summary = (
            routes.groupby("zone")
            .agg(
                routes=("route_id", "count"),
                stops=("stops", "sum"),
                km=("km", "sum"),
                payout=("total_ex_vat", "sum"),
                issues=("issues", "sum"),
            )
            .reset_index()
        )
        st.dataframe(zone_summary, use_container_width=True, hide_index=True)
        st.bar_chart(zone_summary.set_index("zone")["payout"])
        st.info(
            "Later this page can show profit per route, cost per stop, best charters, weak zones, return percentage and customer-level performance."
        )

# ------------------------------------------------------------
# Charter view
# ------------------------------------------------------------
elif role == "Charter":
    st.subheader("Charter dashboard")
    selected_charter = st.selectbox("Select your company", charters["company"])
    my_routes = routes[routes["charter"] == selected_charter]
    profile = charters[charters["company"] == selected_charter].iloc[0]

    p1, p2, p3, p4 = st.columns(4)
    p1.metric("Status", profile["status"])
    p2.metric("Rating", profile["rating"])
    p3.metric("Zone", profile["zone"])
    p4.metric("Documents", profile["documents"])

    if my_routes.empty:
        st.warning("No routes assigned.")
    else:
        col1, col2, col3 = st.columns(3)
        col1.metric("Assigned routes", len(my_routes))
        col2.metric("Total stops", int(my_routes["stops"].sum()))
        col3.metric("Payout excl. VAT", f"€{my_routes['total_ex_vat'].sum():,.2f}")

        st.subheader("My routes")
        st.dataframe(
            my_routes[
                [
                    "route_id",
                    "date",
                    "customer",
                    "zone",
                    "loading_time",
                    "stops",
                    "km",
                    "hours",
                    "status",
                    "total_ex_vat",
                ]
            ],
            use_container_width=True,
            hide_index=True,
        )

        st.subheader("My weekly payout")
        st.write(f"Total excl. VAT: **€{my_routes['total_ex_vat'].sum():,.2f}**")
        st.write(f"VAT 21%: **€{my_routes['vat_21'].sum():,.2f}**")
        st.success(f"Total incl. VAT: €{my_routes['total_inc_vat'].sum():,.2f}")

        c1, c2 = st.columns(2)
        with c1:
            if st.button("Akkoord met weekoverzicht"):
                st.success("Demo: weekoverzicht akkoord.")
        with c2:
            if st.button("Ik heb een vraag / dispute"):
                st.warning("Demo: dispute form would open here.")

# ------------------------------------------------------------
# Driver view
# ------------------------------------------------------------
elif role == "Driver":
    st.subheader("Driver mobile route view")
    selected_route = st.selectbox("Select route", routes["route_id"])
    route = routes[routes["route_id"] == selected_route].iloc[0]
    route_stops = stops[stops["route_id"] == selected_route]

    col1, col2, col3 = st.columns(3)
    col1.metric("Stops", int(route["stops"]))
    col2.metric("Packages", int(route["packages"]))
    col3.metric("Loading time", route["loading_time"])

    st.write(f"**Customer:** {route['customer']}")
    st.write(f"**Vehicle needed:** {route['vehicle_needed']}")
    st.write(f"**Zone:** {route['zone']}")
    st.write(f"**Status:** {route['status']}")

    st.markdown("---")
    st.subheader("Stop list")

    if route_stops.empty:
        st.info("No stop-level demo data for this route yet. In the real version this comes from MendriX.")
    else:
        for _, stop in route_stops.iterrows():
            with st.expander(f"Stop {stop['stop_no']} - {stop['city']} - {stop['status']}", expanded=True):
                st.write(f"Address: **{stop['address']}**")
                st.write(f"Barcode/order: **{stop['barcode']}**")
                st.write(f"Packages: **{stop['packages']}**")
                st.write(f"Size: **{stop['size']}**")

                new_status = st.selectbox(
                    f"Update status for stop {stop['stop_no']}",
                    ["Delivered", "Not home", "Refused", "Damaged", "Wrong address", "Return"],
                    key=f"status_{stop['stop_no']}",
                )
                note = st.text_input(f"Note for stop {stop['stop_no']}", key=f"note_{stop['stop_no']}")
                photo = st.file_uploader(
                    f"Upload proof photo for stop {stop['stop_no']}",
                    type=["jpg", "jpeg", "png"],
                    key=f"photo_{stop['stop_no']}",
                )
                if st.button(f"Save stop {stop['stop_no']}", key=f"save_{stop['stop_no']}"):
                    st.success(
                        f"Demo: stop {stop['stop_no']} saved as {new_status}. Real version syncs status/POD to the portal and MendriX."
                    )

# ------------------------------------------------------------
# MendriX plan
# ------------------------------------------------------------
else:
    st.subheader("MendriX connection plan")
    st.write(
        "The portal should not replace MendriX first. MendriX remains the TMS backbone. This portal becomes the Cargro-specific layer for charters, tariffs, payouts, compliance and performance."
    )

    plan = pd.DataFrame(
        [
            {
                "Phase": "1. Import",
                "Data": "Routes, stops, customers, delivery addresses",
                "Purpose": "Show MendriX routes inside the charterportaal",
            },
            {
                "Phase": "2. Enrich",
                "Data": "Charter assignment, tariff, zone, vehicle, payout rules",
                "Purpose": "Add Cargro-specific business logic",
            },
            {
                "Phase": "3. Driver update",
                "Data": "POD, status, return reason, photos, notes",
                "Purpose": "Drivers update the portal through mobile view",
            },
            {
                "Phase": "4. Sync back",
                "Data": "Delivery status, POD, issue data",
                "Purpose": "Send important updates back to MendriX",
            },
            {
                "Phase": "5. Finance",
                "Data": "Weekly payout, disputes, corrections, invoice status",
                "Purpose": "Create transparent self-billing overview for charters",
            },
        ]
    )
    st.dataframe(plan, use_container_width=True, hide_index=True)

    st.markdown("### Difference from MendriX")
    st.write(
        "MendriX handles transport orders and execution. The charterportaal handles the external charter network: onboarding, documents, zones, tariff logic, disputes, weekly statements and performance."
    )
