"# CashnGo 💰

CashnGo is a modern student-focused gig platform that connects Nigerian students with skills-based earning opportunities while providing integrated learning resources to upskill themselves.

## 🌟 Features

### For Students

- **Gig Discovery**: Browse and apply for verified student-friendly gigs
- **Skill Development**: Access curated courses with pay-later options
- **Secure Payments**: Receive payments directly to your bank account
- **Progress Tracking**: Track your earnings and course progress
- **Digital Badges**: Earn verifiable skill badges through course completion

### For Employers

- **Talent Access**: Connect with skilled student freelancers
- **Project Management**: Post gigs and manage applications
- **Quality Assurance**: Review student portfolios and skill badges
- **Secure Escrow**: Safe payment handling through the platform

## 🛠️ Tech Stack

- **Frontend**
  - React with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
  - Radix UI for accessible components
  - Framer Motion for animations
  - React Router for navigation

- **UI Components**
  - Custom shadcn/ui component library
  - Lucide React icons
  - React Hook Form for form handling
  - Zod for validation

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/Team-BitNomads/cashngo.git
cd cashngo
```

1. Install frontend dependencies

```bash
cd cashngo-frontend
npm install
```

1. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```typescript
cashngo-frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components and routing
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API and external services
│   ├── types/         # TypeScript type definitions
│   ├── lib/           # Utility functions
│   └── data/          # Mock data and constants
├── public/            # Static assets
└── ...config files
```

## 🔐 Authentication

CashnGo implements secure authentication with:

- Email/Password registration
- BVN verification for Nigerian students
- NIN validation for identity verification
- Session management with secure tokens

## 💳 Payment Integration

- Support for major Nigerian banks
- Integration with fintech providers (Opay, Palmpay, Moniepoint)
- Secure payment processing
- Escrow system for gig payments

## 🎨 UI/UX Features

- Responsive design for all devices
- Dark mode optimization
- Animated transitions
- Accessible components (ARIA compliant)
- Loading states and error handling
- Real-time updates

## 🔄 Development Workflow

1. Create a new branch for features

```bash
git checkout -b feature/your-feature-name
```

1. Make your changes and commit

```bash
git add .
git commit -m "feat: add your feature description"
```

1. Push changes and create a pull request

```bash
git push origin feature/your-feature-name
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Team BitNomads
- Built with ❤️ for Nigerian students

## 📞 Support

For support, please contact us at [support@cashngo.com](mailto:support@cashngo.com) 
