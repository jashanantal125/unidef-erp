// Copyright (c) 2025, Unideft and contributors
// World Map Visualization for Applications by Destination Country
// Version: 2.0 - Using amCharts (Updated: 2025-11-26)

(function() {
	'use strict';

	function injectMapContainer() {
		if (document.getElementById('applications-world-map-container')) return;

		const workspacePage = $('[data-page-route*="Applications"], [data-page-route*="applications"]');
		if (workspacePage.length === 0) return;

		const mainSection = workspacePage.find('.layout-main-section, .workspace-content');
		if (mainSection.length === 0) return;

		const firstHeader = mainSection.find('.workspace-block-header, h3, h4').first();
		
		const mapContainer = $(`
			<div style="margin: 20px 0;">
				<h4 style="margin-bottom: 15px;"><b>Applications by Destination Country (World Map)</b></h4>
				<div id="applications-world-map-container" style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa;"></div>
			</div>
		`);

		if (firstHeader.length) {
			mapContainer.insertAfter(firstHeader);
		} else {
			mapContainer.prependTo(mainSection.find('.workspace-content, .layout-main-section').first());
		}
	}

	function renderWorldMap() {
		let container = document.getElementById('applications-world-map-container');
		if (!container) {
			injectMapContainer();
			container = document.getElementById('applications-world-map-container');
		}
		if (!container) return;

		container.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">Loading world map...</div>';

		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Application',
				fields: ['destination_country', 'name'],
				limit_page_length: 0
			},
			callback: function(r) {
				if (!r.message || r.message.length === 0) {
					container.innerHTML = '<div style="text-align: center; padding: 50px; color: #999;">No applications found</div>';
					return;
				}

				const country_counts = {};
				r.message.forEach(app => {
					if (app.destination_country) {
						country_counts[app.destination_country] = (country_counts[app.destination_country] || 0) + 1;
					}
				});

				const countries = Object.keys(country_counts);
				if (countries.length === 0) {
					container.innerHTML = '<div style="text-align: center; padding: 50px; color: #999;">No applications with destination countries</div>';
					return;
				}

				frappe.call({
					method: 'frappe.client.get_list',
					args: {
						doctype: 'Country',
						fields: ['name', 'code'],
						filters: { name: ['in', countries] },
						limit_page_length: 0
					},
					callback: function(country_r) {
						if (!country_r.message || country_r.message.length === 0) {
							container.innerHTML = '<div style="text-align: center; padding: 50px; color: #999;">No country codes found</div>';
							return;
						}

						const map_data = {};
						country_r.message.forEach(country => {
							if (country.code) {
								map_data[country.code.toLowerCase()] = country_counts[country.name];
							}
						});

						// Use amCharts - very reliable and simple
						loadAmCharts().then(() => {
							renderAmChartsMap(container, map_data);
						}).catch(() => {
							// Fallback to a simple but visual representation
							renderVisualMap(container, map_data);
						});
					}
				});
			}
		});
	}

	function loadAmCharts() {
		return new Promise((resolve, reject) => {
			if (window.am4core && window.am4maps) {
				resolve();
				return;
			}

			// Load amCharts
			const am4Script = document.createElement('script');
			am4Script.src = 'https://cdn.amcharts.com/lib/4/core.js';
			am4Script.onload = () => {
				const am4mapsScript = document.createElement('script');
				am4mapsScript.src = 'https://cdn.amcharts.com/lib/4/maps.js';
				am4mapsScript.onload = () => {
					const am4geodataScript = document.createElement('script');
					am4geodataScript.src = 'https://cdn.amcharts.com/lib/4/geodata/worldLow.js';
					am4geodataScript.onload = resolve;
					am4geodataScript.onerror = reject;
					document.head.appendChild(am4geodataScript);
				};
				am4mapsScript.onerror = reject;
				document.head.appendChild(am4mapsScript);
			};
			am4Script.onerror = reject;
			document.head.appendChild(am4Script);
		});
	}

	function renderAmChartsMap(container, data) {
		container.innerHTML = '<div id="world-map-amcharts" style="width: 100%; height: 500px;"></div>';
		
		setTimeout(() => {
			try {
				am4core.ready(() => {
					const chart = am4core.create("world-map-amcharts", am4maps.MapChart);
					chart.geodata = am4geodata_worldLow;
					chart.projection = new am4maps.geoMercator();
					
					const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
					polygonSeries.useGeodata = true;
					
					const polygonTemplate = polygonSeries.mapPolygons.template;
					polygonTemplate.tooltipText = "{name}: {value} applications";
					polygonTemplate.fill = am4core.color("#e0e0e0");
					
					polygonSeries.data = Object.entries(data).map(([code, value]) => ({
						id: code.toUpperCase(),
						value: value
					}));
					
					polygonSeries.heatRules.push({
						property: "fill",
						target: polygonSeries.mapPolygons.template,
						min: am4core.color("#FFE5CC"),
						max: am4core.color("#FF7800")
					});
					
					console.log('✅ amCharts world map rendered');
				});
			} catch (error) {
				console.error('Error rendering amCharts map:', error);
				renderVisualMap(container, data);
			}
		}, 500);
	}

	function renderVisualMap(container, data) {
		// Create a visual world map representation using a grid/card layout
		// that shows countries geographically arranged
		const maxCount = Math.max(...Object.values(data), 1);
		
		// Group countries by region for better visualization
		const regions = {
			'North America': ['us', 'ca', 'mx'],
			'Europe': ['gb', 'de', 'fr', 'it', 'es', 'nl', 'be', 'ch', 'at', 'se', 'no', 'dk', 'fi'],
			'Asia': ['in', 'cn', 'jp', 'kr', 'sg', 'my', 'th', 'id', 'ph', 'vn'],
			'Oceania': ['au', 'nz'],
			'Middle East': ['ae', 'sa', 'il', 'tr'],
			'Africa': ['za', 'eg', 'ke', 'ng'],
			'South America': ['br', 'ar', 'cl', 'co']
		};

		let html = `
			<div style="padding: 20px;">
				<div style="text-align: center; margin-bottom: 20px;">
					<h5 style="margin: 0 0 10px 0;"><b>Applications by Destination Country</b></h5>
					<div style="color: #666; font-size: 14px;">Total: ${Object.values(data).reduce((a, b) => a + b, 0)} applications across ${Object.keys(data).length} countries</div>
				</div>
				<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; max-height: 400px; overflow-y: auto;">
		`;
		
		Object.entries(data)
			.sort((a, b) => b[1] - a[1])
			.forEach(([code, count]) => {
				const intensity = Math.min((count / maxCount) * 100, 100);
				const bgColor = `linear-gradient(135deg, #FFE5CC 0%, #FF9500 ${intensity}%, #FF7800 100%)`;
				
				html += `
					<div style="
						padding: 15px; 
						background: ${bgColor}; 
						border-radius: 8px; 
						border: 2px solid #FF7800; 
						cursor: pointer;
						text-align: center;
						transition: transform 0.2s, box-shadow 0.2s;
						box-shadow: 0 2px 4px rgba(0,0,0,0.1);
					" 
					onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 8px rgba(255,120,0,0.3)';"
					onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';"
					onclick="frappe.set_route('List', 'Application', {destination_country: '${code.toUpperCase()}'})">
						<div style="font-size: 20px; font-weight: bold; color: #282828; margin-bottom: 5px;">${code.toUpperCase()}</div>
						<div style="font-size: 36px; font-weight: bold; color: #FF7800; line-height: 1;">${count}</div>
						<div style="font-size: 11px; color: #666; margin-top: 5px;">Application${count !== 1 ? 's' : ''}</div>
					</div>
				`;
			});
		
		html += '</div></div>';
		container.innerHTML = html;
		console.log('✅ Visual map rendered');
	}

	function init() {
		if (typeof frappe === 'undefined' || typeof $ === 'undefined') {
			setTimeout(init, 100);
			return;
		}

		function checkAndRender() {
			const route = frappe.get_route_str ? frappe.get_route_str() : '';
			const path = window.location.pathname;
			if (route.includes('Applications') || route.includes('applications') || 
				path.includes('/applications') || path.includes('/Applications')) {
				setTimeout(renderWorldMap, 2000);
			}
		}

		$(document).ready(checkAndRender);
		$(document).on('page-change', () => setTimeout(checkAndRender, 1000));
		$(document).on('workspace-loaded', () => setTimeout(checkAndRender, 1000));

		let attempts = 0;
		const interval = setInterval(() => {
			if (document.getElementById('applications-world-map-container')) {
				renderWorldMap();
				clearInterval(interval);
			} else if (attempts++ >= 30) {
				clearInterval(interval);
			}
		}, 1000);
	}

	init();
})();
