# Angular Authentication App 👀

A modern Angular application with comprehensive authentication features, built with TypeScript and Bootstrap 5.

## Features

### 🔐 Authentication System
- **Secure Login** with email and password validation
- **User Registration** with comprehensive form validation
- **Password Strength Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&*)
- **Real-time validation feedback** with visual indicators
- **Password confirmation** matching validation

### 🛡️ Security Features
- **Route Protection** with Angular Guards
- **Local Storage** for session management
- **Mock Authentication** service (easily replaceable with real API)
- **Automatic logout** functionality

### 🎨 User Interface
- **Bootstrap 5** for responsive design
- **Font Awesome** icons for enhanced UX
- **Gradient backgrounds** and modern styling
- **Loading states** and animations
- **Mobile-responsive** design
- **Accessibility** considerations

### 📱 Pages & Components

#### Login Page (`/login`)
- Email and password validation
- Real-time error messages
- Loading states during authentication
- Link to signup page

#### Signup Page (`/signup`)
- Full name, email, and password fields
- Password confirmation validation
- Visual password requirements indicator
- Success/error feedback
- Auto-redirect to login after successful registration

#### Home Page (`/home`)
- Protected route (requires authentication)
- Welcome message with user name
- Dashboard cards with feature placeholders
- Quick action buttons
- Logout functionality

## File Structure

```
src/
├── app/
│   ├── app.component.ts          # Root component
│   ├── app.routes.ts             # Route configuration
│   ├── auth.service.ts           # Authentication service
│   ├── auth.guard.ts             # Route guard
│   ├── password.validator.ts     # Custom password validators
│   ├── login/
│   │   └── login.component.ts    # Login page component
│   ├── signup/
│   │   └── signup.component.ts   # Signup page component
│   └── home/
│       └── home.component.ts     # Home dashboard component
├── main.ts                       # Application bootstrap
├── index.html                    # Main HTML file
├── styles.css                    # Global styles
├── package.json                  # Dependencies
├── README.md                     # about day-2 work                  
├── angular.json                  # Angular configuration
└── tsconfig.json                 # TypeScript configuration
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Angular CLI

### Installation Steps

1. **Install Angular CLI** (if not already installed)
   ```bash
   npm install -g @angular/cli
   ```

2. **Create new Angular project**
   ```bash
   ng new angular-auth-app --routing --style=css --standalone
   cd angular-auth-app
   ```

3. **Install dependencies**
   ```bash
   npm install bootstrap @fortawesome/fontawesome-free
   ```

4. **Copy the provided files** into their respective locations in the `src/` directory

5. **Update angular.json** to include Bootstrap and Font Awesome (already configured in the provided file)

6. **Run the application**
   ```bash
   ng serve
   ```

7. **Open your browser** and navigate to `http://localhost:4200`

## Usage

### Getting Started
1. Navigate to the application (defaults to login page)
2. Click "Sign up here" to create a new account
3. Fill in your details with a strong password
4. After successful registration, login with your credentials
5. Access the protected home dashboard

### Test Credentials
Since this uses local storage, you can create any account you want. The app will remember registered users between sessions.

## Development

### Key Components

#### AuthService
Handles user authentication, registration, and session management using localStorage.

#### AuthGuard
Protects routes that require authentication, redirecting unauthorized users to login.

#### Password Validator
Custom validator ensuring passwords meet security requirements with real-time feedback.

### Customization
- **Styling**: Modify `styles.css` or component-specific styles
- **Validation**: Update `password.validator.ts` for different requirements
- **API Integration**: Replace localStorage logic in `auth.service.ts` with HTTP calls
- **Routes**: Add new routes in `app.routes.ts`

## Technologies Used

- **Angular 17** - Framework
- **TypeScript** - Programming language
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **RxJS** - Reactive programming
- **Angular Reactive Forms** - Form handling
- **Local Storage** - Session persistence

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Production Considerations

Before deploying to production:

1. **Replace mock authentication** with real API endpoints
2. **Implement proper password hashing** (never store plain text passwords)
3. **Add CSRF protection**
4. **Implement proper session management** (JWT tokens, etc.)
5. **Add input sanitization**
6. **Enable HTTPS**
7. **Add proper error logging**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.