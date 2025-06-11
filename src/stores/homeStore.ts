import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  AppState, 
  AppActions, 
  TemperatureReading, 
  ClimateSchedule,
  Project, 
  MaintenanceTask, 
  Bill, 
  CalendarEvent,
  DashboardData,
  FinancialSummary,
  ProjectStatus,
  TaskStatus,
  BillStatus,
  ThreatSummary,
} from '../types';
import { fetchWeatherAlerts, fetchCrimeReports, fetchPowerOutages, summarizeThreatLevel } from '../services/threatService';

// Sample data for initial setup
const generateSampleData = () => {
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Sample temperature readings
  const temperatureReadings: TemperatureReading[] = [
    {
      id: uuidv4(),
      roomName: 'Living Room',
      temperature: 72,
      humidity: 45,
      timestamp: now,
      isManual: false,
    },
    {
      id: uuidv4(),
      roomName: 'Bedroom',
      temperature: 70,
      humidity: 42,
      timestamp: now,
      isManual: false,
    },
  ];

  // Sample projects
  const projects: Project[] = [
    {
      id: uuidv4(),
      title: 'Bathroom Renovation',
      description: 'Complete master bathroom remodel with new fixtures and tile work',
      status: 'In Progress' as ProjectStatus,
      room: 'Bathroom',
      budget: 8000,
      actualCost: 4800,
      startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      notes: ['Tile work started', 'Plumbing completed'],
      photos: [],
      receipts: [],
      progress: 60,
    },
    {
      id: uuidv4(),
      title: 'Kitchen Cabinet Update',
      description: 'Replace cabinet hardware and paint cabinets',
      status: 'Planned' as ProjectStatus,
      room: 'Kitchen',
      budget: 1200,
      actualCost: 0,
      startDate: oneWeekFromNow,
      notes: ['Research cabinet paint options'],
      photos: [],
      receipts: [],
      progress: 0,
    },
  ];

  // Sample maintenance tasks
  const maintenanceTasks: MaintenanceTask[] = [
    {
      id: uuidv4(),
      title: 'Replace HVAC Filter',
      description: 'Change air filter in main HVAC unit',
      frequency: 'Monthly',
      nextDueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: 'Upcoming' as TaskStatus,
      category: 'HVAC',
      estimatedDuration: 15,
      isRecurring: true,
    },
    {
      id: uuidv4(),
      title: 'Gutter Cleaning',
      description: 'Clean out gutters and check for damage',
      frequency: 'Quarterly',
      nextDueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      status: 'Overdue' as TaskStatus,
      category: 'Exterior',
      estimatedDuration: 120,
      isRecurring: true,
      room: 'Other',
    },
  ];

  // Sample bills
  const bills: Bill[] = [
    {
      id: uuidv4(),
      title: 'Mortgage Payment',
      type: 'Mortgage',
      amount: 2450,
      dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      isPaid: false,
      status: 'Due' as BillStatus,
      isRecurring: true,
      frequency: 'Monthly',
    },
    {
      id: uuidv4(),
      title: 'Electric Bill',
      type: 'Utilities',
      amount: 125,
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      isPaid: false,
      status: 'Due' as BillStatus,
      isRecurring: true,
      frequency: 'Monthly',
    },
  ];

  // Sample calendar events
  const calendarEvents: CalendarEvent[] = [
    {
      id: uuidv4(),
      title: 'Contractor Visit - Bathroom',
      description: 'Tile installation completion',
      startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      type: 'Contractor',
      allDay: false,
      recurring: false,
    },
    {
      id: uuidv4(),
      title: 'HOA Meeting',
      description: 'Monthly neighborhood meeting',
      startDate: oneWeekFromNow,
      endDate: new Date(oneWeekFromNow.getTime() + 2 * 60 * 60 * 1000),
      type: 'HOA',
      allDay: false,
      recurring: true,
      frequency: 'Monthly',
    },
  ];

  return {
    temperatureReadings,
    projects,
    maintenanceTasks,
    bills,
    calendarEvents,
    threatSummaries: [],
  };
};

const calculateFinancialSummary = (bills: Bill[]): FinancialSummary => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const monthlyBills = bills.filter(bill => bill.dueDate >= startOfMonth);
  const paidBills = monthlyBills.filter(bill => bill.isPaid);
  const overdueBills = bills.filter(bill => bill.dueDate < now && !bill.isPaid);
  const upcomingWeek = bills.filter(bill => 
    bill.dueDate >= now && 
    bill.dueDate <= endOfWeek && 
    !bill.isPaid
  );

  return {
    totalMonthlyExpenses: monthlyBills.reduce((sum, bill) => sum + bill.amount, 0),
    paidThisMonth: paidBills.reduce((sum, bill) => sum + bill.amount, 0),
    remainingThisMonth: monthlyBills.filter(bill => !bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0),
    overdueAmount: overdueBills.reduce((sum, bill) => sum + bill.amount, 0),
    upcomingWeek,
  };
};

