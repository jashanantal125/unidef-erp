// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Agent", {
	agent_type(frm) {
		// Refresh form to show/hide fields based on agent type
		frm.refresh();
		
		// Add visual indicator
		if (frm.doc.agent_type) {
			const badge_color = frm.doc.agent_type === 'B2B' ? 'blue' : 'green';
			frm.dashboard.add_indicator(__('Agent Type: {0}', [frm.doc.agent_type]), badge_color);
		}
	},
	
	refresh(frm) {
		// Add visual distinction based on agent type
		if (frm.doc.agent_type) {
			const badge_color = frm.doc.agent_type === 'B2B' ? 'blue' : 'green';
			frm.dashboard.add_indicator(__('Agent Type: {0}', [frm.doc.agent_type]), badge_color);
		}
		
		// Add custom button to filter by type in list view
		if (!frm.is_new()) {
			frm.add_custom_button(__('View All {0} Agents', [frm.doc.agent_type]), function() {
				frappe.set_route('List', 'Agent', {
					agent_type: frm.doc.agent_type
				});
			});
		}
	}
});

