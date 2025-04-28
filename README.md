# Charl's Survival Singularity Map

An interactive 3D visualization of statistically impossible survival events, where each event orbits a central singularity as a glowing 3D object.

## Overview

This application creates an immersive 3D universe visualizing survival events based on their type, age, and probability. Events are represented as 3D shapes with different geometries and colors based on their characteristics:

- **Trauma Events**: Triangular/Pyramid shapes
- **Impact Events**: Cubic shapes
- **Biochemical Events**: Spherical shapes
- **Luck Events**: Bullseye/target shapes
- **Micro-causal Events**: Star shapes

Rarer events glow more intensely, and events orbit further from the center based on their age.

## Features

- **Interactive 3D Environment**: Zoom, rotate, and explore the survival events in 3D space
- **Detailed Event Information**: Click on any event to view its full details
- **Event Management**: Add new events through the UI
- **Data Import/Export**: Save and load events via JSON files
- **Persistent Storage**: Events save automatically to browser localStorage

## Installation

1. Clone or download this repository
2. Serve the files using any web server. Options include:
   - Use a local development server like Python's `http.server`:
     ```
     python -m http.server
     ```
   - Use Node.js with http-server:
     ```
     npm install -g http-server
     http-server
     ```
   - Or simply open `index.html` directly in your browser (note: some features may not work due to CORS restrictions)

## Usage

### Navigation Controls

- **Rotate View**: Click and drag
- **Zoom**: Mouse wheel
- **Pan**: Right-click and drag

### Interacting with Events

- **View Basic Info**: Hover over any event to see a tooltip with basic information
- **View Detailed Info**: Click on any event to open a panel with full details
- **Close Detail Panel**: Click the X in the top-right corner of the detail panel

### Managing Events

- **Add Event**: Click the "Add Event" button to open the form and create a new survival event
- **Export Data**: Click "Export Data" to save all events as a JSON file
- **Import Data**: Click "Import Data" to load events from a JSON file
  - Option to replace all existing events or append new ones

## Customizing Events

The application loads events from `data/events.json`. You can edit this file directly to add, remove, or modify events. The JSON structure is:

```json
[
  {
    "id": "unique-id",
    "title": "Event Title",
    "age": 20,
    "year": 2000,
    "type": ["Trauma", "Impact"],
    "probability": 0.000001,
    "description": "Detailed description of the event."
  }
]
```

Fields:
- `id`: Unique identifier (will be generated if missing)
- `title`: Brief title of the event
- `age`: Age when the event occurred (number or text like "Teens")
- `year`: Optional year when the event occurred (can be null)
- `type`: Array of event types (Trauma, Impact, Biochemical, Luck, Micro-causal)
- `probability`: Mathematical probability (e.g., 0.001 for 1 in 1,000)
- `description`: Detailed description of the event

## Technical Details

- Built with Three.js for 3D rendering
- Uses WebGL with postprocessing for glow/bloom effects
- Responsive design works on various screen sizes
- Modular, object-oriented architecture

## Browser Compatibility

Tested and working in:
- Chrome (recommended)
- Firefox
- Edge
- Safari

## Requirements

- Modern browser with WebGL support
- JavaScript enabled

## Troubleshooting

- **Events not loading**: Ensure you're using a web server to serve the files, as direct file access may have CORS issues
- **3D rendering issues**: Check that your browser has WebGL enabled
- **Performance issues**: 
  - Reduce the number of events
  - Close other intensive browser tabs
  - Update your graphics drivers

## License

This project is open-source and free to use and modify.