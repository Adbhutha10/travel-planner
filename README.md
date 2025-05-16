# Trip Planner

A modern, interactive web application for planning your dream trips! Organize your itinerary, discover popular activities, view weather forecasts, get essential emergency info, and more—all in one place.

## Features

- **Destination & Date Selection:** Start by entering your destination and travel dates.
- **Day-by-Day Planning:** Create, edit, and reorder daily plans with drag-and-drop support.
- **Popular Activity Suggestions:** Get curated activity ideas for your destination, or generic suggestions for any city.
- **Interactive Map:** Visualize your daily activities and destination using Leaflet maps.
- **Weather Forecast:** See a simulated weather forecast for your trip dates and location.
- **Language Phrasebook:** Access common travel phrases in the local language, with pronunciation support.
- **Emergency Information:** View essential emergency numbers, embassy contacts, and travel advisories for your destination.
- **Calendar & List Views:** Switch between a calendar overview and a detailed list of your trip days.
- **Theme Customization:** Choose from multiple visual themes (Beach, Mountain, City, Classic).
- **Responsive & Accessible:** Works beautifully on desktop and mobile, with accessible UI components.

## How It Works

1. Enter your destination and travel dates.
2. Browse and add suggested activities to each day.
3. View your itinerary in list or calendar mode.
4. Check weather, emergency info, and language phrases.
5. Customize your trip theme and export or print your plan.

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Drag & Drop:** react-beautiful-dnd
- **Mapping:** Leaflet
- **Date Utilities:** date-fns

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adbhutha10/trip-planner.git
   cd trip-planner
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```
The output will be in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
trip-planner/
├── public/                # Static assets (add a screenshot here for GitHub)
├── src/
│   ├── components/        # React UI components (MapView, DayPlanner, etc.)
│   ├── contexts/          # Theme and global state providers
│   ├── data/              # Static data (popular activities)
│   ├── services/          # Mock API/data services (translation, emergency info)
│   ├── App.tsx            # Main app logic
│   ├── main.tsx           # App entry point
│   └── index.css          # Tailwind and global styles
├── package.json           # Project metadata and scripts
├── tailwind.config.js     # Tailwind CSS config
├── vite.config.ts         # Vite config
└── tsconfig.json          # TypeScript config
```

## Notes
- **APIs:** This project uses mock data for weather, translation, and emergency info. In a production app, you would connect to real APIs.
- **Maps:** Uses Leaflet with OpenStreetMap tiles. No API key required.
- **Accessibility:** Designed with accessible components and keyboard navigation in mind.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

## FAQ

**Q: Can I use real APIs for weather or translation?**  
A: The current version uses mock data, but you can integrate real APIs by updating the service files in `src/services/`.

**Q: How do I deploy this app?**  
A: After building (`npm run build`), deploy the `dist/` folder to any static hosting service.

## Acknowledgements

- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Support

For questions or support, open an issue or contact [23211a0533@bvrit.ac.in].

---

*Happy travels and happy planning!* ✈️🌍 