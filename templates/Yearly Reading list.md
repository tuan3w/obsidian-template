---
id: <% tp.file.title.split(" ")[0] %>
created_date: <% tp.file.creation_date('DD/MM/YYYY') %>
updated_date: <% tp.file.creation_date('DD/MM/YYYY') %>
type: resource
---

#  📦 <% tp.date.now('YYYYMMDDHHmmss') %> - <% tp.date.now('YYYY') %> reading list
- **🏷️Tags** :  #<% tp.file.creation_date('MM-YYYY') %> #resource #reading
## 12/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 12 sort file.ctime desc
```
## 11/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 11 sort file.ctime desc
```
## 10/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 10 
sort file.ctime desc
```
## 09/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 9 
sort file.ctime desc
```
## 08/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 8 
sort file.ctime desc
```
## 07/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 7 
sort file.ctime desc
```

## 06/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 6 
sort file.ctime desc
```

## 05/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 5 
sort file.ctime desc
```
## 04/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 4 
sort file.ctime desc
```
## 03/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 3 
sort file.ctime desc
```

## 02/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 2 
sort file.ctime desc
```
## 01/<% tp.date.now('YYYY') %>
```dataview
list from "notes"
where file.ctime.year = <% tp.date.now('YYYY') %> and file.ctime.month = 1 
sort file.ctime desc
```