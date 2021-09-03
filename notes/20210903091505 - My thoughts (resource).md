---
id: 20210903091505
created_date: 03/09/2021
updated_date: 03/09/2021
type: resource
tags:
  - resource
  - review
  - ideas

---

#  🧠 20210903091505 - My thoughts (resource)
## My thoughts
```dataview
list from #thought  
where !contains(file.folder, "templates")
sort id desc
````
## Todo
```dataview
list from #thought 
where contains(tags, "todo")
```