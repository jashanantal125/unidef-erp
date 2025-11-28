// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.provide("erpnext.projects");

frappe.ui.form.on("Task", {
	setup: function (frm) {
		frm.make_methods = {
			Timesheet: () =>
				frappe.model.open_mapped_doc({
					method: "erpnext.projects.doctype.task.task.make_timesheet",
					frm: frm,
				}),
		};
	},
	onload: function (frm) {
		frm.set_query("task", "depends_on", function () {
			let filters = {
				name: ["!=", frm.doc.name],
			};
			if (frm.doc.project) filters["project"] = frm.doc.project;
			return {
				filters: filters,
			};
		});

		frm.set_query("parent_task", function () {
			let filters = {
				is_group: 1,
				name: ["!=", frm.doc.name],
			};
			if (frm.doc.project) filters["project"] = frm.doc.project;
			return {
				filters: filters,
			};
		});

		// Hide Connections tab for non-Administrator users
		hide_connections_tab(frm);
	},

	refresh: function (frm) {
		// Hide Connections tab for non-Administrator users
		hide_connections_tab(frm);
	},

	is_group: function (frm) {
		frappe.call({
			method: "erpnext.projects.doctype.task.task.check_if_child_exists",
			args: {
				name: frm.doc.name,
			},
			callback: function (r) {
				if (r.message.length > 0) {
					let message = __(
						"Cannot convert Task to non-group because the following child Tasks exist: {0}.",
						[r.message.join(", ")]
					);
					frappe.msgprint(message);
					frm.reload_doc();
				}
			},
		});
	},

	validate: function (frm) {
		frm.doc.project && frappe.model.remove_from_locals("Project", frm.doc.project);
	},
});

// Function to hide Connections tab for non-Administrator users
function hide_connections_tab(frm) {
	// Check if user has Administrator role
	const user_roles = frappe.get_roles();
	const is_administrator = user_roles.includes("Administrator");

	// Hide Connections tab if user is not Administrator
	if (!is_administrator) {
		// Find and hide the Connections tab using layout tabs
		if (frm.layout && frm.layout.tabs) {
			const connections_tab = frm.layout.tabs.find(tab => tab.df && tab.df.fieldname === "connections_tab");
			if (connections_tab) {
				connections_tab.toggle(false);
			}
		}
		
		// Also hide using DOM selectors as fallback
		setTimeout(() => {
			if (frm.wrapper) {
				frm.wrapper.find('.nav-link[data-name="connections_tab"]').parent().hide();
				frm.wrapper.find('.tab-content[data-name="connections_tab"]').hide();
				frm.wrapper.find('.form-tabs .nav-item a:contains("Connections")').parent().hide();
			}
		}, 100);
	} else {
		// Show Connections tab for Administrator
		if (frm.layout && frm.layout.tabs) {
			const connections_tab = frm.layout.tabs.find(tab => tab.df && tab.df.fieldname === "connections_tab");
			if (connections_tab) {
				connections_tab.toggle(true);
			}
		}
		
		setTimeout(() => {
			if (frm.wrapper) {
				frm.wrapper.find('.nav-link[data-name="connections_tab"]').parent().show();
				frm.wrapper.find('.form-tabs .nav-item a:contains("Connections")').parent().show();
			}
		}, 100);
	}
}
