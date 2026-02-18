# RainyDay

RainyDay is a React + TypeScript + Vite project with a FullCalendar-based planning view.

## Quick Start (Ubuntu/Debian)

Use one command from the repository root:

```bash
./setup-linux.sh
```

The script will:
- Install required system packages (`curl`, `git`, `build-essential`, etc.).
- Install Node.js 22.x + npm if your machine does not already have Node 20+.
- Install npm dependencies for both repository root and `RainyApp/`.
- Run a production build to confirm everything works.

After setup:

```bash
cd RainyApp
npm run dev -- --host
```

Then open the local URL shown in the terminal.

## First-Time Setup Notes

If you cloned on a new machine, make the setup script executable once:

```bash
chmod +x setup-linux.sh
```

Then run:

```bash
./setup-linux.sh
```

## Daily Development Commands

From `RainyApp/`:

```bash
npm run dev        # start local development server
npm run build      # create production build
npm run preview    # preview production build locally
npm run lint       # run ESLint
```

## Project Structure

- `RainyApp/`: main frontend app (React + Vite + TypeScript).
- `RainyApp/src/components/calendar/`: calendar UI components.
- `RainyApp/src/data/`: calendar event data.
- `RainyApp/src/types/`: TypeScript types.
- `setup-linux.sh`: one-command Linux bootstrap/setup script.

## Requirements

- Ubuntu/Debian-based Linux with `sudo` access.
- Internet access (to install packages and npm dependencies).

## Troubleshooting

- `Permission denied` running setup script:
  - Run `chmod +x setup-linux.sh`.
- `sudo: command not found`:
  - Use a machine/user with sudo privileges.
- `apt-get: command not found`:
  - This script targets Ubuntu/Debian. For other Linux distros, install Node 20+ and npm manually, then run `npm ci` in both repo root and `RainyApp/`.
