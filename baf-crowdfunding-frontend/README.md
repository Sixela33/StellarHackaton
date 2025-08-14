# Stellar Crowdfunding Platform

A modern, decentralized crowdfunding platform built on Stellar blockchain with milestone-based funding and KYC verification.

## 🚀 Features

### User Flow Implementation
This platform implements the complete user flow as designed in your diagrams:

1. **Initial User Flow**
   - Account creation with web2 methods
   - KYC verification through DIDIT
   - Whitelist addition to smart contracts
   - Access to investment and proposal creation

2. **New Proposal Flow**
   - KYC'd users can create donation requests
   - Frontend stores listing requests in backend
   - Admin approval/denial system
   - On-chain listing deployment

3. **Investment Flow**
   - Users select projects to invest in
   - Investment completion and round funding
   - Milestone validation by judges
   - Fund release based on milestone completion

### Core Components

#### Dashboard
- **KYC Status Banner**: Guides users through verification process
- **User Statistics**: Shows investment totals, active investments, KYC status
- **Campaign Grid**: Displays all active campaigns with progress bars
- **Quick Actions**: Campaign creation, milestone management, progress validation

#### Campaign Creation
- **3-Step Wizard**: Basic info → Milestones → Review
- **Milestone Management**: Define project phases with amounts and evidence requirements
- **Budget Tracking**: Real-time calculation of milestone allocations
- **Admin Review**: Submissions go through approval workflow

#### Campaign Display
- **Visual Cards**: Rich campaign information with images and progress
- **Milestone Preview**: Shows completion status and requirements
- **Investment Interface**: One-click investment with amount input
- **Category Filtering**: Browse campaigns by type

### Technical Features

- **TypeScript**: Full type safety and modern development experience
- **Tailwind CSS**: Beautiful, responsive design system
- **Lucide Icons**: Consistent iconography throughout
- **State Management**: React hooks for local state management
- **Modal System**: Seamless user experience with overlays
- **Form Validation**: Comprehensive input validation and error handling

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd baf-crowdfunding-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Usage Guide

### For Investors

1. **Complete KYC Verification**
   - Click "Complete KYC" button in the header
   - Follow verification process
   - Wait for whitelist approval

2. **Browse Campaigns**
   - View featured campaigns on the dashboard
   - Filter by category (Environment, Healthcare, Education, etc.)
   - Check progress bars and milestone status

3. **Invest in Projects**
   - Click "Invest Now" on any campaign
   - Enter investment amount in XLM
   - Confirm transaction

4. **Track Investments**
   - Monitor total invested amount
   - View active investment count
   - Check campaign progress

### For Campaign Creators

1. **Create Campaign**
   - Click "Create Campaign" button (requires KYC verification)
   - Fill in basic information (title, description, category, goal)
   - Set minimum donation amount and end date

2. **Define Milestones**
   - Add project milestones with specific amounts
   - Set due dates and evidence requirements
   - Ensure milestone total matches campaign goal

3. **Submit for Review**
   - Review all campaign details
   - Submit for admin approval
   - Campaign goes live after approval

### For Admins/Judges

1. **Review Submissions**
   - Approve or deny new campaign requests
   - Validate milestone completion evidence
   - Manage platform content

2. **Milestone Validation**
   - Review milestone evidence submissions
   - Approve milestone completion
   - Release funds to beneficiaries

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard interface
│   ├── CreateCampaign.tsx     # Campaign creation wizard
│   └── AddContribute.tsx      # Investment interface
├── App.tsx                    # Main application component
└── index.tsx                  # Application entry point
```

### Data Flow
1. **User Authentication** → KYC Verification → Whitelist Addition
2. **Campaign Creation** → Admin Review → On-chain Deployment
3. **Investment Process** → Fund Collection → Milestone Validation → Fund Release

### Smart Contract Integration
- Campaign data stored on Stellar blockchain
- Milestone validation triggers fund release
- Transparent and auditable funding process

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb) for main actions and links
- **Success**: Green (#16a34a) for completed states
- **Warning**: Orange (#ea580c) for KYC requirements
- **Neutral**: Gray scale for text and borders

### Typography
- **Headings**: Bold, large text for hierarchy
- **Body**: Regular weight for readability
- **Labels**: Medium weight for form elements

### Spacing
- **Consistent**: 4px grid system throughout
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Proper spacing for touch targets

## 🔒 Security Features

- **KYC Verification**: Identity verification required
- **Whitelist System**: Only verified users can participate
- **Admin Approval**: Campaign review process
- **Milestone Validation**: Evidence-based fund release
- **Smart Contract Security**: On-chain fund management

## 🚧 Future Enhancements

- **Wallet Integration**: Direct Stellar wallet connection
- **Real-time Updates**: Live campaign progress tracking
- **Social Features**: Comments, sharing, and community building
- **Mobile App**: Native mobile application
- **Analytics Dashboard**: Campaign performance metrics
- **Multi-language Support**: International accessibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Stellar ecosystem**
