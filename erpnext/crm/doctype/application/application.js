// Copyright (c) 2025, Unideft and contributors
// For license information, please see license.txt

frappe.ui.form.on("Application", {
	onload: function(frm) {
		// Wait for form to be fully rendered
		$(frm.wrapper).one('render_complete', function() {
			setTimeout(() => {
				setup_wizard_mode(frm);
			}, 300);
		});
	},

	refresh(frm) {
		// Initialize wizard if not done yet - wait for render complete
		$(frm.wrapper).one('render_complete', function() {
			setTimeout(() => {
				if (!frm.wizard_setup_done) {
					setup_wizard_mode(frm);
				}
				// Update wizard controls
				if (frm.wizard_setup_done && frm.wizard) {
					update_wizard_controls(frm);
				}
			}, 300);
		});

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

// ==================== Multi-Step Wizard Functions ====================

function setup_wizard_mode(frm) {
	// Debug logging
	console.log("Wizard: setup_wizard_mode called");
	
	// Method 1: Try to get tabs from layout
	let tabs_from_layout = [];
	if (frm.layout && frm.layout.tabs && frm.layout.tabs.length > 0) {
		tabs_from_layout = frm.layout.tabs;
		console.log("Wizard: Found tabs from layout:", tabs_from_layout.length);
	}
	
	// Method 2: Get tabs from DOM (more reliable)
	const tab_links = frm.wrapper.find('.form-tabs .nav-link');
	const tab_panes = frm.wrapper.find('.tab-content .tab-pane');
	
	console.log("Wizard: Tab links in DOM:", tab_links.length);
	console.log("Wizard: Tab panes in DOM:", tab_panes.length);
	
	// If no tabs found, wait a bit more
	if (tab_links.length === 0 && tabs_from_layout.length === 0) {
		console.log("Wizard: No tabs found, retrying...");
		setTimeout(() => setup_wizard_mode(frm), 500);
		return;
	}
	
	// Use layout tabs if available, otherwise build from DOM
	let all_tabs = [];
	
	if (tabs_from_layout.length > 0) {
		// Use layout tabs
		all_tabs = tabs_from_layout.filter(tab => {
			const is_hidden = tab.hidden || (typeof tab.is_hidden === 'function' && tab.is_hidden());
			return !is_hidden;
		});
	} else {
		// Build tabs from DOM
		tab_links.each(function(index) {
			const $link = $(this);
			const tab_id = $link.attr('href') || $link.attr('data-fieldname') || '';
			const $pane = tab_panes.eq(index);
			
			if ($link.is(':visible') && $pane.length) {
				all_tabs.push({
					tab_link: $link.parent(),
					wrapper: $pane,
					df: {
						fieldname: $link.attr('data-fieldname') || tab_id.replace('#', ''),
						label: $link.text().trim()
					},
					label: $link.text().trim(),
					set_active: function() {
						$link.tab('show');
					}
				});
			}
		});
	}
	
	console.log("Wizard: Total visible tabs:", all_tabs.length);
	
	if (all_tabs.length <= 1) {
		console.log("Wizard: Only one or no visible tabs found, wizard not needed");
		return;
	}

	frm.wizard_setup_done = true;
	console.log("Wizard: Setting up wizard with", all_tabs.length, "tabs");

	// Initialize wizard state
	frm.wizard = {
		tabs: all_tabs,
		current_step: 0,
		total_steps: all_tabs.length
	};

	// Hide all tabs initially
	frm.wizard.tabs.forEach((tab, index) => {
		console.log(`Wizard: Hiding tab ${index + 1}:`, tab.df?.fieldname || tab.label);
		if (tab.tab_link) {
			tab.tab_link.hide();
		}
		if (tab.wrapper) {
			tab.wrapper.hide();
		}
		// Also hide using jQuery selectors as backup
		if (tab.df && tab.df.fieldname) {
			$(`.nav-link[data-fieldname="${tab.df.fieldname}"]`).parent().hide();
			$(`.tab-pane[data-name="${tab.df.fieldname}"], .tab-pane[id*="${tab.df.fieldname}"]`).hide();
		}
	});

	// Show first tab
	console.log("Wizard: Showing first tab");
	show_wizard_step(frm, 0);

	// Disable tab clicking
	setTimeout(() => {
		disable_direct_tab_navigation(frm);
	}, 100);

	// Add navigation buttons
	add_wizard_navigation(frm);

	// Add progress bar
	add_wizard_progress(frm);
	
	// Add manual trigger button for testing (remove in production)
	if (frappe.boot.developer_mode) {
		frm.add_custom_button(__('Debug: Reinit Wizard'), function() {
			console.log("Wizard: Manual reinit triggered");
			frm.wizard_setup_done = false;
			setup_wizard_mode(frm);
		});
	}
	
	console.log("Wizard: Setup complete!");
}

// Global function for manual testing (can be called from browser console)
window.test_wizard = function() {
	const frm = cur_frm;
	if (!frm) {
		console.error("No form found. Please open an Application form first.");
		return;
	}
	console.log("Wizard: Manual test triggered");
	frm.wizard_setup_done = false;
	setup_wizard_mode(frm);
};

function show_wizard_step(frm, step_index) {
	if (!frm.wizard || step_index < 0 || step_index >= frm.wizard.tabs.length) {
		console.log("Wizard: Invalid step index:", step_index);
		return;
	}

	// Hide current tab
	const current_tab = frm.wizard.tabs[frm.wizard.current_step];
	if (current_tab) {
		if (current_tab.wrapper && current_tab.wrapper.length) {
			current_tab.wrapper.hide().removeClass('show active');
		}
		if (current_tab.tab_link && current_tab.tab_link.length) {
			current_tab.tab_link.find('.nav-link').removeClass('active');
		}
		// Also hide using jQuery selectors
		if (current_tab.df && current_tab.df.fieldname) {
			frm.wrapper.find(`.tab-pane[data-name="${current_tab.df.fieldname}"], .tab-pane[id*="${current_tab.df.fieldname}"]`).hide().removeClass('show active');
		}
	}

	// Show new tab
	frm.wizard.current_step = step_index;
	const tab = frm.wizard.tabs[step_index];
	
	console.log("Wizard: Showing step", step_index + 1, "Tab:", tab.df?.fieldname || tab.label);
	
	if (tab.wrapper && tab.wrapper.length) {
		tab.wrapper.show().addClass('show active');
	}
	// Also show using jQuery selectors
	if (tab.df && tab.df.fieldname) {
		frm.wrapper.find(`.tab-pane[data-name="${tab.df.fieldname}"], .tab-pane[id*="${tab.df.fieldname}"]`).show().addClass('show active');
	}
	
	// Activate tab link
	if (tab.tab_link && tab.tab_link.length) {
		tab.tab_link.find('.nav-link').addClass('active').tab('show');
	}
	
	// Use set_active if available
	if (typeof tab.set_active === 'function') {
		tab.set_active();
	}
	
	update_wizard_controls(frm);
	
	// Scroll to top
	setTimeout(() => {
		$('.form-page, .form-layout').scrollTop(0);
		window.scrollTo(0, 0);
	}, 100);
}

function disable_direct_tab_navigation(frm) {
	// Use a more specific selector and ensure it runs after tabs are rendered
	setTimeout(() => {
		// Disable all tab links
		$('.form-tabs-list .nav-link, .nav-tabs .nav-link').off('click.wizard').on('click.wizard', function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			frappe.show_alert({
				message: __('Please use Next/Previous buttons to navigate through steps'),
				indicator: 'orange'
			}, 3);
			return false;
		});
		
		// Also prevent tab switching via Bootstrap tab events
		$('.form-tabs-list, .nav-tabs').off('shown.bs.tab.wizard').on('shown.bs.tab.wizard', function(e) {
			if (!frm.wizard || !frm.wizard_setup_done) return;
			// Find which tab was clicked
			const clicked_tab = $(e.target).closest('.nav-link');
			const tab_fieldname = clicked_tab.attr('data-fieldname') || clicked_tab.attr('href')?.replace('#', '');
			
			// Check if this is the current wizard step
			const current_tab = frm.wizard.tabs[frm.wizard.current_step];
			if (current_tab && current_tab.df && current_tab.df.fieldname !== tab_fieldname) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// Restore to current wizard step
				show_wizard_step(frm, frm.wizard.current_step);
			}
		});
		
		console.log("Wizard: Tab navigation disabled");
	}, 500);
}

function add_wizard_navigation(frm) {
	// Remove existing navigation if any
	$('.wizard-nav-container').remove();

	if (!frm.wizard) return;

	const nav_html = $(`
		<div class="wizard-nav-container" style="
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15px 20px;
			background: var(--bg-color);
			border-top: 1px solid var(--border-color);
			margin-top: 20px;
		">
			<button class="btn btn-secondary wizard-prev-btn" type="button">
				<i class="fa fa-arrow-left"></i> ${__('Previous')}
			</button>
			<div class="wizard-step-info" style="font-weight: 500; color: var(--text-color);">
				Step <span class="current-step">1</span> of <span class="total-steps">${frm.wizard.total_steps}</span>
			</div>
			<div>
				<button class="btn btn-primary wizard-next-btn" type="button">
					${__('Next')} <i class="fa fa-arrow-right"></i>
				</button>
				<button class="btn btn-primary wizard-save-btn" type="button" style="display: none;">
					<i class="fa fa-save"></i> ${__('Save')}
				</button>
			</div>
		</div>
	`);

	// Insert before form footer
	const form_footer = frm.page.wrapper.find('.form-footer');
	if (form_footer.length) {
		form_footer.before(nav_html);
	} else {
		frm.page.wrapper.append(nav_html);
	}

	// Bind events
	nav_html.find('.wizard-prev-btn').on('click', () => {
		if (frm.wizard && frm.wizard.current_step > 0) {
			show_wizard_step(frm, frm.wizard.current_step - 1);
		}
	});

	nav_html.find('.wizard-next-btn').on('click', () => {
		if (validate_current_step(frm)) {
			if (frm.wizard && frm.wizard.current_step < frm.wizard.total_steps - 1) {
				show_wizard_step(frm, frm.wizard.current_step + 1);
			}
		}
	});

	nav_html.find('.wizard-save-btn').on('click', () => {
		frm.save().then(() => {
			frappe.show_alert({
				message: __('Document saved successfully'),
				indicator: 'green'
			}, 3);
		});
	});
}

function add_wizard_progress(frm) {
	$('.wizard-progress-container').remove();

	if (!frm.wizard) return;

	const progress_html = $(`
		<div class="wizard-progress-container" style="
			padding: 15px 20px;
			background: var(--bg-color);
			border-bottom: 1px solid var(--border-color);
			position: relative;
			z-index: 10;
		">
			<div class="wizard-progress-bar" style="
				height: 8px;
				background: var(--border-color);
				border-radius: 4px;
				overflow: hidden;
				position: relative;
			">
				<div class="wizard-progress-fill" style="
					height: 100%;
					background: linear-gradient(90deg, var(--primary), var(--primary-dark, var(--primary)));
					transition: width 0.4s ease;
					width: ${((frm.wizard.current_step + 1) / frm.wizard.total_steps) * 100}%;
					border-radius: 4px;
				"></div>
			</div>
		</div>
	`);

	// Try multiple insertion points
	const form_header = frm.page.wrapper.find('.form-header');
	const page_head = frm.page.wrapper.find('.page-head');
	const form_layout = frm.page.wrapper.find('.form-layout');
	
	if (form_header.length) {
		form_header.after(progress_html);
	} else if (page_head.length) {
		page_head.after(progress_html);
	} else if (form_layout.length) {
		form_layout.prepend(progress_html);
	} else {
		frm.page.wrapper.prepend(progress_html);
	}
	
	console.log("Wizard: Progress bar added");
}

function update_wizard_controls(frm) {
	if (!frm.wizard) return;

	const current = frm.wizard.current_step;
	const total = frm.wizard.total_steps;

	// Update step info
	$('.current-step').text(current + 1);
	$('.total-steps').text(total);

	// Update progress bar
	const percentage = ((current + 1) / total) * 100;
	$('.wizard-progress-fill').css('width', percentage + '%');

	// Update buttons
	const prev_btn = $('.wizard-prev-btn');
	const next_btn = $('.wizard-next-btn');
	const save_btn = $('.wizard-save-btn');

	if (current === 0) {
		prev_btn.prop('disabled', true).addClass('disabled');
	} else {
		prev_btn.prop('disabled', false).removeClass('disabled');
	}

	if (current === total - 1) {
		next_btn.hide();
		save_btn.show();
	} else {
		next_btn.show();
		save_btn.hide();
	}
}

function validate_current_step(frm) {
	if (!frm.wizard) return true;

	const current_tab = frm.wizard.tabs[frm.wizard.current_step];
	if (!current_tab) return true;

	// Get all fields in current tab
	const tab_fieldname = current_tab.df.fieldname;
	let fields_in_tab = [];
	let current_tab_found = false;

	// Find fields belonging to current tab
	frm.layout.fields.forEach(field => {
		if (field.fieldtype === 'Tab Break') {
			if (field.fieldname === tab_fieldname) {
				current_tab_found = true;
			} else {
				current_tab_found = false;
			}
		} else if (current_tab_found && field.fieldtype !== 'Section Break' && field.fieldtype !== 'Column Break') {
			fields_in_tab.push(field);
		}
	});

	// Validate required fields
	let missing_fields = [];
	fields_in_tab.forEach(field => {
		if (field.reqd && !frm.doc[field.fieldname]) {
			missing_fields.push(field.label || field.fieldname);
		}
	});

	if (missing_fields.length > 0) {
		frappe.msgprint({
			title: __('Required Fields Missing'),
			message: __('Please fill the following required fields:') + '<br><br>' + 
				missing_fields.map(f => `• ${f}`).join('<br>'),
			indicator: 'orange'
		});
		return false;
	}

	return true;
}
