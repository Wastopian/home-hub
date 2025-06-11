// Climate Control Types
export interface TemperatureReading {
  id: string;
  roomName: string;
  temperature: number;
  humidity: number;
  timestamp: Date;
  isManual: boolean;
}

export interface ClimateSchedule {
  id: string;
  roomName: string;
  startTime: string;
  endTime: string;
  temperature: number;
  days: string[];
  isActive: boolean;
}

// Project & Renovation Types
export type ProjectStatus = 'Planned' | 'In Progress' | 'Paused' | 'Completed';
export type RoomType = 'Kitchen' | 'Living Room' | 'Bedroom' | 'Bathroom' | 'Yard' | 'Garage' | 'Other';

export interface ProjectPhoto {
  id: string;
  url: string;
  caption?: string;
  timestamp: Date;
}

export interface ProjectReceipt {
  id: string;
  description: string;
  amount: number;
  vendor: string;
  date: Date;
  category: string;
  fileUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  room: RoomType;
  budget: number;
  actualCost: number;
  startDate: Date;
  endDate?: Date;
  notes: string[];
  photos: ProjectPhoto[];
  receipts: ProjectReceipt[];
  progress: number; // 0-100 percentage
}

// Maintenance Types
export type TaskFrequency = 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
export type TaskStatus = 'Upcoming' | 'Overdue' | 'Done';

export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  frequency: TaskFrequency;
  nextDueDate: Date;
  lastCompletedDate?: Date;
  status: TaskStatus;
  category: string;
  estimatedDuration: number; // in minutes
  isRecurring: boolean;
  room?: RoomType;
}

// Bills & Financials Types
export type BillType = 'Mortgage' | 'Insurance' | 'HOA' | 'Utilities' | 'Internet' | 'Phone' | 'Other';
export type BillStatus = 'Paid' | 'Due' | 'Overdue';

export interface Bill {
  id: string;
  title: string;
  type: BillType;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  status: BillStatus;
  isRecurring: boolean;
  frequency?: TaskFrequency;
  accountNumber?: string;
  notes?: string;
  fileUrl?: string;
}

export interface FinancialSummary {
  totalMonthlyExpenses: number;
  paidThisMonth: number;
  remainingThisMonth: number;
  overdueAmount: number;
  upcomingWeek: Bill[];
}

// Calendar Types
export type EventType = 'Contractor' | 'Cleaning' | 'Maintenance' | 'Personal' | 'HOA' | 'Other';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: EventType;
  allDay: boolean;
  recurring: boolean;
  frequency?: TaskFrequency;
  location?: string;
  attendees?: string[];
}

// Lighting Scene Types
export interface LightingScene {
  id: string;
  name: string;
  color: string; // Hex color value
  brightness: number; // 0-100 percentage
  temperature: number; // Fahrenheit
}

// Dashboard Types
export interface DashboardData {
  currentTemperature: TemperatureReading;
  upcomingEvents: CalendarEvent[];
  activeProjects: Project[];
  overdueTasks: MaintenanceTask[];
  upcomingBills: Bill[];
  financialSummary: FinancialSummary;
}

// Store Types (for Zustand)
export interface AppState {
  // Climate
  temperatureReadings: TemperatureReading[];
  climateSchedules: ClimateSchedule[];
  
  // Projects
  projects: Project[];
  
  // Maintenance
  maintenanceTasks: MaintenanceTask[];
  
  // Bills
  bills: Bill[];

  // Lighting Scenes
  lightingScenes: LightingScene[];
  
  // Calendar
  calendarEvents: CalendarEvent[];
  
  // Dashboard
  dashboardData: DashboardData;
  
  // UI State
  selectedRoom: RoomType | 'All';
  currentView: 'dashboard' | 'climate' | 'projects' | 'maintenance' | 'bills' | 'calendar' | 'scenes';
}

export interface AppActions {
  // Climate actions
  addTemperatureReading: (reading: Omit<TemperatureReading, 'id'>) => void;
  addClimateSchedule: (schedule: Omit<ClimateSchedule, 'id'>) => void;
  updateClimateSchedule: (id: string, updates: Partial<ClimateSchedule>) => void;
  deleteClimateSchedule: (id: string) => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Maintenance actions
  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id'>) => void;
  updateMaintenanceTask: (id: string, updates: Partial<MaintenanceTask>) => void;
  deleteMaintenanceTask: (id: string) => void;
  completeMaintenanceTask: (id: string) => void;
  
  // Bill actions
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  markBillAsPaid: (id: string) => void;
  
  // Calendar actions
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Lighting scene actions
  addLightingScene: (scene: Omit<LightingScene, 'id'>) => void;
  updateLightingScene: (id: string, updates: Partial<LightingScene>) => void;
  deleteLightingScene: (id: string) => void;
  
  // UI actions
  setSelectedRoom: (room: RoomType | 'All') => void;
  setCurrentView: (view: AppState['currentView']) => void;
  
  // Dashboard actions
  refreshDashboard: () => void;
} 