---
created_date: 24/04/2023
updated_date: 24/04/2023
---

# DASHBOARD
## Recently Opened Notes
```dataview
table from "notes"
where file.name != "Homepage"
sort file.mtime desc
limit 15
```
