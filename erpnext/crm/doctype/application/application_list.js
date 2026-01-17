// Copyright (c) 2025, Unideft and contributors
// For license information, please see license.txt

frappe.listview_settings['Application'] = {
	add_fields: ["application_type"],
	onload: function (listview) {
		listview.page.add_inner_button(__("Card View"), function () {
			window.location.href = "/applications_view";
		});
	}
};

