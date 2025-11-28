frappe.listview_settings["Lead"] = {
	get_indicator: function (doc) {
		var indicator = [__(doc.status), frappe.utils.guess_colour(doc.status), "status,=," + doc.status];
		return indicator;
	},
	// Ensure no default filters are applied - show all leads by default
	filters: [],
	onload: function (listview) {
		// Clear any saved user filters to show all leads by default
		// Clear user settings for filters to prevent saved filters from being applied
		if (listview.user_settings && listview.user_settings.List && listview.user_settings.List.filters) {
			listview.user_settings.List.filters = [];
			frappe.model.user_settings.save(listview.doctype, listview.user_settings);
		}
		
		// Ensure filters array is empty
		listview.filters = [];
		
		// Clear filter area after it's initialized
		setTimeout(() => {
			if (listview.filter_area) {
				// Clear all filters from filter area
				listview.filter_area.clear(false).then(() => {
					// Ensure filters remain empty
					listview.filters = [];
					// Refresh to show all leads
					listview.refresh();
				});
			} else {
				// If filter_area not ready, refresh anyway to ensure no filters
				listview.filters = [];
				listview.refresh();
			}
		}, 200);
		
		if (frappe.boot.user.can_create.includes("Prospect")) {
			listview.page.add_action_item(__("Create Prospect"), function () {
				frappe.model.with_doctype("Prospect", function () {
					let prospect = frappe.model.get_new_doc("Prospect");
					let leads = listview.get_checked_items();
					frappe.db.get_value(
						"Lead",
						leads[0].name,
						[
							"company_name",
							"no_of_employees",
							"industry",
							"market_segment",
							"territory",
							"fax",
							"website",
							"lead_owner",
						],
						(r) => {
							prospect.company_name = r.company_name;
							prospect.no_of_employees = r.no_of_employees;
							prospect.industry = r.industry;
							prospect.market_segment = r.market_segment;
							prospect.territory = r.territory;
							prospect.fax = r.fax;
							prospect.website = r.website;
							prospect.prospect_owner = r.lead_owner;

							leads.forEach(function (lead) {
								let lead_prospect_row = frappe.model.add_child(prospect, "leads");
								lead_prospect_row.lead = lead.name;
							});
							frappe.set_route("Form", "Prospect", prospect.name);
						}
					);
				});
			});
		}
	},
};
