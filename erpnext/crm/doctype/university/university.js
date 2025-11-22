// Copyright (c) 2025, Unideft and contributors
// For license information, please see license.txt

frappe.ui.form.on("University", {
	refresh(frm) {
		// Filter courses in child table to show only courses for this university
		if (frm.doc.name) {
			frm.set_query("course", "courses", function() {
				return {
					filters: {
						university: frm.doc.name
					}
				};
			});
			
			// Auto-sync courses from Course DocType
			frappe.call({
				method: "erpnext.crm.doctype.university.university.sync_courses",
				args: {
					university: frm.doc.name
				},
				callback: function(r) {
					if (r.message && r.message.length > 0) {
						// Clear existing courses
						frm.clear_table("courses");
						
						// Add all courses for this university
						r.message.forEach(function(course) {
							let row = frm.add_child("courses");
							row.course = course.name;
						});
						
						frm.refresh_field("courses");
					}
				}
			});
		}
	}
});
