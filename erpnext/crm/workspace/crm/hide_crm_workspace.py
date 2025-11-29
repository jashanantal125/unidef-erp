# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

"""
Script to hide CRM workspace from navbar
Run with: bench --site [site-name] execute erpnext.crm.workspace.crm.hide_crm_workspace.hide_crm
"""

import frappe
import json


def hide_crm():
	"""Hide CRM workspace from navbar"""
	
	# Update the workspace
	try:
		ws = frappe.get_doc("Workspace", "CRM")
		ws.is_hidden = 1
		ws.save(ignore_permissions=True)
		frappe.db.commit()
		print("✅ Updated CRM workspace: is_hidden = 1")
	except Exception as e:
		print(f"❌ Error updating workspace: {str(e)}")
		frappe.log_error(f"Error hiding CRM workspace: {str(e)}")
	
	# Also update Workspace Settings to hide it
	try:
		ws_settings = frappe.get_single("Workspace Settings")
		workspace_visibility = json.loads(ws_settings.workspace_visibility_json or "{}")
		
		# Set visibility to 0 (hidden) for CRM
		workspace_visibility["CRM"] = 0
		
		ws_settings.workspace_visibility_json = json.dumps(workspace_visibility)
		ws_settings.save(ignore_permissions=True)
		frappe.db.commit()
		print("✅ Updated Workspace Settings to hide CRM")
	except Exception as e:
		print(f"⚠️  Could not update Workspace Settings: {str(e)}")
	
	# Clear cache
	frappe.clear_cache()
	print("✅ Cleared cache")
	print("\n✅ Done! Please refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)")