const generateDashboardData = (state: Partial<AppState>): DashboardData => {
  const {
    temperatureReadings = [],
    projects = [],
    maintenanceTasks = [],
    bills = [],
    calendarEvents = [],
  } = state;

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    currentTemperature: temperatureReadings.find(r => r.roomName === 'Living Room') || temperatureReadings[0],
    upcomingEvents: calendarEvents
      .filter(event => event.startDate >= now && event.startDate <= nextWeek)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, 3),
    activeProjects: projects
      .filter(project => project.status === 'In Progress')
      .sort((a, b) => b.progress - a.progress),
    overdueTasks: maintenanceTasks.filter(task => task.status === 'Overdue'),
    upcomingBills: bills
      .filter(bill => !bill.isPaid && bill.dueDate <= nextWeek)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5),
    financialSummary: calculateFinancialSummary(bills),
  };
};

type Store = AppState & AppActions;

const initialData = generateSampleData();

export const useHomeStore = create<Store>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        temperatureReadings: initialData.temperatureReadings,
        climateSchedules: [],
        projects: initialData.projects,
        maintenanceTasks: initialData.maintenanceTasks,
        bills: initialData.bills,
        calendarEvents: initialData.calendarEvents,
        threatSummaries: initialData.threatSummaries,
        dashboardData: generateDashboardData(initialData),
        selectedRoom: 'All',
        currentView: 'dashboard',

        // Climate actions
        addTemperatureReading: (reading) => {
          const newReading: TemperatureReading = {
            ...reading,
            id: uuidv4(),
          };
          set(state => ({
            temperatureReadings: [...state.temperatureReadings, newReading],
            dashboardData: generateDashboardData({ ...state, temperatureReadings: [...state.temperatureReadings, newReading] }),
          }));
        },

        addClimateSchedule: (schedule) => {
          const newSchedule: ClimateSchedule = {
            ...schedule,
            id: uuidv4(),
          };
          set(state => ({
            climateSchedules: [...state.climateSchedules, newSchedule],
          }));
        },

        updateClimateSchedule: (id, updates) => {
          set(state => ({
            climateSchedules: state.climateSchedules.map(s => 
              s.id === id ? { ...s, ...updates } : s
            ),
          }));
        },

        deleteClimateSchedule: (id) => {
          set(state => ({
            climateSchedules: state.climateSchedules.filter(s => s.id !== id),
          }));
        },

        // Project actions
        addProject: (project) => {
          const newProject: Project = {
            ...project,
            id: uuidv4(),
          };
          set(state => ({
            projects: [...state.projects, newProject],
            dashboardData: generateDashboardData({ ...state, projects: [...state.projects, newProject] }),
          }));
        },

        updateProject: (id, updates) => {
          set(state => {
            const updatedProjects = state.projects.map(p => 
              p.id === id ? { ...p, ...updates } : p
            );
            return {
              projects: updatedProjects,
              dashboardData: generateDashboardData({ ...state, projects: updatedProjects }),
            };
          });
        },

        deleteProject: (id) => {
          set(state => {
            const filteredProjects = state.projects.filter(p => p.id !== id);
            return {
              projects: filteredProjects,
              dashboardData: generateDashboardData({ ...state, projects: filteredProjects }),
            };
          });
        },

        // Maintenance actions
        addMaintenanceTask: (task) => {
          const newTask: MaintenanceTask = {
            ...task,
            id: uuidv4(),
          };
          set(state => ({
            maintenanceTasks: [...state.maintenanceTasks, newTask],
            dashboardData: generateDashboardData({ ...state, maintenanceTasks: [...state.maintenanceTasks, newTask] }),
          }));
        },

        updateMaintenanceTask: (id, updates) => {
          set(state => {
            const updatedTasks = state.maintenanceTasks.map(task => 
              task.id === id ? { ...task, ...updates } : task
            );
            return {
              maintenanceTasks: updatedTasks,
              dashboardData: generateDashboardData({ ...state, maintenanceTasks: updatedTasks }),
            };
          });
        },

        deleteMaintenanceTask: (id) => {
          set(state => {
            const filteredTasks = state.maintenanceTasks.filter(task => task.id !== id);
            return {
              maintenanceTasks: filteredTasks,
              dashboardData: generateDashboardData({ ...state, maintenanceTasks: filteredTasks }),
            };
          });
        },

        completeMaintenanceTask: (id) => {
          set(state => {
            const updatedTasks = state.maintenanceTasks.map(task => {
              if (task.id === id) {
                const now = new Date();
                let nextDueDate: Date;
                
                switch (task.frequency) {
                  case 'Weekly':
                    nextDueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    break;
                  case 'Monthly':
                    nextDueDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
                    break;
                  case 'Quarterly':
                    nextDueDate = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
                    break;
                  case 'Annually':
                    nextDueDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
                    break;
                  default:
                    nextDueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                }

                return {
                  ...task,
                  status: 'Upcoming' as TaskStatus,
                  lastCompletedDate: now,
                  nextDueDate,
                };
              }
              return task;
            });
            return {
              maintenanceTasks: updatedTasks,
              dashboardData: generateDashboardData({ ...state, maintenanceTasks: updatedTasks }),
            };
          });
        },

        // Bill actions
        addBill: (bill) => {
          const newBill: Bill = {
            ...bill,
            id: uuidv4(),
          };
          set(state => ({
            bills: [...state.bills, newBill],
            dashboardData: generateDashboardData({ ...state, bills: [...state.bills, newBill] }),
          }));
        },

        updateBill: (id, updates) => {
          set(state => {
            const updatedBills = state.bills.map(bill => 
              bill.id === id ? { ...bill, ...updates } : bill
            );
            return {
              bills: updatedBills,
              dashboardData: generateDashboardData({ ...state, bills: updatedBills }),
            };
          });
        },

        deleteBill: (id) => {
          set(state => {
            const filteredBills = state.bills.filter(bill => bill.id !== id);
            return {
              bills: filteredBills,
              dashboardData: generateDashboardData({ ...state, bills: filteredBills }),
            };
          });
        },

        markBillAsPaid: (id) => {
          set(state => {
            const updatedBills = state.bills.map(bill => 
              bill.id === id ? { ...bill, isPaid: true, status: 'Paid' as BillStatus } : bill
            );
            return {
              bills: updatedBills,
              dashboardData: generateDashboardData({ ...state, bills: updatedBills }),
            };
          });
        },

        // Calendar actions
        addCalendarEvent: (event) => {
          const newEvent: CalendarEvent = {
            ...event,
            id: uuidv4(),
          };
          set(state => ({
            calendarEvents: [...state.calendarEvents, newEvent],
            dashboardData: generateDashboardData({ ...state, calendarEvents: [...state.calendarEvents, newEvent] }),
          }));
        },

        updateCalendarEvent: (id, updates) => {
          set(state => {
            const updatedEvents = state.calendarEvents.map(event => 
              event.id === id ? { ...event, ...updates } : event
            );
            return {
              calendarEvents: updatedEvents,
              dashboardData: generateDashboardData({ ...state, calendarEvents: updatedEvents }),
            };
          });
        },

        deleteCalendarEvent: (id) => {
          set(state => {
            const filteredEvents = state.calendarEvents.filter(event => event.id !== id);
            return {
              calendarEvents: filteredEvents,
              dashboardData: generateDashboardData({ ...state, calendarEvents: filteredEvents }),
            };
          });
        },

        // UI actions
        setSelectedRoom: (room) => {
          set({ selectedRoom: room });
        },

        setCurrentView: (view) => {
          set({ currentView: view });
        },

        // Dashboard actions
        refreshDashboard: () => {
          const state = get();
          set({
            dashboardData: generateDashboardData(state),
          });
        },

        fetchThreatSummary: async ({ lat, lon }) => {
          const weatherAlerts = await fetchWeatherAlerts(lat, lon);
          const crimeReports = await fetchCrimeReports(lat, lon);
          const powerOutages = await fetchPowerOutages(lat, lon);

          const level = summarizeThreatLevel({ weatherAlerts, crimeReports, powerOutages });

          const summary: ThreatSummary = {
            id: uuidv4(),
            date: new Date(),
            weatherAlerts,
            crimeReports,
            powerOutages,
            level,
          };

          set(state => ({
            threatSummaries: [summary, ...state.threatSummaries].slice(0, 10),
          }));

          if (level === 'High' || level === 'Severe') {
            console.log('Storm incoming. Charging batteries. Closing blinds. Cutting irrigation.');
          }
        },
      }),
      {
        name: 'home-hub-storage',
        version: 1,
      }
    )
  )
);

// Selector hooks for better performance
export const useDashboardData = () => useHomeStore(state => state.dashboardData);
export const useCurrentView = () => useHomeStore(state => state.currentView);
export const useTemperatureReadings = () => useHomeStore(state => state.temperatureReadings);
export const useProjects = () => useHomeStore(state => state.projects);
export const useMaintenanceTasks = () => useHomeStore(state => state.maintenanceTasks);
export const useBills = () => useHomeStore(state => state.bills);
export const useCalendarEvents = () => useHomeStore(state => state.calendarEvents);
export const useThreatSummaries = () => useHomeStore(state => state.threatSummaries);
