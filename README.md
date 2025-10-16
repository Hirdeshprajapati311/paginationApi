# Artworks DataTable App

A **React + TypeScript** application that displays artworks from the **Art Institute of Chicago API** in a **PrimeReact DataTable** with server-side pagination, row selection, and a custom selection panel.

<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/7834db66-7fe3-49d1-934a-d0c17e5b7fc5" />

<img width="1918" height="886" alt="image" src="https://github.com/user-attachments/assets/d84feadf-b450-4f7f-80b7-9f24f43cc086" />


---

## Features

- **Vite + TypeScript**: Modern React setup with type safety.
- **PrimeReact DataTable** with:
  - Server-side pagination
  - Checkbox row selection
  - Lazy loading (fetches only current page)
- **Custom row selection panel**:
  - Select a specific number of rows
  - Selections persist across page changes
- **Robust API handling**:
  - Loading indicators
  - Safe handling of invalid or out-of-range row counts

---

## API

- **Endpoint**: [Art Institute of Chicago API](https://api.artic.edu/api/v1/artworks?page=1)
- **Fields displayed**:
  - `title` – Artwork title
  - `place_of_origin` – Origin of artwork
  - `artist_display` – Artist information
  - `inscriptions` – Artwork inscriptions
  - `date_start` – Start date
  - `date_end` – End date

---

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-project-folder>







