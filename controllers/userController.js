const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup Controller
exports.signup = async (req, res) => {
  const { phoneNumber, email, name, dob, monthlySalary, password } = req.body;

  // Validate age and monthly salary
  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  if (age < 20 || monthlySalary < 25000) {
    return res.status(400).json({ message: 'User does not meet the validation criteria.' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create new user
    user = new User({
      phoneNumber,
      email,
      name,
      dob,
      monthlySalary,
      password: bcrypt.hashSync(password, 10),
      status: 'Approved', // Assuming the user is approved if validation criteria are met
      purchasePower: monthlySalary / 3 // Example calculation for purchase power
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Show User Data Controller
exports.showUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Borrow Money Controller
exports.borrowMoney = async (req, res) => {
  const { amount, tenure } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (amount > user.monthlySalary) {
      return res.status(400).json({ message: 'Borrow amount cannot be greater than monthly salary.' });
    }

    if (user.purchasePower<=0)
    {
      return res.status(400).json({ message: 'You have no purchase power.' });
    }

    user.purchasePower -= amount;
    // Calculate tenure and monthly repayment
    const monthlyRepayment = (amount * 1.08) / tenure;

    await user.save();
    res.json({ purchasePower: user.purchasePower, monthlyRepayment, tenure });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
