---
date: 2021-01-04T05:00:00Z
title: Digitizing Project Data
preview: Construction project data is often provided in unwieldy tab sheets. Here's how I transformed it into a valuable, easily consumable digital asset.
previewImg: /img/digitize-project-data.jpg
---

# **Digitizing Project Data**

Construction projects are often provided with project data from the designers in the form of "tab sheets". Tab sheets are a way of organizing data by item of work and location. Due to the fact that a construction project can potentially have thousands of items of work, a set of tab sheets can easily reach 100 pages of content. Searching, filtering, sorting, and aggregating a tab sheet set is painful and often not practical.

The data provided by tab sheets is granular and rich with information that is largely inaccessible due to the format of the sheets themselves. After attempting to use the designer-provided tab sheets for a major construction project, I imagined there must be a better way to present and consume this data. First, let's understand how a tab sheet is organized.

### **The Anatomy of a Tab Sheet**

A tab sheet can take many forms, but in my case, it is a table that is split into many columns representing items of work and the rows representing a range of locations. The content of the cells is the quantity of the item of work at that location. There are not enough columns to fit all of the items of work, so the rows are repeated on many pages so that all the applicable columns can be shown.

![](/img/tab-sheet-anatomy.webp)

The diagram above shows the basic layout of a tab sheet. Each row may have some additional data, further clarifying the location of the work. The street headings also delimit the locations, but further complicate the structure of the table. Given any row, it can be difficult to find the street heading, as it may not even be on the same page.

The problems with the layout are fourfold:

- **The tables are sparse.** Most locations do not contain most items of work. This results in sparse tables, meaning a lot of space is unnecessarily wasted.
- **The table is split over many pages.** In order to find all of the items of work for a given location, one must find all pages with said location.
- **Street headings may not be on the same page.** Each street heading is only shown for the first set of locations. Any further set of locations will not contain a street heading, making it potentially difficult to know what street the current row belongs to.
- **The data is disjointed.** Each phase of construction (drainage, road work, structure work, etc.) is split over different tab sheets.

### **The Solution? Flatten it.**

My goal was to essentially flatten the data. All of the above problems could be solved by transforming the table into a simple, two-dimensional data structure. My proposed table had the following headings:

- Tab Set
- Item #
- Description
- Quantity
- Unit
- Remarks
- Street
- Side
- Begin Station
- End Station

In order to extract the data from the PDF, I wrote a Python script that crawled the PDF and created a line item for every intersection of an "item of work" and a "location". The script then dumped the resulting data to a JSON file, allowing it to be imported into MS Excel, MS Access, or any tool that can handle JSON data.

### **The Results**

Immediately, searching for a specific piece of work was infinitely easier. After dumping the data into Excel, I could search, filter, and sort the data based on _any_ criteria. No longer was I confined to the structure the designers gave us. The spreadsheet soon became the source of truth for the entire project.

The usefulness of the spreadsheet did not end there, however. Because the data was now digitalized, it could be related to internal and external project data we already had digitalized. We could now tie-in cost, revenue, and other accounting details to the tab locations. We could order material based on upcoming quantities of work. Tasks that used to take hours of painful probing of the tab sheets could now be done in seconds with a simple filter and sort.

### **The Takeaway**

I learned to look at the data structures that we consume every day and ask if it can be done better. Is there a way to present this data that is both more informative and more intuitive? Can certain tasks be made easier by transforming the data? It won't always be possible, but if the organization of data is getting in your way, change it.
