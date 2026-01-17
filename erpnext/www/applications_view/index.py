import frappe
from frappe import _

no_cache = 1


def get_context(context):
	# Ensure user is logged in
	if frappe.session.user == "Guest":
		frappe.throw(_("Please login to access this page"), frappe.PermissionError)
	
	# Disable sidebar to remove navigation items
	context.show_sidebar = False
	context.no_header = 1
	context.no_footer = 1
	context.sidebar_items = []
	context.title = "Applications View"
	
	return context
