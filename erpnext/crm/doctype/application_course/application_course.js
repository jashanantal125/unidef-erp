// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Application Course", {
	university(frm) {
		// When university is selected, you can filter/autocomplete course names
		// This helps link to University Course
		if (frm.doc.university) {
			// You can add autocomplete logic here to suggest courses from the selected university
		}
	}
});

