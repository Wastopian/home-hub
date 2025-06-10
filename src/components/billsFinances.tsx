import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Receipt,
  CreditCard,
  AccountBalance,
  Add,
  Edit,
  Delete,
  CloudSync,
  Security,
  TrendingUp,
  TrendingDown,
  PieChart,
  AttachMoney,
  Warning,
  CheckCircle,
  Payment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHomeStore, useBills } from '../stores/homeStore';
import { format } from 'date-fns';
import { Bill, BillType, BillStatus } from '../types';

const MotionCard = motion(Card);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div hidden={value !== index} style={{ paddingTop: '24px' }}>
    {value === index && children}
  </div>
);

export const BillsFinances: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [billDialogOpen, setBillDialogOpen] = useState(false);
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [billForm, setBillForm] = useState({
    title: '',
    type: 'Utilities' as BillType,
    amount: 0,
    dueDate: '',
    isRecurring: true,
    frequency: 'Monthly' as const,
    accountNumber: '',
    notes: '',
  });
  const [bankAccounts] = useState([
    { id: '1', name: 'Chase Checking', type: 'checking', balance: 5420.50, connected: true },
    { id: '2', name: 'Savings Account', type: 'savings', balance: 12840.00, connected: true },
    { id: '3', name: 'Credit Card', type: 'credit', balance: -1250.30, connected: false },
  ]);

  const bills = useBills();
  const { addBill, updateBill, deleteBill, markBillAsPaid } = useHomeStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSaveBill = () => {
    const billData = {
      ...billForm,
      dueDate: new Date(billForm.dueDate),
      isPaid: false,
      status: 'Due' as BillStatus,
    };

    if (editingBill) {
      updateBill(editingBill.id, billData);
    } else {
      addBill(billData);
    }
    setBillDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setBillForm({
      title: '',
      type: 'Utilities',
      amount: 0,
      dueDate: '',
      isRecurring: true,
      frequency: 'Monthly',
      accountNumber: '',
      notes: '',
    });
    setEditingBill(null);
  };

  const calculateMonthlyStats = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyBills = bills.filter(bill => bill.dueDate >= startOfMonth);
    const paidBills = monthlyBills.filter(bill => bill.isPaid);
    const overdueBills = bills.filter(bill => bill.dueDate < now && !bill.isPaid).length;

    return {
      totalMonthly: monthlyBills.reduce((sum, bill) => sum + bill.amount, 0),
      totalPaid: paidBills.reduce((sum, bill) => sum + bill.amount, 0),
      totalOverdue: overdueBills,
      upcomingCount: monthlyBills.filter(bill => !bill.isPaid).length,
    };
  };

  const monthlyStats = calculateMonthlyStats();

  const spendingCategories = [
    { name: 'Housing', amount: 2450, percentage: 45, color: '#8B7355' },
    { name: 'Utilities', amount: 320, percentage: 20, color: '#7A8471' },
    { name: 'Insurance', amount: 180, percentage: 15, color: '#A89682' },
    { name: 'Internet/Phone', amount: 140, percentage: 10, color: '#9BA192' },
    { name: 'Other', amount: 110, percentage: 10, color: '#C7C3BA' },
  ];

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Bills & Finances
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your bills, payments, and financial tracking
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setBillDialogOpen(true)}
          sx={{ borderRadius: '12px' }}
        >
          Add Bill
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Card 
          sx={{ 
            flex: '1 1 250px', 
            minWidth: 250,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 115, 85, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Payment sx={{ fontSize: 48, color: '#8B7355', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#8B7355' }}>
              {formatCurrency(monthlyStats.totalMonthly)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monthly Total
            </Typography>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            flex: '1 1 250px', 
            minWidth: 250,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 115, 85, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 48, color: '#7A8471', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#7A8471' }}>
              {formatCurrency(monthlyStats.totalPaid)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paid This Month
            </Typography>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            flex: '1 1 250px', 
            minWidth: 250,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 115, 85, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Warning sx={{ fontSize: 48, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
              {monthlyStats.totalOverdue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue Bills
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Bills Table */}
      <Card 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 115, 85, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            All Bills
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bill</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {bill.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{bill.type}</TableCell>
                    <TableCell>${bill.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={bill.status}
                        size="small"
                        color={
                          bill.status === 'Paid' ? 'success' :
                          bill.status === 'Overdue' ? 'error' : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingBill(bill);
                            setBillForm({
                              title: bill.title,
                              type: bill.type,
                              amount: bill.amount,
                              dueDate: format(bill.dueDate, 'yyyy-MM-dd'),
                              isRecurring: bill.isRecurring,
                              frequency: 'Monthly' as const,
                              accountNumber: bill.accountNumber || '',
                              notes: bill.notes || '',
                            });
                            setBillDialogOpen(true);
                          }}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this bill?')) {
                              deleteBill(bill.id);
                            }
                          }}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                        {!bill.isPaid && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => markBillAsPaid(bill.id)}
                            sx={{ ml: 1, borderRadius: '8px' }}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Bill Dialog */}
      <Dialog open={billDialogOpen} onClose={() => setBillDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBill ? 'Edit Bill' : 'Add New Bill'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Bill Title"
              value={billForm.title}
              onChange={(e) => setBillForm(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <FormControl fullWidth>
              <InputLabel>Bill Type</InputLabel>
              <Select
                value={billForm.type}
                label="Bill Type"
                onChange={(e) => setBillForm(prev => ({ ...prev, type: e.target.value as BillType }))}
              >
                <MenuItem value="Mortgage">Mortgage</MenuItem>
                <MenuItem value="Insurance">Insurance</MenuItem>
                <MenuItem value="HOA">HOA</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
                <MenuItem value="Internet">Internet</MenuItem>
                <MenuItem value="Phone">Phone</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={billForm.amount}
              onChange={(e) => setBillForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              InputProps={{ startAdornment: '$' }}
            />
            
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={billForm.dueDate}
              onChange={(e) => setBillForm(prev => ({ ...prev, dueDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={billForm.isRecurring}
                  onChange={(e) => setBillForm(prev => ({ ...prev, isRecurring: e.target.checked }))}
                />
              }
              label="Recurring Bill"
            />
            
            {billForm.isRecurring && (
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={billForm.frequency || 'Monthly'}
                  label="Frequency"
                  onChange={(e) => setBillForm(prev => ({ ...prev, frequency: e.target.value as any }))}
                >
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Annually">Annually</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBillDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveBill}>
            {editingBill ? 'Update' : 'Add'} Bill
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 