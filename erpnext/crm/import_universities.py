# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import csv
import frappe

@frappe.whitelist()
def import_world_universities():
	"""Import universities from world-universities.csv"""
	
	csv_file_path = "/Users/jashanantal/Downloads/world-universities.csv"
	
	imported = 0
	skipped = 0
	errors = 0
	country_not_found = set()
	
	frappe.msgprint("Starting university import...", alert=True)
	
	with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
		reader = csv.reader(csvfile)
		
		for row_num, row in enumerate(reader, start=1):
			if len(row) < 3:
				continue
			
			country_code = row[0].strip()
			university_name = row[1].strip()
			website = row[2].strip() if len(row) > 2 else ""
			
			if not university_name:
				continue
			
			# Get country name from country code
			country_name = None
			if country_code:
				country_name = frappe.db.get_value("Country", {"code": country_code.upper()}, "name")
				if not country_name:
					country_info = frappe.db.get_value("Country", {"code": country_code.upper()}, "country_name")
					if country_info:
						country_name = frappe.db.get_value("Country", {"country_name": country_info}, "name")
			
			if not country_name:
				country_not_found.add(country_code)
				errors += 1
				continue
			
			# Check if university already exists
			if frappe.db.exists("University", {"uniname": university_name}):
				skipped += 1
				continue
			
			try:
				# Create university
				university = frappe.new_doc("University")
				university.uniname = university_name
				university.country = country_name
				university.website = website if website else None
				
				university.insert(ignore_permissions=True, ignore_links=True)
				imported += 1
				
				# Commit every 100 records
				if imported % 100 == 0:
					frappe.db.commit()
					frappe.msgprint(f"Imported {imported} universities so far...", alert=True)
				
			except Exception as e:
				errors += 1
				frappe.log_error(f"Error importing {university_name}: {str(e)}")
	
	# Final commit
	frappe.db.commit()
	
	result = f"Import complete! Imported: {imported}, Skipped: {skipped}, Errors: {errors}"
	if country_not_found:
		result += f"\nCountry codes not found: {', '.join(sorted(list(country_not_found))[:10])}..."
	
	frappe.msgprint(result, alert=True)
	return result

