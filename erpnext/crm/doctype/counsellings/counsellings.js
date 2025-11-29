// Copyright (c) 2025, Unideft and contributors
// For license information, please see license.txt

frappe.ui.form.on('Counsellings', {
	refresh: function(frm) {
		// Clear destination_manager when assign_to changes
		if (frm.doc.assign_to !== 'Destination Manager') {
			frm.set_value('destination_manager', '');
		}
		
		// Clear meeting_link when meeting_type changes
		if (frm.doc.meeting_type !== 'Virtual') {
			frm.set_value('meeting_link', '');
		}
	},
	
	meeting_link: function(frm) {
		// Validate meeting link starts with http:// or https://
		if (frm.doc.meeting_link) {
			const link = frm.doc.meeting_link.trim();
			if (!link.startsWith('http://') && !link.startsWith('https://')) {
				frappe.msgprint({
					title: __('Invalid Link'),
					message: __('Meeting link must start with http:// or https://'),
					indicator: 'red'
				});
				frm.set_value('meeting_link', '');
			}
		}
	},
	
	validate: function(frm) {
		// Validate meeting link on save
		if (frm.doc.meeting_type === 'Virtual' && frm.doc.meeting_link) {
			const link = frm.doc.meeting_link.trim();
			if (!link.startsWith('http://') && !link.startsWith('https://')) {
				frappe.throw(__('Meeting link must start with http:// or https://'));
			}
		}
		
		// Validate destination_manager is selected when assign_to is Destination Manager
		if (frm.doc.assign_to === 'Destination Manager' && !frm.doc.destination_manager) {
			frappe.throw(__('Please select a Destination Manager'));
		}
	}
});
