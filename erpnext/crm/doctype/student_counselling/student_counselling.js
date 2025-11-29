// Copyright (c) 2025, Unideft and contributors
// For license information, please see license.txt

frappe.ui.form.on('Student Counselling', {
	refresh: function(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		
		// Get parent form from the grid
		let parent_frm = null;
		try {
			// When in form view of child table, get parent from grid
			if (frm.grid_form && frm.grid_form.frm) {
				parent_frm = frm.grid_form.frm;
			} else if (row && row.parenttype === 'Student') {
				// Try to find the Student form that's open
				let student_forms = Object.values(frappe.ui.form.opened_forms || {}).filter(
					form => form.doctype === 'Student'
				);
				if (student_forms.length > 0) {
					parent_frm = student_forms[0];
				}
			}
		} catch(e) {
			// Ignore errors
		}
		
		// Auto-fill student_name from parent
		if (parent_frm && parent_frm.doc) {
			// For existing students
			if (parent_frm.doc.name) {
				frappe.model.set_value(cdt, cdn, 'student_name', parent_frm.doc.name);
			}
			// For new students, it will be set after save via server-side code
		}
	},
	
	student_name: function(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		
		// Get parent form
		let parent_frm = null;
		try {
			if (frm.grid_form && frm.grid_form.frm) {
				parent_frm = frm.grid_form.frm;
			} else if (row && row.parenttype === 'Student') {
				let student_forms = Object.values(frappe.ui.form.opened_forms || {}).filter(
					form => form.doctype === 'Student'
				);
				if (student_forms.length > 0) {
					parent_frm = student_forms[0];
				}
			}
		} catch(e) {
			// Ignore errors
		}
		
		// Ensure it's always set to parent student if parent exists
		if (parent_frm && parent_frm.doc && parent_frm.doc.name && row.student_name !== parent_frm.doc.name) {
			frappe.model.set_value(cdt, cdn, 'student_name', parent_frm.doc.name);
		}
	},
	
	meeting_link: function(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		// Validate meeting link starts with http:// or https://
		if (row.meeting_link) {
			const link = row.meeting_link.trim();
			if (!link.startsWith('http://') && !link.startsWith('https://')) {
				frappe.msgprint({
					title: __('Invalid Link'),
					message: __('Meeting link must start with http:// or https://'),
					indicator: 'red'
				});
				frappe.model.set_value(cdt, cdn, 'meeting_link', '');
			}
		}
	},
	
	assign_to: function(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		// Clear destination_manager if not Destination Manager
		if (row.assign_to !== 'Destination Manager') {
			frappe.model.set_value(cdt, cdn, 'destination_manager', '');
		}
		// Refresh the grid to show/hide fields based on depends_on
		frm.fields_dict.counsellings.grid.refresh();
	},
	
	meeting_type: function(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		// Clear meeting_link if not Virtual
		if (row.meeting_type !== 'Virtual') {
			frappe.model.set_value(cdt, cdn, 'meeting_link', '');
		}
		// Refresh the grid to show/hide fields based on depends_on
		frm.fields_dict.counsellings.grid.refresh();
	}
});

// Handle when a new row is added to the child table
frappe.ui.form.on('Student', {
	counsellings_add: function(frm, cdt, cdn) {
		// Auto-fill student_name when new row is added
		// For existing students
		if (frm.doc.name) {
			frappe.model.set_value(cdt, cdn, 'student_name', frm.doc.name);
		}
		// For new students, it will be set after save
	},
	
	refresh: function(frm) {
		// Ensure all rows have student_name set
		if (frm.doc.counsellings) {
			if (frm.doc.name) {
				// Existing student - set name directly
				frm.doc.counsellings.forEach(function(row) {
					if (row.student_name !== frm.doc.name) {
						frappe.model.set_value(row.doctype, row.name, 'student_name', frm.doc.name);
					}
				});
			} else if (frm.doc.first_name) {
				// New student - we'll handle this after save
				// For now, just ensure the field exists
			}
		}
	},
	
	after_save: function(frm) {
		// After student is saved, update all counselling rows with the student name
		if (frm.doc.counsellings && frm.doc.name) {
			frm.doc.counsellings.forEach(function(row) {
				if (!row.student_name || row.student_name !== frm.doc.name) {
					frappe.model.set_value(row.doctype, row.name, 'student_name', frm.doc.name);
				}
			});
		}
	}
});

