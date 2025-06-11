# 🏠 Claire & Warren's Home Hub

A modern, comprehensive home management system built with React, TypeScript, and Material-UI. Designed with earthy tech vibes and glass morphism aesthetics for a beautiful and functional home dashboard.

## ✨ Features

### 📊 Dashboard Overview
- Real-time climate monitoring (temperature & humidity)
- Upcoming calendar events display
- Active project progress tracking with visual progress bars
- Financial summary with bills and payment tracking
- Overdue maintenance alerts and notifications

### 🌡️ Climate Control ✅
- Smart thermostat integration ready (Ecobee, Nest, Honeywell)
- Manual temperature control with sliders for each room
- Temperature scheduling by day/time with recurring schedules
- Sensor management and network device discovery
- Historical climate data tracking and visualization ready

### 🔨 Project & Renovation Tracker ✅
- Complete project CRUD with drag-and-drop status workflow
- Budget tracking with actual vs planned cost monitoring
- Progress tracking with visual progress bars and percentages
- Room-based organization with category filtering
- Timestamped notes and project documentation system
- Quick action buttons for status changes (Start, Pause, Complete)

### 🔧 Maintenance Schedule ✅
- Recurring task management with smart frequency options
- Visual calendar with overdue/upcoming task organization
- Automatic rescheduling after task completion
- Category-based organization (HVAC, Plumbing, Exterior, etc.)
- Time estimation and duration tracking
- Status management (Overdue, Upcoming, Completed)

### 💰 Bills & Financials ✅
- Complete bill management with payment tracking
- Spending analysis with category breakdowns
- Financial overview with monthly totals and trends
- Bank account integration framework ready
- Bill categorization (Mortgage, Utilities, Insurance, HOA)
- Overdue bill alerts and payment reminders

### 📅 Shared Home Calendar ✅
- Full calendar with month view and event management
- Color-coded event types (Contractor, Cleaning, Maintenance, Personal, HOA)
- Event creation with time/location and recurring options
- Upcoming events sidebar with quick overview
- Event editing and management with full CRUD operations
- Google Calendar integration framework ready

### ⚡ Power Hog - Energy Monitor
- MQTT integration for real-time energy readings
- Live power usage graph with Recharts
- Custom alert rules ("warn me if dryer runs past 2 hrs")

## 🎨 Design System

### Color Palette
- **Primary**: Warm neutral brown (#8B7355)
- **Secondary**: Natural green (#7A8471)
- **Background**: Warm off-white gradients
- **Text**: Soft graphite (#3C3C3C)

### Design Principles
- **Glass Morphism**: Translucent backgrounds with soft blur effects
- **Soft Borders**: 16px border radius throughout
- **Earthy Tech**: Warm, natural color palette
- **Responsive**: Mobile-first design with collapsible navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd home-hub

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
# Create production build
npm run build

# For systems with limited memory, use:
NODE_OPTIONS="--max_old_space_size=4096" npm run build
```

## 🏗️ Technical Architecture

### Folder Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Layout-focused pages
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── services/      # API and business logic
├── types/         # TypeScript type definitions
├── theme/         # Material-UI theme configuration
└── stores/        # Zustand state management
```

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **UI Framework**: Material-UI v6 with custom theme
- **State Management**: Zustand with persistent storage
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Charts**: Recharts (ready for climate/financial data)
- **Build Tool**: Create React App with TypeScript

### State Management
- **Zustand Store**: Centralized state with persistent local storage
- **Selector Hooks**: Performance-optimized component subscriptions
- **Type Safety**: Complete TypeScript coverage for all data models

## 📱 Current Sample Data

The app comes pre-loaded with realistic sample data:

- **Climate**: Living Room (72°F, 45% humidity), Bedroom (70°F, 42% humidity)
- **Projects**: Bathroom Renovation (60% complete), Kitchen Cabinet Update (planned)
- **Maintenance**: HVAC filter due in 5 days, Gutter cleaning overdue
- **Bills**: Mortgage ($2,450), Electric ($125) with due dates
- **Events**: Contractor visits, HOA meetings

## 🔧 Development

### Performance Optimizations
- React.memo for component memoization
- useCallback for event handlers
- Zustand selectors to prevent unnecessary re-renders
- Code splitting ready for module expansion

### Adding New Features
1. Define types in `src/types/index.ts`
2. Add store actions in `src/stores/homeStore.ts`
3. Create components in `src/components/`
4. Update navigation in `src/components/navigation.tsx`

### Customization
- Theme colors: `src/theme/index.ts`
- Sample data: `src/stores/homeStore.ts` (generateSampleData function)
- Component styling: Material-UI sx props with theme integration

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Self-Hosted
```bash
npm run build
# Serve build/ folder with any web server
```

## 🔮 Roadmap

### Phase 1: Core Dashboard (✅ Complete)
- Dashboard overview with key metrics
- Navigation and responsive design  
- Sample data and state management

### Phase 2: All Core Modules (✅ Complete)
- Climate Control with network configuration
- Project & Renovation Tracker with full CRUD
- Maintenance Schedule with recurring tasks
- Bills & Financials with spending tracking
- Shared Calendar with event management

### Phase 3: Enhanced Integrations (🔄 Ready for Integration)
- Smart thermostat APIs (Ecobee, Nest, Honeywell)
- Bank/credit card linking with Plaid
- Google Calendar synchronization
- Photo uploads and receipt management
- Push notifications and reminders

### Phase 4: Advanced Features (🔮 Future)
- Mobile app (React Native)
- IoT sensor integration
- AI-powered insights and recommendations
- Voice control integration
- Home automation workflows

## 📄 License

Private project for Claire & Warren's personal use.

## 🤝 Contributing

This is a private home management system. For feature requests or bug reports, please contact the development team.

---

**Home Hub v1.0** - Built with ❤️ for modern home management
