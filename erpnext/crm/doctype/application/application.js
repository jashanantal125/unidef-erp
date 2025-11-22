// Copyright (c) 2025, Unideft and contributors
// For license information, please see license.txt

frappe.ui.form.on("Application", {
	refresh(frm) {
		// Show/hide agent field based on application type
		if (frm.doc.application_type === "B2B" || frm.doc.application_type === "B2C") {
			frm.set_df_property("agent", "hidden", 0);
			
			// For B2C: Auto-set to Unideft and make read-only
			if (frm.doc.application_type === "B2C") {
				// Find Unideft agent
				frappe.db.get_value("Agent", {"company_name": "Unideft"}, "name", (r) => {
					if (r && r.name) {
						if (!frm.doc.agent || frm.doc.agent !== r.name) {
							frm.set_value("agent", r.name);
						}
						frm.set_df_property("agent", "read_only", 1);
					} else {
						frappe.msgprint("Unideft agent not found. Please create it first.");
					}
				});
			} else if (frm.doc.application_type === "B2B") {
				// For B2B: Allow selection from ALL agents (no filter)
				frm.set_df_property("agent", "read_only", 0);
				// Remove any query filter to show all agents
				frm.set_query("agent", function() {
					return {}; // No filters - show all agents
				});
			}
		} else {
			frm.set_df_property("agent", "hidden", 1);
			frm.set_value("agent", "");
		}
		
		// Filter courses based on selected university
		if (frm.doc.preferred_university) {
			frm.set_query("course", "preferred_courses", function() {
				return {
					filters: {
						university: frm.doc.preferred_university
					}
				};
			});
		}
	},
	
	application_type(frm) {
		// Show/hide agent field when application type changes
		if (frm.doc.application_type === "B2B" || frm.doc.application_type === "B2C") {
			frm.set_df_property("agent", "hidden", 0);
			
			// For B2C: Auto-set to Unideft and make read-only
			if (frm.doc.application_type === "B2C") {
				// Find Unideft agent and set it
				frappe.db.get_value("Agent", {"company_name": "Unideft"}, "name", (r) => {
					if (r && r.name) {
						frm.set_value("agent", r.name);
						frm.set_df_property("agent", "read_only", 1);
					} else {
						frappe.msgprint("Unideft agent not found. Please create it first.");
					}
				});
			} else if (frm.doc.application_type === "B2B") {
				// For B2B: Allow selection from ALL agents, clear if was Unideft
				frm.set_df_property("agent", "read_only", 0);
				if (frm.doc.agent) {
					frappe.db.get_value("Agent", frm.doc.agent, "company_name", (r) => {
						if (r && r.company_name === "Unideft") {
							frm.set_value("agent", "");
						}
					});
				}
				// Remove any query filter to show all agents
				frm.set_query("agent", function() {
					return {}; // No filters - show all agents
				});
			}
		} else {
			frm.set_df_property("agent", "hidden", 1);
			frm.set_value("agent", "");
		}
	},
	
	preferred_university(frm) {
		// Clear courses when university changes
		if (frm.doc.preferred_courses) {
			frm.clear_table("preferred_courses");
			frm.refresh_field("preferred_courses");
		}
		
		// Set filter for courses based on selected university
		if (frm.doc.preferred_university) {
			frm.set_query("course", "preferred_courses", function() {
				return {
					filters: {
						university: frm.doc.preferred_university
					}
				};
			});
		}
	},
	
	preferred_courses(frm) {
		// Validate maximum 3 courses on client side
		if (frm.doc.preferred_courses && frm.doc.preferred_courses.length > 3) {
			frappe.msgprint("You can select a maximum of 3 courses only.");
			// Remove the extra course
			frm.doc.preferred_courses.pop();
			frm.refresh_field("preferred_courses");
		}
	}
});
