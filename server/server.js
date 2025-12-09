const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- DATABASE CONNECTION ----------
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ MONGO_URI is not set in .env');
  process.exit(1);
}

// mongoose
//   .connect(mongoUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1);
//   });
mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ---------- USER MODEL ----------
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// ---------- PRODUCTS (IN-MEMORY FOR NOW) ----------
const products = [
  // Popular
  { id: 1, name: 'Rope Chew Toy', price: 9.99, category: 'popular', tag: 'Dog' },
  { id: 2, name: 'Soft Cat Collar', price: 7.99, category: 'popular', tag: 'Cat' },
  { id: 3, name: 'Cozy Pet Bed', price: 29.99, category: 'popular', tag: 'Dog & Cat' },
  { id: 4, name: 'Bird Swing Perch', price: 12.5, category: 'popular', tag: 'Bird' },
  { id: 5, name: 'Aquarium Gravel Pack', price: 15.0, category: 'popular', tag: 'Fish' },
  { id: 6, name: 'Indoor Tree Planter', price: 24.99, category: 'popular', tag: 'Tree' },

  // Cat & Dog
  { id: 7, name: 'Dog Harness', price: 18.99, category: 'cat-dog' },
  { id: 8, name: 'Cat Scratching Post', price: 21.5, category: 'cat-dog' },
  { id: 9, name: 'Stainless Food Bowl', price: 11.0, category: 'cat-dog' },

  // Bird
  { id: 10, name: 'Bird Seed Mix', price: 8.99, category: 'bird' },
  { id: 11, name: 'Colorful Bird Toy', price: 10.99, category: 'bird' },

  // Fish
  { id: 12, name: 'Aquarium Filter', price: 19.99, category: 'fish' },
  { id: 13, name: 'LED Tank Light', price: 16.99, category: 'fish' },
  { id: 14, name: 'Water Conditioner', price: 6.5, category: 'fish' },

  // Tree
  { id: 15, name: 'Pet-safe Indoor Plant', price: 27.0, category: 'tree' },
  { id: 16, name: 'Decorative Tree Pot', price: 14.99, category: 'tree' },
];

// ---------- BASIC ROUTES ----------
app.get('/', (req, res) => {
  res.send('PetStore API is running 🐾');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PetStore API is running' });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  const filtered = products.filter((p) => p.category === category);
  res.json(filtered);
});

// ---------- AUTH ROUTES ----------

// Demo admin account (still hardcoded)
const demoAdmin = {
  email: 'admin@petstore.com',
  password: 'admin123', // plain here, but NOT stored in Mongo
  name: 'Store Admin',
  role: 'admin',
};

// REGISTER - saves user in MongoDB with hashed password
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    // Prevent conflict with admin email
    if (email === demoAdmin.email) {
      return res.status(409).json({
        success: false,
        message: 'This email is reserved for the admin account',
      });
    }

    // Check if email already exists in DB
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: 'user',
    });

    return res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
});

// LOGIN - checks MongoDB users, then demo admin
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Try MongoDB user
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid email or password' });
      }

      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // 'user'
        },
        token: 'demo-user-token', // placeholder
      });
    }

    // 2) If not in DB, try demo admin
    if (email === demoAdmin.email && password === demoAdmin.password) {
      return res.json({
        success: true,
        user: {
          name: demoAdmin.name,
          email: demoAdmin.email,
          role: demoAdmin.role, // 'admin'
        },
        token: 'demo-admin-token', // placeholder
      });
    }

    // 3) Invalid credentials
    return res
      .status(401)
      .json({ success: false, message: 'Invalid email or password' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ PetStore API running on http://localhost:${PORT}`);
});
