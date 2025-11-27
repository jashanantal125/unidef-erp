// Copyright (c) 2025, Unideft and contributors
// Add Unideft logo to CRM workspace heading

(function() {
	'use strict';

	console.log('🎨 CRM Logo Header script loaded!');

	function addLogoToCRMHeading() {
		const path = window.location.pathname;
		const route = frappe.get_route_str ? frappe.get_route_str() : '';
		const isCRMRoute = path.includes('/crm') || path.includes('/CRM') || route.includes('CRM') || route.includes('crm');

		if (!isCRMRoute) {
			return;
		}

		// Wait for jQuery and workspace to load
		if (typeof $ === 'undefined') {
			setTimeout(addLogoToCRMHeading, 100);
			return;
		}

		// Try multiple selectors for workspace title
		const $workspaceTitle = $('.workspace-title, .title-text, h3.title-text');
		
		if ($workspaceTitle.length) {
			$workspaceTitle.each(function() {
				const $title = $(this);
				const titleText = $title.text().trim();
				
				// Check if title is "CRM" and logo not already added
				if ((titleText === 'CRM' || titleText.includes('CRM')) && !$title.find('.crm-logo').length && !$title.find('img').length) {
					console.log('✅ Adding logo to CRM heading');
					
					// Use the horizontal logo (the new one with "Empowering Dreams Worldwide" tagline)
					const logoPath = '/assets/erpnext/images/Unideft-Horizontal-Logo-Colored-Orange-Black-Transparent.png';
					const logoHtml = `<img src="${logoPath}?v=${Date.now()}" alt="Unideft" class="crm-logo" style="height: 45px; width: auto; margin-right: 16px; vertical-align: middle; display: inline-block; max-width: 280px; object-fit: contain;">`;
					
					// Preserve existing content
					const existingHtml = $title.html();
					$title.html(logoHtml + '<span style="display: inline-block; vertical-align: middle;">' + titleText + '</span>');
					
					// Add error handler for image - try hrms path as fallback
					$title.find('.crm-logo').on('error', function() {
						console.error('Logo failed to load from:', logoPath);
						console.log('Trying alternative path from hrms...');
						$(this).attr('src', '/assets/hrms/images/Unideft-Horizontal-Logo-Colored-Orange-Black-Transparent.png?v=' + Date.now());
					});
					
					// Log success
					$title.find('.crm-logo').on('load', function() {
						console.log('✅ Logo loaded successfully!');
					});
				}
			});
		} else {
			// If title not found, try again
			setTimeout(addLogoToCRMHeading, 500);
		}
	}

	// Wait for jQuery and Frappe
	function init() {
		if (typeof $ === 'undefined' || typeof frappe === 'undefined') {
			setTimeout(init, 100);
			return;
		}

		// Run when DOM is ready
		$(document).ready(function() {
			setTimeout(addLogoToCRMHeading, 1500);
		});

		// Also run on route changes
		$(document).on('page-change', function() {
			setTimeout(addLogoToCRMHeading, 1000);
		});

		// Run when workspace is loaded
		$(document).on('workspace-loaded', function() {
			setTimeout(addLogoToCRMHeading, 1000);
		});

		// Keep trying for a bit
		let attempts = 0;
		const interval = setInterval(function() {
			if (attempts < 10) {
				addLogoToCRMHeading();
				attempts++;
			} else {
				clearInterval(interval);
			}
		}, 1000);
	}

	// Start initialization
	init();
})();

