# Attendance Portal

A comprehensive attendance management system built with React, Node.js, and MongoDB. This application provides a complete solution for tracking employee attendance, managing leave requests, and handling company announcements.

## 🚀 Features

### For Employees
- ✅ **User Authentication** - Secure login/signup with JWT
- ✅ **Dashboard** - Overview of attendance, leave balance, and recent activities
- ✅ **Attendance Tracking** - Check-in/check-out functionality
- ✅ **Leave Management** - Apply for leaves and view leave history
- ✅ **Holiday Calendar** - View upcoming holidays and company events
- ✅ **News Feed** - Stay updated with company announcements

### For Administrators
- ✅ **User Management** - Add, edit, and manage employee accounts
- ✅ **Leave Approval** - Review and approve/reject leave requests
- ✅ **Holiday Management** - Add and manage company holidays
- ✅ **News Management** - Create and publish company announcements
- ✅ **Attendance Reports** - View attendance statistics and reports

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality
- **Express Validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-portal
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/attendance-portal
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-app-password
   CLIENT_URL=http://localhost:3000
   ```

4. **Database Setup**
   
   Make sure MongoDB is running on your system, or update the `MONGODB_URI` to point to your MongoDB Atlas cluster.

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend application**
   ```bash
   cd client
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Mode

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   npm start
   ```

## 📁 Project Structure

```
attendance-portal/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── index.js            # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Attendance
- `GET /api/attendance/me` - Get user's attendance records
- `POST /api/attendance/mark` - Mark attendance (check-in/check-out)
- `GET /api/attendance/today` - Get today's attendance status
- `GET /api/attendance/all` - Get all users' attendance (Admin)

### Leaves
- `GET /api/leaves/me` - Get user's leave history
- `POST /api/leaves/apply` - Apply for leave
- `GET /api/leaves/requests` - Get all leave requests (Admin)
- `POST /api/leaves/approve/:id` - Approve/reject leave (Admin)

### Holidays
- `GET /api/holidays` - Get all holidays
- `GET /api/holidays/upcoming` - Get upcoming holidays
- `POST /api/holidays/add` - Add new holiday (Admin)
- `PUT /api/holidays/:id` - Update holiday (Admin)
- `DELETE /api/holidays/:id` - Delete holiday (Admin)

### News
- `GET /api/news` - Get all published news
- `GET /api/news/latest` - Get latest news
- `POST /api/news/add` - Add new news (Admin)
- `PUT /api/news/:id` - Update news (Admin)
- `DELETE /api/news/:id` - Delete news (Admin)

## 👥 User Roles

### Employee
- View personal dashboard
- Mark attendance (check-in/check-out)
- Apply for leaves
- View holidays and news
- Update profile

### Admin
- All employee permissions
- Manage user accounts
- Approve/reject leave requests
- Add/edit holidays
- Create/edit news and announcements
- View attendance reports

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and automatically included in API requests.

## 📧 Email Configuration

To enable password reset functionality, configure your email settings in the `.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in the EMAIL_PASS field

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by modifying:
- `client/tailwind.config.js` - Tailwind configuration
- `client/src/index.css` - Custom CSS classes

### Colors
The application uses a custom color palette defined in the Tailwind config:
- Primary: Blue shades
- Success: Green shades
- Warning: Yellow/Orange shades
- Danger: Red shades

## 🚀 Deployment

### Backend Deployment (Heroku/Render)
1. Set up environment variables in your hosting platform
2. Deploy the `server` directory
3. Configure MongoDB connection

### Frontend Deployment (Vercel/Netlify)
1. Build the React application
2. Deploy the `build` folder
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- [ ] Dark/Light mode toggle
- [ ] Push notifications
- [ ] QR code attendance
- [ ] Mobile app
- [ ] Advanced reporting
- [ ] Integration with HR systems
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Built with ❤️ using modern web technologies** 