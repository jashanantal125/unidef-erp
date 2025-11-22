// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.listview_settings['Agent'] = {
	add_fields: ["agent_type"],
	
	onload: function(listview) {
		// Add quick filter buttons for B2B and B2C
		const filter_area = listview.filter_area;
		
		// Create filter buttons container
		const filter_buttons = $(`
			<div class="agent-type-filters" style="margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
				<button class="btn btn-sm filter-btn" data-filter="all" style="margin-right: 5px;">
					All Agents
				</button>
				<button class="btn btn-sm btn-primary filter-btn" data-filter="B2B" style="margin-right: 5px;">
					B2B
				</button>
				<button class="btn btn-sm btn-success filter-btn" data-filter="B2C">
					B2C
				</button>
			</div>
		`);
		
		// Insert filter buttons before the list
		filter_buttons.insertBefore(listview.$result);
		
		// Handle filter button clicks
		filter_buttons.on('click', '.filter-btn', function() {
			const filter_type = $(this).data('filter');
			
			// Update button states
			filter_buttons.find('.filter-btn').removeClass('btn-primary btn-success').addClass('btn-default');
			$(this).removeClass('btn-default');
			
			if (filter_type === 'B2B') {
				$(this).addClass('btn-primary');
			} else if (filter_type === 'B2C') {
				$(this).addClass('btn-success');
			}
			
			// Apply filter
			if (filter_type === 'all') {
				listview.filter_area.clear();
			} else {
				listview.filter_area.add([[listview.doctype, 'agent_type', '=', filter_type]]);
			}
			
			listview.refresh();
		});
		
		// Set initial active button based on current filters
		const current_filters = listview.filter_area.get();
		const has_agent_type_filter = current_filters.some(f => f[0] === 'Agent' && f[1] === 'agent_type');
		
		if (has_agent_type_filter) {
			const agent_type_value = current_filters.find(f => f[0] === 'Agent' && f[1] === 'agent_type')[2];
			if (agent_type_value === 'B2B') {
				filter_buttons.find('[data-filter="B2B"]').removeClass('btn-default').addClass('btn-primary');
			} else if (agent_type_value === 'B2C') {
				filter_buttons.find('[data-filter="B2C"]').removeClass('btn-default').addClass('btn-success');
			}
		} else {
			filter_buttons.find('[data-filter="all"]').removeClass('btn-default').addClass('btn-primary');
		}
	}
};

