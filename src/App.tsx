import { useState } from 'react'
// Added Edit icon for the profile photo
import { User, Upload, Baby, Home, Bell, Settings, Camera, FileText, CreditCard, Plus, ArrowLeft, Check, Target, MessageSquare, Users, Calendar, Edit } from 'lucide-react';
import { ResponsiveContainer, Cell, Tooltip, PieChart, Pie, Legend } from 'recharts';
import logo from './assets/Picture.png'  // Assuming your logo is in the same directory
import profilepicture from './assets/profilepicture.png' // Assuming you have a profile picture asset

const SoloNestApp = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userAnswers, setUserAnswers] = useState({});
  const [totalMoney, setTotalMoney] = useState(2256);
  const [uploadStep, setUploadStep] = useState('method');
  // Added 'childName' to the new expense state
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    childName: ''
  });
  
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'child', amount: 150.00, description: 'School supplies', date: '2025-06-12', childName: 'Mia' },
    { id: 2, category: 'household', amount: 89.50, description: 'Groceries', date: '2025-06-11' },
    { id: 3, category: 'child', amount: 45.00, description: 'Soccer registration', date: '2025-06-10', childName: 'Leo' },
    { id: 4, category: 'bills', amount: 120.30, description: 'Electricity Bill', date: '2025-05-28' },
    { id: 5, category: 'personal', amount: 35.00, description: 'Coffee with friend', date: '2025-05-25' },
    { id: 6, category: 'child', amount: 75.00, description: 'Art class', date: '2025-05-20', childName: 'Mia' },
    { id: 7, category: 'child', amount: 200.00, description: 'New bicycle', date: '2025-06-01', childName: 'Leo' },
    { id: 8, category: 'child', amount: 30.00, description: 'Music lessons', date: '2025-06-05', childName: 'Mia' },
  ]);

  const [notifications] = useState([
    { id: 1, message: 'Electricity bill due in 3 days', type: 'bill' },
    { id: 2, message: 'You\'ve exceeded your entertainment budget', type: 'budget' }
  ]);

  // Goals state and functionality
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: 'General Savings',
    forWho: 'Me'
  });
  
  // State for chatbot popup
  const [showChatbotPopup, setShowChatbotPopup] = useState(false);

  // --- NEW: State for Co-parent Contribution popup ---
  const [showCoparentPopup, setShowCoparentPopup] = useState(false);

  // State to manage the selected child for filtering
  const [selectedChild, setSelectedChild] = useState('All'); 
  const children = ['Mia', 'Leo']; // Dummy data for children's names

  // Sample financial data for goals
  const [monthlyIncome] = useState(3000);
  
  // Removed static monthlySpending state. It will now be calculated dynamically.
  
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      category: 'Savings',
      forWho: 'Myself (Savings)',
      targetAmount: 5000,
      savedAmount: 1500,
      targetDate: '2025-12-31',
      progress: 30
    },
    {
      id: 2,
      name: "Mia's Education",
      category: 'Education',
      forWho: 'My Child (Education)',
      targetAmount: 20000,
      savedAmount: 3000,
      targetDate: '2035-08-01',
      progress: 15
    },
    {
      id: 3,
      name: 'Family Vacation',
      category: 'Leisure',
      forWho: 'Both of Us (Leisure)',
      targetAmount: 2500,
      savedAmount: 800,
      targetDate: '2026-06-30',
      progress: 32
    }
  ]);
  
    // State for Profile Screen
    const [profileView, setProfileView] = useState('main'); // 'main', 'kids', 'bills'

    // State for Kid's Profiles
    const [kids, setKids] = useState([
      { name: 'Mia', age: 8, education: 'Primary 2' },
      { name: 'Leo', age: 6, education: 'K2' }
    ]);
  
    // State for Bill Management
    const [bills, setBills] = useState([
        { id: 1, name: 'Electricity', dueDate: '2025-07-15' },
        { id: 2, name: 'Water', dueDate: '' },
        { id: 3, name: 'Internet', dueDate: '2025-07-20' },
    ]);

    // --- NEW: State for Profile Picture ---
    // You can replace this URL with an actual image URL
   

  const questions = [
    {
      id: 1,
      text: "How many children do you have?",
      options: ["1", "2", "3", "4+"]
    },
    {
      id: 2,
      text: "What's your primary financial goal?",
      options: ["Save for emergencies", "Plan for children's future", "Manage daily expenses", "Pay off debt"]
    },
    {
      id: 3,
      text: "How do you prefer to track expenses?",
      options: ["Upload receipts", "Manual entry", "Bank sync", "Mix of all"]
    },
    {
      id: 4,
      text: "What's your biggest financial challenge?",
      options: ["Unexpected child expenses", "Managing multiple bills", "Saving consistently", "Budget planning"]
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (answer: string) => {
    setUserAnswers({...userAnswers, [currentQuestion]: answer});
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentScreen('dashboard');
    }
  };

  // Updated addExpense to handle the new expense object structure, including childName
  const addExpense = (expenseData: { category: string; amount: string; description: string; childName?: string }) => {
    const { category, amount, description, childName } = expenseData;
    const newExpenseToAdd: any = {
      id: Date.now(),
      category,
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString().split('T')[0]
    };

    if (category === 'child' && childName) {
      newExpenseToAdd.childName = childName;
    } else if (category === 'child') {
        // Fallback if child name is not selected for some reason
        newExpenseToAdd.childName = children[0] || 'Child';
    }

    setExpenses([newExpenseToAdd, ...expenses]);
    setTotalMoney(totalMoney - parseFloat(amount));
  };
  

  // Goals functions
  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetDate) {
      const goal = {
        id: Date.now(),
        name: newGoal.name,
        category: newGoal.category,
        forWho: newGoal.forWho,
        targetAmount: parseFloat(newGoal.targetAmount),
        savedAmount: 0,
        targetDate: newGoal.targetDate,
        progress: 0
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: '', targetAmount: '', targetDate: '', category: 'General Savings', forWho: 'Me' });
      setShowAddGoal(false);
    }
  };

  const deleteGoal = (goalId: number) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const addContribution = (goalId: number, amount: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newSavedAmount = goal.savedAmount + amount;
        const newProgress = Math.min((newSavedAmount / goal.targetAmount) * 100, 100);
        return {
          ...goal,
          savedAmount: newSavedAmount,
          progress: newProgress
        };
      }
      return goal;
    }));
  };

  // This calculation remains for the dashboard, showing the total for ALL children
  const totalChildExpenses = expenses
    .filter(exp => exp.category === 'child')
    .reduce((sum, exp) => sum + exp.amount, 0);

  // This is the single source of truth for total spending, used by both Dashboard and Goals
  const totalMonthlySpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyBalance = monthlyIncome - totalMonthlySpending;

  const expensesByCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});
  
  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount
  }));

  const COLORS = ['#059669', '#2563eb', '#f59e42', '#a21caf', '#e11d48', '#fbbf24'];

  const RADIAN = Math.PI / 180;
  // This function is for displaying labels on pie charts, now adaptable for percentages
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const monthlyTransactions = expenses.reduce<Record<string, typeof expenses>>((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(expense);
    return acc;
  }, {});

    // Handler for updating kid's profile
    const handleKidUpdate = (index: number, field: 'age' | 'education', value: string | number) => {
        const updatedKids = [...kids];
        updatedKids[index] = { ...updatedKids[index], [field]: value };
        setKids(updatedKids);
    };

    // Handler for updating bill due dates
    const handleBillUpdate = (id: number, dueDate: string) => {
        setBills(bills.map(bill => (bill.id === id ? { ...bill, dueDate } : bill)));
    };


  // Splash Screen
  if (currentScreen === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
           <img 
              src={logo}
              alt="SoloNest Logo" 
              className="w-40 h-40 mx-auto mb-4" // Adjust size as needed
            />

            <h1 className="text-4xl font-bold text-white mb-2">SoloNest</h1>
            <p className="text-emerald-100 text-lg">Your Partner in Solo Parenting and Smart Saving</p>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => setCurrentScreen('auth')}
              className="w-full bg-white text-emerald-600 py-4 px-8 rounded-full font-semibold text-lg shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auth Screen
  if (currentScreen === 'auth') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
             <img 
              src={logo}
              alt="SoloNest Logo" 
              className="w-40 h-40 mx-auto mb-4" // Adjust size as needed
            />

            <h1 className="text-3xl font-bold text-emerald-600 mb-2">SoloNest</h1>
            <p className="text-gray-600">Your Partner in Solo Parenting and Smart Saving</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="w-full bg-emerald-600 text-white py-4 rounded-full font-semibold text-lg"
            >
              Log In
            </button>
            <button 
              onClick={() => setCurrentScreen('questionnaire')}
              className="w-full border-2 border-emerald-600 text-emerald-600 py-4 rounded-full font-semibold text-lg"
            >
              Sign Up
            </button>
            <button 
              onClick={() => setCurrentScreen('questionnaire')}
              className="w-full text-emerald-600 py-2 font-medium"
            >
              Continue as Guest
            </button>
            <div className="text-center space-y-2">
              <p className="text-gray-500 text-sm">Forgot Password?</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Questionnaire Screen
  if (currentScreen === 'questionnaire') {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Let's get to know you</h2>
              <span className="text-emerald-600 font-medium">{currentQuestion + 1}/4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              {questions[currentQuestion].text}
            </h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App Navigation
  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-10">
      <div className="flex justify-around py-2">
        {[
          { screen: 'dashboard', icon: Home, label: 'Home' },
          { screen: 'child', icon: Baby, label: 'Child' },
          { screen: 'goals', icon: Target, label: 'Goals' },
          { screen: 'upload', icon: Upload, label: 'Upload' },
          { screen: 'profile', icon: User, label: 'Profile' }
        ].map(({ screen, icon: Icon, label }) => (
          <button
            key={screen}
            onClick={() => {
              setCurrentScreen(screen);
              setProfileView('main'); // Reset profile view when changing tabs
            }}
            className={`flex flex-col items-center py-2 px-4 ${
              currentScreen === screen ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Goals Screen
  if (currentScreen === 'goals') {
    // Calculate spending and balance dynamically within the component that needs it.
    const monthlySpending = totalMonthlySpending;
    const currentMonthlyBalance = monthlyIncome - monthlySpending;

    if (showAddGoal) {
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
          <div className="bg-emerald-600 text-white p-6 rounded-b-3xl flex items-center">
            <button onClick={() => setShowAddGoal(false)} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Set a New Financial Goal</h1>
          </div>

          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name:</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g., Emergency Fund, Mia's Education"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($):</label>
                  <input
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    placeholder="e.g., 5000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date:</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Who is this goal for?</label>
                  <select
                    value={newGoal.forWho}
                    onChange={(e) => setNewGoal({...newGoal, forWho: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Me">Me</option>
                    <option value="My Child">My Child</option>
                    <option value="Both of Us">Both of Us</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category:</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="General Savings">General Savings</option>
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Home">Home</option>
                </select>
              </div>

              <button
                onClick={addGoal}
                disabled={!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate}
                className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Goal
              </button>
            </div>
          </div>
          
          <NavBar />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-emerald-600 text-white p-6 rounded-b-3xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Financial Goals</h1>
            <button 
              onClick={() => setShowAddGoal(true)}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Budget Snapshot */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Monthly Budget Snapshot</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Income:</p>
                <p className="text-lg font-bold text-emerald-600">${monthlyIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spending:</p>
                <p className="text-lg font-bold text-red-500">${monthlySpending.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Balance:</p>
                <p className="text-lg font-bold text-emerald-600">${currentMonthlyBalance.toLocaleString()}</p>
              </div>
            </div>
            <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium">
              Simulate Monthly Savings Contribution
            </button>
          </div>

          {/* Goals List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Financial Goals</h3>
            <div className="space-y-4">
              {goals.map(goal => (
                <div key={goal.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{goal.name}</h4>
                      <p className="text-sm text-gray-600">For: {goal.forWho}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => addContribution(goal.id, 50)}
                        className="text-emerald-600 text-sm bg-emerald-50 px-3 py-1 rounded-full font-medium"
                      >
                        Add $50
                      </button>
                      <button 
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded-full font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Target: ${goal.targetAmount.toLocaleString()}</span>
                      <span>Saved: ${goal.savedAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress: {goal.progress.toFixed(1)}%</span>
                    <span>Remaining: ${(goal.targetAmount - goal.savedAmount).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalized Recommendations & Grants</h3>
            <p className="text-gray-600 text-sm mb-4">Explore financial opportunities and government grants tailored to support your goals and stability.</p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-emerald-800">OCBC 360 Account: Boost Your Savings!</h4>
                <p className="text-sm text-emerald-700 mb-1">OCBC Bank</p>
                <p className="text-sm text-gray-700 mb-2">Earn higher interest rates on your savings when you credit your salary, make bill payments, or grow your balance.</p>
                <button className="text-emerald-600 text-sm font-medium">Learn More →</button>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-blue-800">CPF Education Scheme: Fund Your Child's Tertiary Education</h4>
                <p className="text-sm text-blue-700 mb-1">CPF Board (Government Grant)</p>
                <p className="text-sm text-gray-700 mb-2">Use your Ordinary Account savings to pay for your own or your children's approved local tertiary education fees.</p>
                <button className="text-blue-600 text-sm font-medium">Learn More →</button>
              </div>
            </div>
          </div>
        </div>
        
        <NavBar />
      </div>
    );
  }

  // Dashboard Screen
  if (currentScreen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-emerald-600 text-white p-6 rounded-b-3xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <div className="relative">
              <button onClick={() => setCurrentScreen('notifications')}>
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <p className="text-emerald-100 text-sm mb-1">Total Balance</p>
            <p className="text-3xl font-bold">${totalMoney.toFixed(2)}</p>
          </div>
          {monthlyBalance > 0 && (
            <div className="bg-emerald-500/80 backdrop-blur-sm rounded-2xl p-4 mb-4 text-white">
              <p className="text-lg font-semibold mb-3">Next Step:</p>
              <p className="text-emerald-100 text-md mb-3">
                You have ${monthlyBalance.toLocaleString()} left this month.
              </p>
              <button
                onClick={() => setCurrentScreen('goals')}
                className="w-full bg-white text-emerald-600 py-3 rounded-lg font-semibold"
              >
                Allocate to a Goal?
              </button>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-gray-600 text-sm">Total Spending</p>
              <p className="text-2xl font-bold text-gray-800">${totalMonthlySpending.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-gray-600 text-sm">Child Expenses</p>
              <p className="text-2xl font-bold text-emerald-600">${totalChildExpenses.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Expense Breakdown</h3>
            <p className="text-sm text-gray-500 mb-4">Spending distribution by category</p>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                  <Legend iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>


          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Recent Transactions</h3>
            {expenses.slice(0, 3).map(expense => (
              <div key={expense.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">{expense.description}</p>
                  <p className="text-sm text-gray-500 capitalize">{expense.category} • {expense.date}</p>
                </div>
                <p className="font-semibold text-gray-800">-${expense.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Monthly Transactions</h3>
            <div className="space-y-4">
              {Object.entries(monthlyTransactions).map(([month, transactions]) => (
                <div key={month}>
                  <h4 className="font-medium text-gray-600 bg-gray-50 p-2 rounded-t-lg">{month}</h4>
                  <div className="border border-gray-200 rounded-b-lg p-2">
                    {transactions.map(expense => (
                       <div key={expense.id} className="grid grid-cols-3 gap-2 items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="col-span-2">
                           <p className="font-medium text-gray-800 text-sm">{expense.description}</p>
                           <p className="text-xs text-gray-500 capitalize">{expense.category} {expense.childName ? `(${expense.childName})` : ''} • {expense.date}</p>
                         </div>
                         <p className="font-semibold text-gray-800 text-right text-sm">-${expense.amount.toFixed(2)}</p>
                       </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Floating Chatbot Button */}
        <button
          onClick={() => setShowChatbotPopup(true)}
          className="fixed bottom-24 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-20"
          aria-label="Chat with AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {/* Chatbot Popup Modal */}
        {showChatbotPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl text-center w-11/12 max-w-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Feature</h3>
                  <p className="text-gray-600 mb-6">Our AI Assistant is a premium feature. Coming soon!</p>
                  <button
                      onClick={() => setShowChatbotPopup(false)}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                      Close
                  </button>
              </div>
          </div>
        )}
        
        <NavBar />
      </div>
    );
  }

  // Child Tab Screen
  if (currentScreen === 'child') {
    const filterAndProcessExpenses = (childName: string | 'All') => {
      const filtered = expenses.filter(expense => {
        if (expense.category !== 'child') return false;
        if (childName === 'All') return true;
        return expense.childName === childName;
      });

      // Group expenses into desired categories
      const categorizedExpenses = filtered.reduce<Record<string, number>>((acc, expense) => {
        let categoryName = 'Others'; // Default category

        if (expense.description.includes('School supplies') || expense.description.includes('Art class')) {
          categoryName = 'School';
        } else if (expense.description.includes('Soccer registration') || expense.description.includes('New bicycle')) {
          categoryName = 'Sports';
        } else if (expense.description.includes('Music lessons')) {
          categoryName = 'Others';
        }

        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        acc[categoryName] += expense.amount;
        return acc;
      }, {});

      return Object.entries(categorizedExpenses).map(([name, value]) => ({
        name,
        value
      }));
    };

    const miaExpensesData = filterAndProcessExpenses('Mia');
    const leoExpensesData = filterAndProcessExpenses('Leo');

    const totalForSelected = expenses
        .filter(expense => {
            if (expense.category !== 'child') return false;
            if (selectedChild === 'All') return true;
            return expense.childName === selectedChild;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

    const filteredTransactionsForList = expenses.filter(expense => {
      if (expense.category !== 'child') return false;
      if (selectedChild === 'All') return true;
      return expense.childName === selectedChild;
    });

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-emerald-600 text-white p-6 rounded-b-3xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Child Expenses</h1>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="bg-white/20 text-white rounded-lg p-2 text-sm font-medium focus:outline-none"
            >
              <option value="All">All Children</option>
              {children.map(child => (
                <option key={child} value={child}>{child}</option>
              ))}
            </select>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-emerald-100 text-sm mb-1">
              {selectedChild === 'All' ? 'Total Child Spending' : `Spending for ${selectedChild}`}
            </p>
            <p className="text-3xl font-bold">${totalForSelected.toFixed(2)}</p>
          </div>
          <div className="bg-emerald-500/80 backdrop-blur-sm rounded-2xl p-4 text-white mt-4">
             {/* --- MODIFIED: Co-parent contribution button now opens a popup --- */}
            <button
              onClick={() => setShowCoparentPopup(true)}
              className="w-full bg-white text-emerald-600 py-3 rounded-lg font-semibold"
            >
              Track Co-parent Contribution
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {selectedChild === 'All' && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Expense Comparison</h3>
              <p className="text-sm text-gray-500 mb-4">Breakdown of spending for each child</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-center font-medium text-gray-700 mb-2">Mia's Expenses</h4>
                  {miaExpensesData.length > 0 ? (
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={miaExpensesData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} fill="#8884d8" dataKey="value" >
                            {miaExpensesData.map((_, index) => ( <Cell key={`mia-cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                          <Legend iconSize={10} layout="vertical" align="right" verticalAlign="middle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No expenses for Mia yet.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-center font-medium text-gray-700 mb-2">Leo's Expenses</h4>
                  {leoExpensesData.length > 0 ? (
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={leoExpensesData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} fill="#8884d8" dataKey="value" >
                            {leoExpensesData.map((_ ,index) => ( <Cell key={`leo-cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                          <Legend iconSize={10} layout="vertical" align="right" verticalAlign="middle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No expenses for Leo yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Transactions for {selectedChild === 'All' ? 'All Children' : selectedChild}</h3>
            {filteredTransactionsForList.length > 0 ? (
              filteredTransactionsForList.map(expense => (
                <div key={expense.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-800">{expense.description}</p>
                    <p className="text-sm text-gray-500">{expense.childName} • {expense.date}</p>
                  </div>
                  <p className="font-semibold text-emerald-600">${expense.amount.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No expenses recorded for {selectedChild}.</p>
            )}
          </div>
        </div>
        
        {/* --- NEW: Co-parent Popup Modal --- */}
        {showCoparentPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl text-center w-11/12 max-w-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Feature</h3>
                  <p className="text-gray-600 mb-6">"Track Co-parent Contribution" is available for premium version users.</p>
                  <button
                      onClick={() => setShowCoparentPopup(false)}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                      Close
                  </button>
              </div>
          </div>
        )}
        <NavBar />
      </div>
    );
  }

  // Upload Screen
  if (currentScreen === 'upload') {
    
    if (uploadStep === 'method') {
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
          <div className="bg-emerald-600 text-white p-6 rounded-b-3xl">
            <h1 className="text-2xl font-bold">Add Expense</h1>
            <p className="text-emerald-100 mt-1">Choose how to add your expense</p>
          </div>

          <div className="p-6 space-y-4">
            {[
              { id: 'takePhoto', icon: Camera, title: 'Take Photo', desc: 'Scan receipt with camera' },
              { id: 'uploadReceipt', icon: FileText, title: 'Upload Receipt', desc: 'Select from gallery' },
              { id: 'bankStatement', icon: CreditCard, title: 'Bank Statement', desc: 'Import from bank' },
              { id: 'manualEntry', icon: Plus, title: 'Manual Entry', desc: 'Enter details manually' }
            ].map(({ id, icon: Icon, title, desc }) => (
              <button
                key={id}
                onClick={() => {
                  setNewExpense({ category: '', amount: '', description: '', childName: '' }); // Reset form
                  if (id === 'takePhoto') {
                    setUploadStep('cameraScan');
                  } else if (id === 'manualEntry') {
                    setUploadStep('details');
                  } else {
                    // Placeholder for other methods
                    setUploadStep('details');
                  }
                }}
                className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow"
              >
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </button>
            ))}
          </div>
          
          <NavBar />
        </div>
      );
    }

    if (uploadStep === 'cameraScan') {
      return (
        <div className="min-h-screen bg-gray-50 pb-20 flex flex-col items-center justify-center text-center">
          <div className="bg-emerald-600 text-white p-6 rounded-b-3xl w-full flex items-center mb-8">
            <button onClick={() => setUploadStep('method')} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Scan Receipt</h1>
          </div>
          <div className="p-6">
            <Camera className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Use your camera to scan the receipt</h2>
            <p className="text-gray-600 mb-8">Point your device camera at the receipt to automatically capture expense details.</p>
            <button
              onClick={() => setUploadStep('method')}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Go Back
            </button>
          </div>
          <NavBar />
        </div>
      );
    }

    if (uploadStep === 'details') {
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
          <div className="bg-emerald-600 text-white p-6 rounded-b-3xl flex items-center">
            <button onClick={() => setUploadStep('method')} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Expense Details</h1>
          </div>

          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select category</option>
                  <option value="child">Child</option>
                  <option value="household">Household</option>
                  <option value="personal">Personal</option>
                  <option value="bills">Bills</option>
                </select>
              </div>

              {/* Conditional dropdown for child name */}
              {newExpense.category === 'child' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">For which child?</label>
                    <select
                      value={newExpense.childName}
                      onChange={(e) => setNewExpense({ ...newExpense, childName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select child</option>
                      {children.map(child => (
                        <option key={child} value={child}>{child}</option>
                      ))}
                    </select>
                  </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="What was this for?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => {
                    // Validation check
                    if (newExpense.category && newExpense.amount && newExpense.description && (newExpense.category !== 'child' || newExpense.childName)) {
                        addExpense(newExpense);
                        setUploadStep('success');
                    }
                }}
                // Updated disabled logic
                disabled={!newExpense.category || !newExpense.amount || !newExpense.description || (newExpense.category === 'child' && !newExpense.childName) }
                className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Expense
              </button>
            </div>
          </div>
          
          <NavBar />
        </div>
      );
    }

    if (uploadStep === 'success') {
      return (
        <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Expense Added!</h2>
            <p className="text-gray-600 mb-6">Your expense has been successfully recorded</p>
            <button
              onClick={() => {
                setUploadStep('method');
                setCurrentScreen('dashboard');
              }}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
          <NavBar />
        </div>
      );
    }
  }

  // Notification Screen
  if (currentScreen === 'notifications') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-emerald-600 text-white p-6 rounded-b-3xl flex items-center">
          <button onClick={() => setCurrentScreen('dashboard')} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Your Notifications</h1>
        </div>

        <div className="p-6">
          {notifications.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Recent Alerts</h3>
              {notifications.map(notification => (
                <div key={notification.id} className="flex items-center p-3 bg-yellow-50 rounded-lg mb-2">
                  <Bell className="w-4 h-4 text-yellow-600 mr-3" />
                  <p className="text-sm text-gray-700">{notification.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
              <p>No new notifications at the moment.</p>
            </div>
          )}
        </div>
        <NavBar />
      </div>
    );
  }

  // Profile Screen with multiple views
  if (currentScreen === 'profile') {
    // Sub-view for Kid Profiles
    if (profileView === 'kids') {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-emerald-600 text-white p-6 rounded-b-3xl flex items-center">
                    <button onClick={() => setProfileView('main')} className="mr-4">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold">Kid Profiles</h1>
                </div>
                <div className="p-6 space-y-4">
                    {kids.map((kid, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">{kid.name}'s Profile</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                <input
                                    type="number"
                                    value={kid.age}
                                    onChange={(e) => handleKidUpdate(index, 'age', parseInt(e.target.value))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                                <input
                                    type="text"
                                    value={kid.education}
                                    onChange={(e) => handleKidUpdate(index, 'education', e.target.value)}
                                    placeholder="e.g., Primary 2"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <NavBar />
            </div>
        );
    }
    
    // Sub-view for Bill Management
    if (profileView === 'bills') {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-emerald-600 text-white p-6 rounded-b-3xl flex items-center">
                    <button onClick={() => setProfileView('main')} className="mr-4">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold">Bill Management</h1>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Set Bill Due Dates</h3>
                        {bills.map((bill) => (
                            <div key={bill.id} className="flex items-center justify-between">
                                <label className="text-gray-700">{bill.name}</label>
                                <input
                                    type="date"
                                    value={bill.dueDate}
                                    onChange={(e) => handleBillUpdate(bill.id, e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <NavBar />
            </div>
        );
    }

    // Main Profile View
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-emerald-600 text-white p-6 rounded-b-3xl">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              {/* --- MODIFIED: Profile Picture with Edit button --- */}
              <div className="relative mr-4">
                  <img src={profilepicture} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                  <button 
                      onClick={() => alert('File upload functionality can be added here!')}
                      className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border-2 border-white"
                  >
                      <Edit className="w-3 h-3" />
                  </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Priscilla Tan</h3>
                <p className="text-gray-600">Parent of {kids.length}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { view: 'kids', icon: Users, title: 'Kid Profiles', desc: 'Manage your children\'s info' },
              { view: 'bills', icon: Calendar, title: 'Bill Management', desc: 'Track upcoming bill due dates' },
              { view: 'settings', icon: Settings, title: 'Settings', desc: 'App preferences' },
              { view: 'notifications', icon: Bell, title: 'Notifications', desc: 'Manage alerts' },
              { view: 'bank', icon: CreditCard, title: 'Link Bank Account', desc: 'Connect your bank' },
              { view: 'privacy', icon: FileText, title: 'Privacy Policy', desc: 'Terms and conditions' }
            ].map(({ view, icon: Icon, title, desc }) => (
              <button 
                key={title} 
                onClick={() => setProfileView(view)}
                className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 text-left"
              >
                <div className="bg-gray-100 p-3 rounded-full">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <NavBar />
      </div>
    );
  }

  return null;
};

export default SoloNestApp;