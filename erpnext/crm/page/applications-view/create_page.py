import frappe

def execute():
    if not frappe.db.exists("Page", "applications-view"):
        doc = frappe.get_doc({
            "doctype": "Page",
            "page_name": "applications-view",
            "title": "Applications View",
            "module": "CRM",
            "standard": "Yes",
            "roles": [
                {"role": "System Manager"},
                {"role": "Sales User"},
                {"role": "Sales Manager"}
            ]
        })
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        print("Page 'applications-view' created successfully.")
    else:
        print("Page 'applications-view' already exists.")

if __name__ == "__main__":
    execute()
