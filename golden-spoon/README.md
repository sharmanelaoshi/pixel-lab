# The Golden Spoon

A fine-dining waiter game for an A1–A2 EFL class. It's one HTML file for a classroom smart board.

**To play:** open `golden-spoon.html` in Chrome or Edge. The file works offline, because the fonts, art, music and sounds are all inside it.

- The stage is a fixed 1920×1080 that scales to fit any screen, with no scrolling.
- Dragging works with a finger or a mouse (pointer events).
- The ⚙️ button (top right) opens the teacher settings:
  - number of customers (5 / 8 / 10)
  - turn each step on or off
  - voice on/off
  - music on/off
  - skip step, redo step, restart game
  - full screen

## Game flow (each customer)

1. **Greet**: 3-2-1 countdown, then the class says "Hello! How can I help you?"
2. **Table**: drag the right number of chairs to the table.
3. **Order**: tap the dishes the customer orders. Sometimes they add one more dish after "Would you like anything else?"
4. **Utensils**: the view zooms in to a top-down place setting. Drag the utensils the order needs to their spots.
5. **Serve**: drag each dish to the table in course order: drink → starter → main dish → dessert.
6. **Manners**: find the one rude card out of three.
7. **Plate**: read the fork and knife signal (Pause / Finished / Delicious).
8. **Goodbye**: if the signal was Delicious, the chef comes out to say goodbye. Otherwise the waiters say goodbye.

**Stars:** right on the first try = 2 stars, right on the second try = 1 star. VIP guests give double stars. In the Manners and Plate steps the class gets only one pick.

## Editing

The source is in `src/`:

- `shell.html`: layout and CSS
- `art.js`: all SVG drawings
- `game.js`: game logic

The fonts (Playpen Sans and Playfair Display, both under the SIL Open Font License) are in `fonts/`.

After editing, rebuild the single file:

```
python3 build.py
```
